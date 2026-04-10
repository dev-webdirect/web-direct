import { NextRequest, NextResponse } from 'next/server';
import { briefingFormSchema } from '@/src/lib/briefing/schema';
import { validateBriefingToken } from '@/src/lib/briefing/tokens';
import { briefingTaskName, briefingToClickUpDescription } from '@/src/lib/briefing/format-clickup';
import { getRequestClientIp, verifyTurnstileToken } from '@/src/lib/turnstile';

export async function POST(request: NextRequest) {
  const token =
    request.headers.get('x-briefing-token')?.trim() ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();

  if (!validateBriefingToken(token ?? null)) {
    return NextResponse.json({ error: 'Invalid or expired briefing token' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const turnstileToken = typeof raw.turnstileToken === 'string' ? raw.turnstileToken : undefined;
  const { turnstileToken: _omit, ...formFields } = raw;

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (turnstileSecret) {
    if (!turnstileToken?.trim()) {
      return NextResponse.json(
        { error: 'Please complete the security check, then try again.' },
        { status: 400 }
      );
    }
    const remoteip = getRequestClientIp(request);
    const captchaOk = await verifyTurnstileToken(turnstileToken, remoteip);
    if (!captchaOk) {
      return NextResponse.json(
        { error: 'Security check failed. Please try again.' },
        { status: 400 }
      );
    }
  }

  const parsed = briefingFormSchema.safeParse(formFields);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const clickupToken = process.env.CLICKUP_API_TOKEN?.trim();
  const clickupListId = process.env.CLICKUP_CLINET_LIST_ID?.trim();

  if (!clickupToken || !clickupListId) {
    return NextResponse.json({ error: 'ClickUp is not configured on the server' }, { status: 500 });
  }

  const name = briefingTaskName(data);
  const description = briefingToClickUpDescription(data);
  const deadlineMs = data.deadline ? Date.parse(data.deadline) : NaN;

  const briefingStatus =
    process.env.CLICKUP_BRIEFING_TASK_STATUS?.trim() || 'briefing done';

  const payload: Record<string, unknown> = {
    name,
    markdown_description: description,
    status: briefingStatus,
  };

  if (!Number.isNaN(deadlineMs)) {
    payload.due_date = deadlineMs;
  }

  try {
    const res = await fetch(`https://api.clickup.com/api/v2/list/${clickupListId}/task`, {
      method: 'POST',
      headers: {
        Authorization: clickupToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(
        '[api/briefing] ClickUp task creation failed',
        `status=${res.status}`,
        `body=${errText}`,
        `briefing=${name}`,
      );
    } else {
      const task = await res.json();
      console.log('[api/briefing] ClickUp task created', task.id);
    }
  } catch (e) {
    console.error('[api/briefing] ClickUp network error', e);
  }

  return NextResponse.json({ ok: true });
}
