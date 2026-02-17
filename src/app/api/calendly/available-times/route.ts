import { NextRequest, NextResponse } from 'next/server';

const CALENDLY_API_BASE = 'https://api.calendly.com';

const MIN_NOTICE_HOURS = 4;
const MAX_DAYS_AHEAD = 31;
const CALENDLY_MAX_RANGE_DAYS = 7;

function toISO(date: Date): string {
  return date.toISOString().split('.')[0] + 'Z';
}

export async function GET(request: NextRequest) {
  const token = process.env.CALENDLY_API_TOKEN;
  const eventTypeUuid = process.env.CALENDLY_EVENT_TYPE_UUID;

  if (!token || !eventTypeUuid) {
    return NextResponse.json(
      { error: 'Calendly API not configured' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const startParam = searchParams.get('start_time');
  const endParam = searchParams.get('end_time');

  const now = new Date();
  const minStart = new Date(now.getTime() + MIN_NOTICE_HOURS * 60 * 60 * 1000);
  const maxEnd = new Date(now.getTime() + MAX_DAYS_AHEAD * 24 * 60 * 60 * 1000);

  let startTime: string;
  let endTime: string;

  if (startParam && endParam) {
    const reqStart = new Date(startParam);
    const reqEnd = new Date(endParam);
    if (reqStart < minStart) {
      startTime = toISO(minStart);
    } else {
      startTime = reqStart.toISOString();
    }
    if (reqEnd > maxEnd) {
      endTime = toISO(maxEnd);
    } else {
      endTime = reqEnd.toISOString();
    }
    const rangeDays = (new Date(endTime).getTime() - new Date(startTime).getTime()) / (24 * 60 * 60 * 1000);
    if (rangeDays > CALENDLY_MAX_RANGE_DAYS) {
      const endDate = new Date(startTime);
      endDate.setDate(endDate.getDate() + CALENDLY_MAX_RANGE_DAYS);
      endTime = toISO(endDate);
    }
  } else {
    startTime = toISO(minStart);
    const endDate = new Date(minStart);
    endDate.setDate(endDate.getDate() + CALENDLY_MAX_RANGE_DAYS);
    if (endDate > maxEnd) {
      endTime = toISO(maxEnd);
    } else {
      endTime = toISO(endDate);
    }
  }

  const eventTypeUri = `${CALENDLY_API_BASE}/event_types/${eventTypeUuid}`;
  const url = `${CALENDLY_API_BASE}/event_type_available_times?event_type=${encodeURIComponent(eventTypeUri)}&start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: 'Calendly API error', details: err },
        { status: res.status }
      );
    }

    const data = (await res.json()) as {
      collection?: Array<{ start_time: string; invitees_remaining?: number }>;
    };

    const collection = data.collection ?? [];
    const cutoff = minStart.getTime();

    const filtered = collection.filter((slot) => new Date(slot.start_time).getTime() >= cutoff);

    return NextResponse.json({
      collection: filtered,
      min_notice_hours: MIN_NOTICE_HOURS,
      max_days_ahead: MAX_DAYS_AHEAD,
    });
  } catch (error) {
    console.error('Calendly available-times error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available times' },
      { status: 500 }
    );
  }
}
