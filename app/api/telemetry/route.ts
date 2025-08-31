import { NextResponse } from 'next/server';
import { TelemetryEventSchema } from '../../../schemas/telemetry';
import { db } from '../../../lib/db/adapter';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = TelemetryEventSchema.parse({ ts: Date.now(), ...body });
    await db.insertTelemetry(event);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

