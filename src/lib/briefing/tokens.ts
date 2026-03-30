export type BriefingTokenEntry = {
  token: string;
  /** Unix seconds; omit for no expiry */
  exp?: number;
};

function stripQuotes(s: string): string {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

/**
 * Parse BRIEFING_ACCESS_TOKENS:
 * - JSON: ["secret1", "secret2"] or [{ "token": "x", "exp": 1735689600 }]
 * - Comma-separated: secret1,secret2 (use quotes if token contains commas)
 */
export function parseBriefingTokenConfig(): BriefingTokenEntry[] {
  const raw = process.env.BRIEFING_ACCESS_TOKENS?.trim();
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item): BriefingTokenEntry | null => {
      if (typeof item === 'string') {
        return { token: item.trim() };
      }
      if (item && typeof item === 'object' && 'token' in item && typeof (item as { token: unknown }).token === 'string') {
        const o = item as { token: string; exp?: number };
        return {
          token: o.token.trim(),
          exp: typeof o.exp === 'number' ? o.exp : undefined,
        };
      }
      return null;
    }).filter((x): x is BriefingTokenEntry => x !== null && x.token.length > 0);
  } catch {
    return raw
      .split(',')
      .map((s) => stripQuotes(s))
      .filter(Boolean)
      .map((token) => ({ token }));
  }
}

export function validateBriefingToken(provided: string | null | undefined): boolean {
  const token = provided?.trim();
  if (!token) return false;

  const nowSec = Math.floor(Date.now() / 1000);
  for (const entry of parseBriefingTokenConfig()) {
    if (entry.token !== token) continue;
    if (entry.exp != null && entry.exp < nowSec) return false;
    return true;
  }
  return false;
}
