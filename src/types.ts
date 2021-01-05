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
