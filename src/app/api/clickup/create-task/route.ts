import { NextRequest, NextResponse } from 'next/server';

interface CreateTaskRequestBody {
  name: string;
  email: string;
  meetingStartTime: string;
}

export async function POST(request: NextRequest) {
  const clickupToken = process.env.CLICKUP_API_TOKEN?.trim();
  const clickupListId = process.env.CLICKUP_LIST_ID?.trim();

  if (!clickupToken || !clickupListId) {
    return NextResponse.json(
      { error: 'ClickUp API not configured' },
      { status: 500 }
    );
  }

  let body: CreateTaskRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const meetingStartTime = typeof body.meetingStartTime === 'string' ? body.meetingStartTime.trim() : '';

  const missing: string[] = [];
  if (!name) missing.push('name');
  if (!email) missing.push('email');
  if (!meetingStartTime) missing.push('meetingStartTime');

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(', ')}`, missing },
      { status: 400 }
    );
  }

  try {
    // Calculate deadline: 1 day before meeting, end of day (23:59:59)
    const meetingDate = new Date(meetingStartTime);
    const deadlineDate = new Date(meetingDate);
    deadlineDate.setDate(deadlineDate.getDate() - 1);
    deadlineDate.setHours(23, 59, 59, 999);
    const dueDateMs = deadlineDate.getTime();

    const res = await fetch(`https://api.clickup.com/api/v2/list/${clickupListId}/task`, {
      method: 'POST',
      headers: {
        Authorization: clickupToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${name} - ${email}`,
        due_date: dueDateMs,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let details: unknown = errText;
      try {
        details = JSON.parse(errText);
      } catch {
        /* keep as string */
      }
      return NextResponse.json(
        { error: 'ClickUp task creation failed', details },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('ClickUp task creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create ClickUp task' },
      { status: 500 }
    );
  }
}
