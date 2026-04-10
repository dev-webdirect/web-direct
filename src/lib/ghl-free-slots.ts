/** Europe/Amsterdam — must match GHL calendar / booking UI */
export const GHL_BOOKING_TIMEZONE = 'Europe/Amsterdam';

/** Upper bound for free-slots queries (how far ahead we show); GHL still applies notice / closed days */
export const GHL_QUERY_MAX_DAYS = 14;

export type GhlTimeSlot = { start_time: string };

export function calendarDateKeyFromIso(iso: string, timeZone: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone });
}

/**
 * Parse LeadConnector GET .../free-slots JSON body.
 * Drops slots strictly before cutoffMs (default 0). Use ~now for past-slot hygiene only.
 */
export function parseFreeSlotsToByDate(
  data: unknown,
  timeZone: string,
  opts?: { cutoffMs?: number }
): { slotsByDate: Record<string, GhlTimeSlot[]>; dates: string[] } {
  const cutoff = opts?.cutoffMs ?? 0;
  const slotsByDate: Record<string, GhlTimeSlot[]> = {};
  const seenPerDay = new Map<string, Set<string>>();

  if (!data || typeof data !== 'object') {
    return { slotsByDate: {}, dates: [] };
  }

  for (const [, value] of Object.entries(data as Record<string, unknown>)) {
    if (!value || typeof value !== 'object' || !Array.isArray((value as { slots?: unknown }).slots)) {
      continue;
    }
    for (const slotIso of (value as { slots: string[] }).slots) {
      const t = new Date(slotIso).getTime();
      if (Number.isNaN(t) || t < cutoff) continue;
      const key = calendarDateKeyFromIso(slotIso, timeZone);
      if (!seenPerDay.has(key)) seenPerDay.set(key, new Set());
      const set = seenPerDay.get(key)!;
      if (set.has(slotIso)) continue;
      set.add(slotIso);
      if (!slotsByDate[key]) slotsByDate[key] = [];
      slotsByDate[key].push({ start_time: slotIso });
    }
  }

  for (const key of Object.keys(slotsByDate)) {
    slotsByDate[key].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  }

  const dates = Object.keys(slotsByDate)
    .filter((d) => slotsByDate[d].length > 0)
    .sort();
  return { slotsByDate, dates };
}
