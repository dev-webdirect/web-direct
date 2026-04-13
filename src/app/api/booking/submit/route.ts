import { NextRequest, NextResponse } from 'next/server';
import type { BookingIntakeData } from '@/src/components/BookingIntakeStep';
import type { BookingFormData } from '@/src/components/BookingFormStep';
import { getRequestClientIp, verifyTurnstileToken } from '@/src/lib/turnstile';

const GHL_BASE = 'https://services.leadconnectorhq.com';

interface SubmitRequestBody {
  mode: 'full' | 'intake';
  selectedDateTime?: string | null;
  intakeData: BookingIntakeData | null;
  formData: BookingFormData;
  turnstileToken?: string;
}

async function runBackgroundTasks(payload: SubmitRequestBody, origin: string) {
  const { mode, selectedDateTime, intakeData, formData } = payload;
  const { name, email } = formData;

  // 1. Generate Magic Path prompt via OpenRouter
  
  
  let generatedPrompt = '';
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!openRouterKey) {
    console.log('[booking/submit] OpenRouter: no OPENROUTER_API_KEY, skipping prompt generation');
  } else if (!intakeData) {
    console.log('[booking/submit] OpenRouter: no intakeData, skipping prompt generation');
  } else {
    try {
      const promptPayload = buildPromptPayload(intakeData, formData);

      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': origin || 'https://www.webdirect.nl',
          'X-Title': 'WebDirect Booking',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: [
                'You are a Magic Path prompt engineer. Your ONLY job is to output a single, ready-to-paste prompt that Magic Path can use to generate a complete website.',
                '',
                'Rules:',
                '- Output ONLY the prompt text. No explanations, no headers, no markdown formatting, no code blocks.',
                '- Write in English.',
                '- The prompt must describe the website in one flowing paragraph (max 200 words) covering: business name, what they do, target audience, desired style/colors, pages needed, primary CTA, and any constraints.',
                '- Be specific and actionable. Use concrete language like "Create a modern single-page website for [company] that..." instead of vague specs.',
                '- Include color preferences if provided, otherwise pick a fitting palette suggestion based on the industry.',
                '- End with the primary call-to-action the site should drive visitors toward.',
              ].join('\n'),
            },
            {
              role: 'user',
              content: promptPayload,
            },
          ],
          temperature: 0.6,
          max_tokens: 500,
        }),
      });

      const responseText = await openRouterRes.text();
      if (openRouterRes.ok) {
        try {
          const openRouterData = JSON.parse(responseText);
          generatedPrompt = openRouterData.choices?.[0]?.message?.content || '';
        } catch (parseErr) {
          console.error('[booking/submit] OpenRouter: response parse error', parseErr);
        }
      } else {
        console.error('[booking/submit] OpenRouter: API error status=', openRouterRes.status, 'body=', responseText);
      }
    } catch (error) {
      console.error('[booking/submit] OpenRouter: request error', error);
    }
  }

  // 2. Build full task description
  const taskDescription = buildSubtaskDescription(intakeData, formData, selectedDateTime || null, generatedPrompt);

  // 3. Create ClickUp task
  const clickupToken = process.env.CLICKUP_API_TOKEN?.trim();
  const clickupListId = process.env.CLICKUP_LIST_ID?.trim();

  if (!clickupToken || !clickupListId) {
    console.log('[booking/submit] ClickUp: skipped (missing CLICKUP_API_TOKEN or CLICKUP_LIST_ID)');
  } else {
    try {
      const taskPayload: Record<string, unknown> = {
        name: `${name} - ${email}`,
        markdown_description: taskDescription,
      };

      if (selectedDateTime) {
        const meetingDate = new Date(selectedDateTime);
        taskPayload.due_date = meetingDate.getTime();
      }

      console.log('[booking/submit] ClickUp task: creating with description length:', taskDescription.length);

      const clickupRes = await fetch(`https://api.clickup.com/api/v2/list/${clickupListId}/task`, {
        method: 'POST',
        headers: {
          Authorization: clickupToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskPayload),
      });

      const taskResponseText = await clickupRes.text();
      if (clickupRes.ok) {
        try {
          const clickupData = JSON.parse(taskResponseText);
          console.log('[booking/submit] ClickUp task created, id:', clickupData.id);
        } catch (parseErr) {
          console.error('[booking/submit] ClickUp task response parse error', parseErr);
        }
      } else {
        console.error('[booking/submit] ClickUp task creation failed status=', clickupRes.status, 'body=', taskResponseText);
      }
    } catch (error) {
      console.error('[booking/submit] ClickUp task creation error:', error);
    }
  }

  // 4. Create GHL appointment (only for full mode with a selectedDateTime)
  
  if (mode === 'full' && selectedDateTime) {
    const ghlApiKey    = process.env.GHL_API_KEY?.trim();
    const ghlCalendarId = process.env.GHL_CALENDAR_ID?.trim();
    const ghlLocationId = process.env.GHL_LOCATION_ID?.trim();

    if (ghlApiKey && ghlCalendarId && ghlLocationId) {
      const ghlHeaders = {
        'Authorization': `Bearer ${ghlApiKey}`,
        'Version':       '2021-07-28',
        'Content-Type':  'application/json',
        'Accept':        'application/json',
      };

      try {
        // 4a. Upsert contact in GHL to get a contactId
        const nameParts = name.trim().split(/\s+/);
        const firstName = nameParts[0] || name;
        const lastName  = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const upsertRes = await fetch(`${GHL_BASE}/contacts/upsert`, {
          method: 'POST',
          headers: ghlHeaders,
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone: formData.phone || undefined,
            locationId: ghlLocationId,
          }),
        });

        if (!upsertRes.ok) {
          const errText = await upsertRes.text();
          console.error('[booking/submit] GHL contact upsert failed:', upsertRes.status, errText);
        } else {
          const contactData = await upsertRes.json();
          const contactId = contactData?.contact?.id;

          if (contactId) {
            // 4b. Create the appointment
            const startTime = new Date(selectedDateTime);
            const endTime   = new Date(startTime.getTime() + 30 * 60 * 1000);

            const appointmentRes = await fetch(`${GHL_BASE}/calendars/events/appointments`, {
              method: 'POST',
              headers: ghlHeaders,
              body: JSON.stringify({
                calendarId: ghlCalendarId,
                locationId: ghlLocationId,
                contactId,
                startTime: startTime.toISOString(),
                endTime:   endTime.toISOString(),
                title: `WebDirect – ${name}`,
                appointmentStatus: 'confirmed',
              }),
            });

            if (!appointmentRes.ok) {
              const errText = await appointmentRes.text();
              console.error('[booking/submit] GHL appointment creation failed:', appointmentRes.status, errText);
            } else {
              console.log('[booking/submit] GHL appointment created for', email);
            }
          } else {
            console.error('[booking/submit] GHL contact upsert returned no contactId');
          }
        }
      } catch (error) {
        console.error('[booking/submit] GHL booking error:', error);
      }
    }
  }
}

