export interface StateFlowPayload {
  [key: string]: unknown;
}

export interface StateFlowTraceOptions {
  enabled?: boolean;
  id: string;
}

export function traceStateFlow(
  options: StateFlowTraceOptions,
  phase: string,
  payload: StateFlowPayload = {}
) {
  if (!options.enabled) return;
  const message = `[StateFlow] ${JSON.stringify({
    ts: Date.now(),
    id: options.id,
    phase,
    ...payload,
  })}`;
  if (
    phase.includes('grant') ||
    phase.includes('release') ||
    phase.includes('commit') ||
    phase.includes('terminate')
  ) {
    console.warn(message);
    return;
  }
  console.log(message);
}
