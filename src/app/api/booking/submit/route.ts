import { NextRequest, NextResponse } from 'next/server';
import type { BookingIntakeData } from '@/src/components/BookingIntakeStep';
import type { BookingFormData } from '@/src/components/BookingFormStep';

const GHL_BASE = 'https://services.leadconnectorhq.com';

interface SubmitRequestBody {
  mode: 'full' | 'intake';
  selectedDateTime?: string | null;
  intakeData: BookingIntakeData | null;
  formData: BookingFormData;
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
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: 'Je bent een expert in het maken van website specificaties en prompts voor webdesign. Maak een duidelijke, actiegerichte prompt/specificatie voor het genereren van een website op basis van de gegeven informatie. De prompt moet geschikt zijn om direct gebruikt te worden voor het maken van een website design.',
            },
            {
              role: 'user',
              content: promptPayload,
            },
          ],
          temperature: 0.7,
          max_tokens: 900,
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
        description: taskDescription,
      };

      if (selectedDateTime) {
        const meetingDate = new Date(selectedDateTime);
        const deadlineDate = new Date(meetingDate);
        deadlineDate.setDate(deadlineDate.getDate() - 1);
        deadlineDate.setHours(23, 59, 59, 999);
        taskPayload.due_date = deadlineDate.getTime();
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

function buildWebsiteGenerationPromptJson(intake: BookingIntakeData): string {
  const prompt = {
    company: intake.companyName,
    goal: intake.mainGoal,
    action: intake.primaryAction,
    services: intake.servicesDescription,
    audience: intake.primaryAudience,
    style: intake.style,
    colors: intake.colorHex?.trim() || 'Niet opgegeven',
  };
  return JSON.stringify(prompt, null, 2);
}

function buildSubtaskDescription(
  intake: BookingIntakeData | null,
  form: BookingFormData,
  selectedDateTime: string | null,
  generatedPrompt: string
): string {
  let description = '';

  if (selectedDateTime) {
    try {
      const meetingDate = new Date(selectedDateTime);
      const formattedDate = meetingDate.toLocaleDateString('nl-NL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      description += `📅 **Afspraak:** ${formattedDate}\n\n`;
    } catch {
      description += `📅 **Afspraak:** ${selectedDateTime}\n\n`;
    }
  } else {
    description += '📋 **Type:** Intake-only (geen afspraak via website)\n\n';
  }

  // Personal Information Section
  description += '---\n';
  description += '## 👤 Persoonlijke gegevens\n\n';
  description += `**Naam:** ${form.name}\n`;
  description += `**E-mail:** ${form.email}\n`;
  if (form.phone) {
    description += `**Telefoon:** ${form.phone}\n`;
  }
  description += '\n';

  if (intake) {
    // Project Information Section
    description += '---\n';
    description += '## 🏢 Project informatie\n\n';
    description += `**Bedrijfsnaam:** ${intake.companyName}\n`;
    
    if (intake.projectType === 'existing' && intake.currentWebsiteUrl) {
      description += `**Project type:** Bestaande website updaten/vervangen\n`;
      description += `**Huidige website:** ${intake.currentWebsiteUrl}\n`;
    } else {
      description += `**Project type:** Nieuwe website\n`;
    }
    
    description += `**Hoofddoel:** ${intake.mainGoal}\n`;
    description += `**Belangrijkste actie bezoeker:** ${intake.primaryAction}\n`;
    description += `**Wat centraal staat:** ${intake.focusCentral}\n`;
    description += `**Doelgroep:** ${intake.primaryAudience}\n`;
    description += `**Stijl:** ${intake.style}\n`;
    
    if (intake.colorHex) {
      description += `**Kleuren (Hex):** ${intake.colorHex.trim()}\n`;
    }
    
    description += '\n';

    // Services & Offer Section
    description += '---\n';
    description += '## 💼 Diensten & Aanbod\n\n';
    description += `**Diensten/producten:**\n${intake.servicesDescription}\n\n`;
    
    if (intake.offerExplanation) {
      description += `**Toelichting aanbod:**\n${intake.offerExplanation}\n\n`;
    }
    
    // References Section
    if (intake.favoriteWebsites || intake.competitors || intake.doNotMention) {
      description += '---\n';
      description += '## 🔗 Referenties & Notities\n\n';
      
      if (intake.favoriteWebsites) {
        description += `**Favoriete websites:**\n${intake.favoriteWebsites}\n\n`;
      }
      
      if (intake.competitors) {
        description += `**Concurrenten:**\n${intake.competitors}\n\n`;
      }
      
      if (intake.doNotMention) {
        description += `**Vermijd te benoemen:**\n${intake.doNotMention}\n\n`;
      }
    }

    // Logo files info
    if (intake.logoFiles && intake.logoFiles.length > 0) {
      description += '---\n';
      description += '## 🖼️ Logo bestanden\n\n';
      description += `**Aantal bestanden:** ${intake.logoFiles.length}\n`;
      intake.logoFiles.forEach((file, index) => {
        description += `${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)\n`;
      });
      description += '\n';
    }
  }

  // Website Generation Prompt
  description += '---\n';
  description += '## ✨ Website Generation Prompt\n\n';
  description += 'Deze prompt is gegenereerd op basis van alle ingevulde informatie en kan gebruikt worden voor het genereren van de website:\n\n';
  if (intake) {
    description += '```json\n';
    description += buildWebsiteGenerationPromptJson(intake);
    description += '\n```\n';
    if (generatedPrompt) {
      description += '\n**Aanvullende gegenereerde specificatie (AI):**\n\n';
      description += '```\n';
      description += generatedPrompt;
      description += '\n```\n';
    }
  } else {
    description += 'Geen intake-gegevens beschikbaar. Gebruik de bovenstaande persoonlijke gegevens en afspraak.\n';
  }

  return description;
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

  const origin = request.nextUrl?.origin || request.headers.get('origin') || '';

  await runBackgroundTasks(body, origin);

  return NextResponse.json({ ok: true });
}