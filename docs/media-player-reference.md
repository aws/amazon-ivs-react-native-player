# Media Player component - reference

Media Player components allows setup and interaction with native implementation of Amazon IVS player on iOS and Android.
This document contains information about available props, callbacks, and refs.

Amazon IVS documentation:
https://docs.aws.amazon.com/ivs/index.html

Android reference:
https://aws.github.io/amazon-ivs-player-docs/1.2.1/android/reference/packages.html

iOS reference:
https://aws.github.io/amazon-ivs-player-docs/1.2.0/ios/index.html

Web reference:
https://aws.github.io/amazon-ivs-player-docs/1.2.0/web/

```ts
import MediaPlayer from 'react-native-amazon-ivs';

function App() {
  return (
    <MediaPlayer streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8" />
  );
}
```

## Props

### streamUrl _(optional)_

An URL of the the stream to load. Should be in a valid URL format.

default: `undefined`
type: `string`

### autoplay _(optional)_

Opening a player or specifying new `streamUrl` will make it automatically play, when it is ready.

default: `false`
type: `boolean`

### looping _(optional)_

Only works with videos. When turned on it will loop the video instead of stopping at the end.

default: `false`
type: `boolean`

### logLevel _(optional)_

Specifies level of logging information from player to the console.

default: `IVSLogLevelError`
type: [`LogLevel`](./types.md#LogLevel)

### muted _(optional)_

Disables audio from the currently played video/stream.

default: `false`
type: `boolean`

### paused _(optional)_

Pauses playback of current video/stream.

default: `false`
type: `boolean`

### playbackRate _(optional)_

Sets playback rate that the video will be player.
Minimal value is `0.5`. Maximum is `2.0`.

default: `1.0`
type: `number`

### volume _(optional)_

Set audio volume. This setting is independent from device volume.
Minimal value is `0.0`. Maximum is `1.0`.

default: `1.0`
type: `number`

### quality _(optional)_

Specifies what video/stream quality should be used for playback.
Available qualites for current video/stream can be read from `onData` callback.

type: [`Quality`](./types.md#Quality)

### autoMaxQuality _(optional)_

Specifies maximum quality that can be used when `autoQualityMode` is turned on.

default: `undefined`
type: [`Quality`](./types.md#Quality)

### maxQuality _(optional)_

Specifies maximum quality that can be used.

Android only
type: [`Quality`](./types.md#Quality)

### autoQualityMode _(optional)_

Automatically select video quality based on the quality of the internet connection.

default: `true`
type: `boolean`

### maxVideoSize _(optional)_

Some description. // TODO: proper description here

Android only
type: `{ width: number, height: number }`

### initialBitrate _(optional)_

Some description. // TODO: proper description here

Android only
type: `number`

### maxBitrate _(optional)_

Some description. // TODO: proper description here

Android only
type: `number`

### liveLowLatency _(optional)_

Indicates whether live low-latency streaming is enabled for the current stream.
Only works with live streams.

type: `boolean`

### playerConfig _(optional)_

Some description. // TODO: proper description here

Web only
type: `{ wasmBinary: string, wasmWorker: string }`

### onBuffer _(optional)_

Some description. // TODO: proper description here

type: `(buffer: number) => void`

### onError _(optional)_

Callback function that is called when error occurs.

type: `(error: string) => void`

### onLiveLatencyChange _(optional)_

Callback that return changes in live latency.

type: `(liveLatency: number) => void`

### onBandwidthEstimateChange _(optional)_

Callback that returns changes in bandthwidth estimate.

type: `(bandwithEstimate: number) => void`

### onData _(optional)_

Callback that returns qualities, version, and sessionId, when new data is present.

type: `({ qualities: Quality, version: string, sessionId: string }) => void`

### onVideo _(optional)_

Callback that return changes in duration, bitrate, framesDropped, and framesDecoded.
Duration returns null if no stream is loaded or the stream length is infinite or unknown.

type: `({ duration: number | null, bitrate: number, framesDropped: number, framesDecoded: number }) => void`

### onPlayerStateChange _(optional)_

Callback that returns player state when it changes. E.g. play, pause, error, buffering, etc.

type: [`(state: PlayerState) => void`](./types.md#)

### onLoad _(optional)_

Callback that is called on new video load.
This returns null if no stream is loaded or the stream length is infinite or unknown.

type: `(duration: number | number) => void`

### onLoadStart _(optional)_

Callback that is called on new video load.

type: `() => void`

### onProgress _(optional)_

Callback that returns current player position. Its interval can be configured using `progressInterval` prop.

iOS only
type: `(position: number) => void`

### progressInterval _(optional)_

Value that specifies how often `onProgress` callback should be called in seconds.

default: `1`
type: `number`

### onTimePoint _(optional)_

Callback that returns current player position. Only called when position is included in `breakpoints` prop array.

!!!WARNING!!! You need to specify `breakpoint` for this callback to be called called. !!!WARNING!!!

iOS only
type: `(position: number) => number`

### breakpoints _(optional)_

Specifies time breakpoints in which `onTimePoint` callback should be called. Breakpoint value is seconds.

default: `[]`
type: `number[]`

### onTextCue _(optional)_

Callback that returns text cue when it is present during video/stream playback.

type: [`(textCue: TextCue => void)`](./types.md#TextCue)

### onTextMetadataCue _(optional)_

Callback that returns text metadata cue when it is present from video/stream playback.

type: [`(textMetadataCue: TextMetadataCue => void)`](./types.md#TextMetadataCue)

### onDurationChange _(optional)_

Callback that returns changes to the duration of video/stream.
This returns null if no stream is loaded or the stream length is infinite or unknown.

type: `(duration: number | null) => void`

### onSeek _(optional)_

Callback that returns new position when it is changed using `seekTo` ref.

type: `(position: number) => void`

### onQualityChange _(optional)_

Callback that returns new quality that is used in video/stream playback.

type: [`(quality: Quality) => void`](./types.md#Quality)

## Ref methods

### play

A reference method that will play the stream/video if it is stopped. For a stream that is currently playing it won't do anything.

type: `() => void`

```tsx
import MediaPlayer from "react-native-amazon-ivs";

function App() {
  const mediaPlayerRef = React.useRef<MediaPlayerRef>(null);

  const handlePlay = () => { mediaPlayerRef.current?.play() };

  return (
    <>
      <MediaPlayer ref={mediaPlayerRef} streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8" />
      <Button onPress={handlePlay} title="Play">
    </>
  );
}
```

### pause

A reference method that will pause the stream/video if it is playing. For a stream that is currently paused it won't do anything.

type: `() => void`

```tsx
import MediaPlayer from "react-native-amazon-ivs";

function App() {
  const mediaPlayerRef = React.useRef<MediaPlayerRef>(null);

  const handlePause = () => { mediaPlayerRef.current?.pause() };

  return (
    <>
      <MediaPlayer ref={mediaPlayerRef} streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8" />
      <Button onPress={handlePause} title="Pause">
    </>
  );
}
```

### seekTo

Some description. // TODO: proper description here

type: `(position: number, completionHandler: function?) => void`

```tsx
import MediaPlayer from "react-native-amazon-ivs";

function App() {
  const mediaPlayerRef = React.useRef<MediaPlayerRef>(null);

  const handleSeekTo = () => { mediaPlayerRef.current?.seekTo({ position: 15 }) };

  return (
    <>
      <MediaPlayer ref={mediaPlayerRef} streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8" />
      <Button onPress={handleSeekTo} title="Pause">
    </>
  );
}
```
