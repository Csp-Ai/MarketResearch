export interface TelemetryEvent {
  event: string;
  props?: Record<string, any>;
  ts: number;
}

export const events: TelemetryEvent[] = [];
