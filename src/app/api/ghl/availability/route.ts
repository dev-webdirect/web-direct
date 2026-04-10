import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import {
  GHL_BOOKING_TIMEZONE,
  GHL_QUERY_MAX_DAYS,
  parseFreeSlotsToByDate,
} from '@/src/lib/ghl-free-slots';

const GHL_BASE = 'https://services.leadconnectorhq.com';

const ghlHeaders = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  Version: '2021-07-28',
  Accept: 'application/json',
});

type CalendarMeta = {
  slotDurationMinutes: number | null;
  name: string | null;
};

function readDuration(obj: Record<string, unknown> | undefined): number | null {
  if (!obj) return null;
  const raw =
    obj.slotDuration ??
    obj.slotInterval ??
    obj.duration ??
    (obj.preferences as Record<string, unknown> | undefined)?.slotDuration;
  if (typeof raw === 'number' && raw > 0) return raw;
  if (typeof raw === 'string') {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

function pickSlotDurationMinutes(body: Record<string, unknown>): number | null {
  return (
    readDuration(body) ??
    readDuration(body.calendar as Record<string, unknown>) ??
    readDuration(body.data as Record<string, unknown>)
  );
}

async function loadAvailabilityUncached(): Promise<{
  dates: string[];
  slotsByDate: Record<string, { start_time: string }[]>;
  timezone: string;
  maxDaysAhead: number;
  meta: CalendarMeta;
}> {
  const apiKey = process.env.GHL_API_KEY?.trim();
  const calendarId = process.env.GHL_CALENDAR_ID?.trim();

  if (!apiKey || !calendarId) {
    throw new Error('GHL_NOT_CONFIGURED');
  }

  const now = Date.now();
  const end = now + GHL_QUERY_MAX_DAYS * 24 * 60 * 60 * 1000;

  const [slotsRes, calendarRes] = await Promise.all([
    fetch(
      `${GHL_BASE}/calendars/${calendarId}/free-slots` +
        `?startDate=${now}&endDate=${end}&timezone=${encodeURIComponent(GHL_BOOKING_TIMEZONE)}`,
      { headers: ghlHeaders(apiKey) }
    ),
    fetch(`${GHL_BASE}/calendars/${calendarId}`, {
      headers: ghlHeaders(apiKey),
    }),
  ]);

  if (!slotsRes.ok) {
    const text = await slotsRes.text();
    throw new Error(`GHL_SLOTS_${slotsRes.status}:${text}`);
  }

  const raw = await slotsRes.json();
  const skewMs = 60_000;
  const { slotsByDate, dates } = parseFreeSlotsToByDate(raw, GHL_BOOKING_TIMEZONE, {
    cutoffMs: now - skewMs,
  });

  let meta: CalendarMeta = { slotDurationMinutes: null, name: null };
  if (calendarRes.ok) {
    try {
      const cal = (await calendarRes.json()) as Record<string, unknown>;
      meta = {
        slotDurationMinutes: pickSlotDurationMinutes(cal),
        name: typeof cal.name === 'string' ? cal.name : null,
      };
    } catch {
      /* optional */
    }
  }

  return {
    dates,
    slotsByDate,
    timezone: GHL_BOOKING_TIMEZONE,
    maxDaysAhead: GHL_QUERY_MAX_DAYS,
    meta,
  };
}

const getCachedAvailability = unstable_cache(
  () => loadAvailabilityUncached(),
  ['ghl-calendar-availability', process.env.GHL_CALENDAR_ID?.trim() ?? 'none'],
  { revalidate: 90 }
);

export async function GET() {
  try {
    const body = await getCachedAvailability();
    return NextResponse.json(body);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    if (msg === 'GHL_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'GHL API not configured' }, { status: 500 });
    }
    console.error('[ghl/availability]', msg);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 502 });
  }
}