function buildSubtaskDescription(
  intake: BookingIntakeData | null,
  form: BookingFormData,
  selectedDateTime: string | null,
  generatedPrompt: string
): string {
  const sections: string[] = [];

  // ── Afspraak ──────────────────────────────────────────
  if (selectedDateTime) {
    try {
      const formattedDate = new Date(selectedDateTime).toLocaleDateString('nl-NL', {
        timeZone: 'Europe/Amsterdam',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      sections.push(`**Afspraak:** ${formattedDate}`);
    } catch {
      sections.push(`**Afspraak:** ${selectedDateTime}`);
    }
  } else {
    sections.push('**Type:** Intake-only (geen afspraak via website)');
  }

  // ── Persoonlijke gegevens ─────────────────────────────
  const personalLines: string[] = [
    '## Persoonlijke gegevens\n',
    `**Naam:** ${form.name}`,
    `**E-mail:** ${form.email}`,
  ];
  if (form.phone) personalLines.push(`**Telefoon:** ${form.phone}`);
  sections.push(personalLines.join('\n'));

  if (intake) {
    // ── Project informatie ────────────────────────────────
    const projectLines: string[] = [
      '## Project informatie\n',
      `**Bedrijfsnaam:** ${intake.companyName}`,
    ];
    if (intake.projectType === 'existing' && intake.currentWebsiteUrl) {
      projectLines.push('**Project type:** Bestaande website updaten/vervangen');
      projectLines.push(`**Huidige website:** ${intake.currentWebsiteUrl}`);
    } else {
      projectLines.push('**Project type:** Nieuwe website');
    }
    projectLines.push(`**Hoofddoel:** ${intake.mainGoal}`);
    projectLines.push(`**Belangrijkste actie bezoeker:** ${intake.primaryAction}`);
    projectLines.push(`**Wat centraal staat:** ${intake.focusCentral}`);
    projectLines.push(`**Doelgroep:** ${intake.primaryAudience}`);
    projectLines.push(`**Stijl:** ${intake.style}`);
    if (intake.colorHex) {
      projectLines.push(`**Kleuren (Hex):** ${intake.colorHex.trim()}`);
    }
    sections.push(projectLines.join('\n'));

    // ── Diensten & Aanbod ─────────────────────────────────
    const serviceLines: string[] = [
      '## Diensten & Aanbod\n',
      `**Diensten/producten:**\n${intake.servicesDescription}`,
    ];
    if (intake.offerExplanation) {
      serviceLines.push(`\n**Toelichting aanbod:**\n${intake.offerExplanation}`);
    }
    sections.push(serviceLines.join('\n'));

    // ── Referenties & Notities ────────────────────────────
    if (intake.favoriteWebsites || intake.competitors || intake.doNotMention) {
      const refLines: string[] = ['## Referenties & Notities\n'];
      if (intake.favoriteWebsites) refLines.push(`**Favoriete websites:**\n${intake.favoriteWebsites}`);
      if (intake.competitors) refLines.push(`\n**Concurrenten:**\n${intake.competitors}`);
      if (intake.doNotMention) refLines.push(`\n**Vermijd te benoemen:**\n${intake.doNotMention}`);
      sections.push(refLines.join('\n'));
    }

    // ── Logo bestanden ────────────────────────────────────
    if (intake.logoFiles && intake.logoFiles.length > 0) {
      const logoLines: string[] = [
        '## Logo bestanden\n',
        `**Aantal bestanden:** ${intake.logoFiles.length}`,
      ];
      intake.logoFiles.forEach((file, index) => {
        logoLines.push(`${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      });
      sections.push(logoLines.join('\n'));
    }
  }

  // ── Magic Path Prompt ────────────────────────────────────
  if (generatedPrompt) {
    const promptLines: string[] = [
      '## Magic Path Prompt\n',
      'Onderstaande prompt is klaar om te plakken in Magic Path:\n',
      generatedPrompt,
    ];
    sections.push(promptLines.join('\n'));
  }

  return sections.join('\n\n---\n\n');
}

function buildPromptPayload(intake: BookingIntakeData, form: BookingFormData): string {
  let payload = `Context: De klant heeft alvast info gegeven over hun situatie en doelen (bespaart ~10 min tijdens het gesprek). Maak hieruit één prompt/spec om een website te genereren.\n\n`;

  payload += `Bedrijfsnaam: ${intake.companyName}\n`;
  payload += `Contactpersoon: ${intake.contactPerson}\n`;
  
  if (intake.projectType === 'existing' && intake.currentWebsiteUrl) {
    payload += `Huidige website: ${intake.currentWebsiteUrl}\n`;
  } else {
    payload += `Project type: Nieuwe website\n`;
  }

  payload += `Hoofddoel: ${intake.mainGoal}\n`;
  payload += `Belangrijkste actie bezoeker: ${intake.primaryAction}\n`;
  payload += `Diensten/producten: ${intake.servicesDescription}\n`;
  payload += `Wat centraal staat: ${intake.focusCentral}\n`;
  
  if (intake.offerExplanation) {
    payload += `Toelichting aanbod: ${intake.offerExplanation}\n`;
  }

  payload += `Doelgroep: ${intake.primaryAudience}\n`;
  payload += `Stijl: ${intake.style}\n`;
  
  if (intake.colorHex) {
    payload += `\nColors (use these hex codes in the website): ${intake.colorHex.trim()}\n`;
  }

  if (intake.favoriteWebsites) {
    payload += `Favoriete websites (inspiratie): ${intake.favoriteWebsites}\n`;
  }

  if (intake.competitors) {
    payload += `Concurrenten: ${intake.competitors}\n`;
  }

  if (intake.doNotMention) {
    payload += `Vermijd te benoemen: ${intake.doNotMention}\n`;
  }

  return payload;
}

export async function POST(request: NextRequest) {
  let body: SubmitRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  // Default mode to 'full' for backwards compatibility
  if (!body.mode) {
    body.mode = 'full';
  }

  // Validate required fields
  const missing: string[] = [];

  if (body.mode === 'full') {
    if (!body.selectedDateTime || typeof body.selectedDateTime !== 'string') {
      missing.push('selectedDateTime');
    }
  }

  if (!body.formData || typeof body.formData !== 'object') {
    missing.push('formData');
  } else {
    if (!body.formData.name || typeof body.formData.name !== 'string') {
      missing.push('formData.name');
    }
    if (!body.formData.email || typeof body.formData.email !== 'string') {
      missing.push('formData.email');
    }
  }

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(', ')}`, missing },
      { status: 400 }
    );
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (turnstileSecret) {
    if (!body.turnstileToken || typeof body.turnstileToken !== 'string') {
      return NextResponse.json(
        { error: 'Beveiligingscontrole ontbreekt. Vernieuw de pagina en probeer opnieuw.' },
        { status: 400 }
      );
    }
    const remoteip = getRequestClientIp(request);

    const captchaOk = await verifyTurnstileToken(body.turnstileToken, remoteip);
    if (!captchaOk) {
      return NextResponse.json(
        { error: 'Beveiligingscontrole mislukt. Probeer het opnieuw.' },
        { status: 403 }
      );
    }
  }

  const origin = request.nextUrl?.origin || request.headers.get('origin') || '';

  await runBackgroundTasks(body, origin);

  return NextResponse.json({ ok: true });
}