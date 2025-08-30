import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface TelemetryEvent {
  event: string;
  props?: Record<string, any>;
  ts: number;
}

const events: TelemetryEvent[] = [];

export async function POST(request: Request) {
  try {
    const apiKey = process.env.TELEMETRY_API_KEY;
    if (apiKey) {
      const header = request.headers.get('x-api-key');
      if (header !== apiKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const { event, props = {}, ts = Date.now() } = await request.json();
    if (!event) {
      return NextResponse.json({ error: 'Missing event' }, { status: 400 });
    }
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
