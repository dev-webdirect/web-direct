import { NextRequest, NextResponse } from 'next/server';

const CALENDLY_API_BASE = 'https://api.calendly.com';

interface BookRequestBody {
  startTime: string;
  name: string;
  email: string;
  timezone?: string;
}

export async function POST(request: NextRequest) {
  const token = process.env.CALENDLY_API_TOKEN;
  const eventTypeUuid = process.env.CALENDLY_EVENT_TYPE_UUID;

  if (!token || !eventTypeUuid) {
    return NextResponse.json(
      { error: 'Calendly API not configured' },
      { status: 500 }
    );
  }

  let body: BookRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const startTime = typeof body.startTime === 'string' ? body.startTime.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';

  const missing: string[] = [];
  if (!startTime) missing.push('startTime');
  if (!name) missing.push('name');
  if (!email) missing.push('email');

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(', ')}`, missing },
      { status: 400 }
    );
  }

  const eventTypeUri = `${CALENDLY_API_BASE}/event_types/${eventTypeUuid}`;
  const locationKind = process.env.CALENDLY_LOCATION_KIND?.trim();

  const requestBody: Record<string, unknown> = {
    event_type: eventTypeUri,
    start_time: startTime,
    invitee: {
      email,
      name,
      timezone: body.timezone ?? 'Europe/Amsterdam',
    },
  };

  if (locationKind) {
    requestBody.location = { kind: locationKind };
  }

  try {
    const res = await fetch(`${CALENDLY_API_BASE}/invitees`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      let details: unknown = errText;
      try {
        details = JSON.parse(errText);
      } catch {
        /* keep as string */
      }
      const isLocationKindError =
        typeof errText === 'string' &&
        /location kind|Specified location kind/i.test(errText);
      const hint = isLocationKindError
        ? ' Configure CALENDLY_LOCATION_KIND in .env.local (e.g. calendly_conference, zoom_conference, google_conference) to match your event type\'s location.'
        : '';
      return NextResponse.json(
        { error: `Calendly booking failed.${hint}`, details },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Create ClickUp task after successful Calendly booking
    const clickupToken = process.env.CLICKUP_API_TOKEN?.trim();
    const clickupListId = process.env.CLICKUP_LIST_ID?.trim();

    if (clickupToken && clickupListId) {
      try {
        const clickupRes = await fetch(`${request.nextUrl.origin}/api/clickup/create-task`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            meetingStartTime: startTime,
          }),
        });

        if (!clickupRes.ok) {
          const clickupError = await clickupRes.json().catch(() => ({}));
          console.error('ClickUp task creation failed:', clickupError);
          // Don't fail the booking if ClickUp fails - just log it
        }
      } catch (clickupError) {
        console.error('ClickUp task creation error:', clickupError);
        // Don't fail the booking if ClickUp fails - just log it
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Calendly book error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
