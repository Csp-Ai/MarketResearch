import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { events, TelemetryEvent } from '@/lib/telemetry/events';

export async function POST(request: Request) {
  try {
    const { event, props = {}, ts = Date.now() } = await request.json();
    const payload: TelemetryEvent = { event, props, ts };
    events.push(payload);

    const dir = path.join(process.cwd(), '.data', 'telemetry');
    await fs.promises.mkdir(dir, { recursive: true });
    const file = path.join(dir, 'events.ndjson');
    await fs.promises.appendFile(file, JSON.stringify(payload) + '\n');

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
