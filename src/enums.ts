export enum LogLevel {
  IVSLogLevelDebug,
  IVSLogLevelInfo,
  IVSLogLevelWarning,
  IVSLogLevelError,
}

export enum PlayerState {
  Idle = 'Idle',
  Ready = 'Ready',
  Buffering = 'Buffering',
  Playing = 'Playing',
  Ended = 'Ended',
}
