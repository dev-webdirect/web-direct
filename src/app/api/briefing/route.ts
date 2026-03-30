import { NextRequest, NextResponse } from 'next/server';
import { briefingFormSchema } from '@/src/lib/briefing/schema';
import { validateBriefingToken } from '@/src/lib/briefing/tokens';
import { briefingTaskName, briefingToClickUpDescription } from '@/src/lib/briefing/format-clickup';

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

  const parsed = briefingFormSchema.safeParse(body);
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
  const deadlineMs = Date.parse(data.deadline);

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
      let details: unknown = errText;
      try {
        details = JSON.parse(errText);
      } catch {
        /* keep string */
      }
      return NextResponse.json({ error: 'ClickUp task creation failed', details }, { status: res.status });
    }

    const task = await res.json();
    return NextResponse.json({ ok: true, taskId: task.id });
  } catch (e) {
    console.error('[api/briefing] ClickUp error', e);
    return NextResponse.json({ error: 'Failed to create briefing task' }, { status: 500 });
  }
}
