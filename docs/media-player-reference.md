# Media Player component - reference

// TODO: description here

// TODO: simple code example here

## Props

### streamUrl _(optional)_

An URL of the the stream to load. Should be in a valid URL format.

type: `string`

### autoplay _(optional)_

Some description. // TODO: proper description here

type: `boolean`

### autoQualityMode _(optional)_

Some description. // TODO: proper description here

type: `boolean`

### looping _(optional)_

Some description. // TODO: proper description here

type: `boolean`

### logLevel _(optional)_

Some description. // TODO: proper description here

type: [`LogLevel`](./types.md#loglevel)

### muted _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### paused _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### playbackRate _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### volume _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### quality _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### autoMaxQuality _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### maxQuality _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### autoQualityMode _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### maxVideoSize _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### initialBitrate _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### maxBitrate _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### liveLowLatency _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### playerConfig _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onBuffer _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onError _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onLiveLatencyChange _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onBandwidthEstimateChange _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onData _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onVideo _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onPlayerStateChange _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onLoad _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onLoadStart _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onProgress _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onTimePoint _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onTextCue _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onTextMetadataCue _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onDurationChange _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onSeek _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

### onQualityChange _(optional)_

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

## Ref methods

### play

A reference method that will play the stream/video if it is stopped. For a stream that is currently playing it won't do anything.

type: `() => void`

```tsx
function App() {
  const mediaPlayerRef = React.useRef<MediaPlayerRef>(null);

  const handlePlay = () => mediaPlayerRef?.current?.play();

  return (
    <>
      <MediaPlayer ref={mediaPlayerRef} />
      <Button onPress={handlePlay} title="Play">
    </>
  );
}
```

### pause

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

// TODO: We can also add an example code like in `play`

### seekTo

Some description. // TODO: proper description here

type: `string` // TODO: proper type here

// TODO: We can also add an example code like in `play`
