import { NextRequest, NextResponse } from 'next/server';
import type { BookingIntakeData } from '@/src/components/BookingIntakeStep';
import type { BookingFormData } from '@/src/components/BookingFormStep';

const CALENDLY_API_BASE = 'https://api.calendly.com';

interface SubmitRequestBody {
  selectedDateTime: string;
  intakeData: BookingIntakeData | null;
  formData: BookingFormData;
}

async function runBackgroundTasks(payload: SubmitRequestBody, origin: string) {
  const { selectedDateTime, intakeData, formData } = payload;
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
      console.log('[booking/submit] OpenRouter: sending request (payload length:', promptPayload.length, ')');

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
          console.log('[booking/submit] OpenRouter: success, prompt length:', generatedPrompt.length);
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

  // Structured Website Generation Prompt is always built from intake in buildSubtaskDescription (no fallback needed here).

  // 2. Build full task description (all user info + structured prompt + optional AI prompt)
  const taskDescription = buildSubtaskDescription(intakeData, formData, selectedDateTime, generatedPrompt);

  // 3. Create ClickUp task with all information in the task body
  const clickupToken = process.env.CLICKUP_API_TOKEN?.trim();
  const clickupListId = process.env.CLICKUP_LIST_ID?.trim();

  if (!clickupToken || !clickupListId) {
    console.log('[booking/submit] ClickUp: skipped (missing CLICKUP_API_TOKEN or CLICKUP_LIST_ID)');
  } else if (!selectedDateTime) {
    console.log('[booking/submit] ClickUp: skipped (no selectedDateTime)');
  } else {
    try {
      const meetingDate = new Date(selectedDateTime);
      const deadlineDate = new Date(meetingDate);
      deadlineDate.setDate(deadlineDate.getDate() - 1);
      deadlineDate.setHours(23, 59, 59, 999);
      const dueDateMs = deadlineDate.getTime();

      console.log('[booking/submit] ClickUp task: creating with description length:', taskDescription.length);

      const clickupRes = await fetch(`https://api.clickup.com/api/v2/list/${clickupListId}/task`, {
        method: 'POST',
        headers: {
          Authorization: clickupToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${name} - ${email}`,
          due_date: dueDateMs,
          description: taskDescription,
        }),
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

  // 4. Create Calendly invitee
  // Temporarily commented out

  const calendlyToken = process.env.CALENDLY_API_TOKEN?.trim();
  const eventTypeUuid = process.env.CALENDLY_EVENT_TYPE_UUID?.trim();
  const locationKind = process.env.CALENDLY_LOCATION_KIND?.trim();

  if (calendlyToken && eventTypeUuid && selectedDateTime) {
    try {
      const eventTypeUri = `${CALENDLY_API_BASE}/event_types/${eventTypeUuid}`;
      const requestBody: Record<string, unknown> = {
        event_type: eventTypeUri,
        start_time: selectedDateTime,
        invitee: {
          email,
          name,
          timezone: 'Europe/Amsterdam',
        },
      };

      if (locationKind) {
        requestBody.location = { kind: locationKind };
      }

      await fetch(`${CALENDLY_API_BASE}/invitees`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${calendlyToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error('Calendly booking error:', error);
    }
  }
  
}

/** Build the structured Website Generation Prompt JSON from intake data (always adapted from actual form data). */
function buildWebsiteGenerationPromptJson(intake: BookingIntakeData): string {
  const prompt = {
    company: intake.companyName,
    goal: intake.mainGoal,
    action: intake.primaryAction,
    services: intake.servicesDescription,
    audience: intake.primaryAudience,
    style: intake.style,
    colors: intake.colorHex?.trim() || 'Niet opgegeven',
    budget: intake.budget,
  };
  return JSON.stringify(prompt, null, 2);
}

function buildSubtaskDescription(
  intake: BookingIntakeData | null,
  form: BookingFormData,
  selectedDateTime: string,
  generatedPrompt: string
): string {
  let description = '';

  // Format meeting date/time
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
    description += `**Budget:** ${intake.budget}\n`;
    
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

  // Website Generation Prompt – always adapted from intake data (structured JSON)
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

  payload += `Budget: ${intake.budget}\n`;

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

  // Validate required fields
  const missing: string[] = [];
  if (!body.selectedDateTime || typeof body.selectedDateTime !== 'string') {
    missing.push('selectedDateTime');
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

  // Fire-and-forget: start background tasks without awaiting
  void runBackgroundTasks(body, origin);

  // Return immediately
  return NextResponse.json({ ok: true });
}
