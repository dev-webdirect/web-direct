import { NextRequest, NextResponse } from 'next/server';
import { GHL_BOOKING_TIMEZONE, GHL_QUERY_MAX_DAYS, parseFreeSlotsToByDate } from '@/src/lib/ghl-free-slots';

const GHL_API_KEY     = process.env.GHL_API_KEY!;
const GHL_CALENDAR_ID = process.env.GHL_CALENDAR_ID!;
const GHL_BASE        = 'https://services.leadconnectorhq.com';

const TIMEZONE = GHL_BOOKING_TIMEZONE;
const MAX_DAYS_AHEAD = GHL_QUERY_MAX_DAYS;

export async function GET(req: NextRequest) {
  if (!GHL_API_KEY || !GHL_CALENDAR_ID) {
    return NextResponse.json(
      { error: 'GHL API not configured' },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const startParam = searchParams.get('start_time');
  const endParam   = searchParams.get('end_time');
  const timezone   = searchParams.get('timezone') || TIMEZONE;

  const now = new Date();
  const nowMs = now.getTime();
  const maxEnd = new Date(nowMs + MAX_DAYS_AHEAD * 24 * 60 * 60 * 1000);

  let startMs: number;
  let endMs: number;

  if (startParam && endParam) {
    const reqStart = new Date(startParam);
    const reqEnd   = new Date(endParam);
    startMs = Math.max(reqStart.getTime(), nowMs);
    endMs   = Math.min(reqEnd.getTime(), maxEnd.getTime());
  } else {
    startMs = nowMs;
    endMs   = Math.min(nowMs + 7 * 24 * 60 * 60 * 1000, maxEnd.getTime());
  }

  try {
    const res = await fetch(
      `${GHL_BASE}/calendars/${GHL_CALENDAR_ID}/free-slots` +
      `?startDate=${startMs}&endDate=${endMs}&timezone=${encodeURIComponent(timezone)}`,
      {
        headers: {
          'Authorization': `Bearer ${GHL_API_KEY}`,
          'Version':       '2021-07-28',
          'Accept':        'application/json',
        },
      },
    );

    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));

    const skewMs = 60_000;
    const { slotsByDate } = parseFreeSlotsToByDate(data, timezone, {
      cutoffMs: nowMs - skewMs,
    });
    const collection: { start_time: string }[] = [];
    for (const slots of Object.values(slotsByDate)) {
      collection.push(...slots);
    }
    collection.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    return NextResponse.json({
      collection,
      max_days_ahead: MAX_DAYS_AHEAD,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[ghl/slots] Error:', message);
    return NextResponse.json(
      { error: 'Failed to fetch available times' },
      { status: 500 },
    );
  }
}
