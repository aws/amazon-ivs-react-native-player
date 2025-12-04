export type Quality = {
  name: string;
  codecs: string;
  bitrate: number;
  framerate: number;
  width: number;
  height: number;
};

export type PlayerData = {
  qualities: Quality[];
  version: string;
  sessionId: string;
};

export type VideoData = {
  bitrate: number;
  duration: number | null;
  framesDecoded: number | null;
  framesDropped: number | null;
};

export type TextCue = {
  type: string;
  line: number;
  size: number;
  position: number;
  text: string;
  textAlignment: CueTextAlignment;
};

export type CueTextAlignment = 'start' | 'center' | 'end';

export type TextMetadataCue = {
  type: string;
  text: string;
  textDescription: string;
};

export type Source = {
  getId: () => number;
  getUri: () => string;
};

export type IVSPlayerRef = {
  preload: (url: string) => Source;
  loadSource: (source: Source) => void;
  releaseSource: (source: Source) => void;
  play: () => void;
  pause: () => void;
  seekTo: (value: number, callback?: (success: boolean) => void) => void;
  setOrigin: (origin: string) => void;
  togglePip: () => void;
  getLiveLatency: () => number;
};

export type ResizeMode = 'aspectFill' | 'aspectFit' | 'aspectZoom';

export type NetworkRecoveryMode = 'none' | 'resume';
