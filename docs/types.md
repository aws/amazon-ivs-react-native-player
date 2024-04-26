# TYPES AND ENUMS

## LogLevel

```ts
enum LogLevel {
  IVSLogLevelDebug,
  IVSLogLevelInfo,
  IVSLogLevelWarning,
  IVSLogLevelError,
}
```

## PlayerState

```ts
export enum PlayerState {
  Idle,
  Ready,
  Buffering,
  Playing,
  Ended,
}
```

## Quality

```ts
export type Quality = {
  name: string;
  codecs: string;
  bitrate: number;
  framerate: number;
  width: number;
  height: number;
};
```

## PlayerData

```ts
export type PlayerData = {
  qualities: Quality[];
  version: string;
  sessionId: string;
};
```

## TextCue

```ts
export type TextCue = {
  type: string;
  line: number;
  size: number;
  position: number;
  text: string;
  textAlignment: string;
};
```

## TextMetadataCue

```ts
export type TextMetadataCue = {
  type: string;
  text: string;
  textDescription: string;
};
```

## ResizeMode

```ts
export type ResizeMode = 'aspectFill' | 'aspectFit' | 'aspectZoom';
```

## Source

```ts
export type Source = {
  getId: () => void;
  getUri: () => void;
};
```