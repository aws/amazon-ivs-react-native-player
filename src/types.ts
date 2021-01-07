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

export type TextCue = {
  type: string;
  line: number;
  size: number;
  position: number;
  text: string;
  textAlignment: string;
};

export type TextMetadataCue = {
  type: string;
  text: string;
  textDescription: string;
};
