# IVSPlayer COMPONENT USAGE GUIDE

IVS Player component allows setup and interaction with the native implementation of Amazon IVS player on iOS and Android.

## INSTALLING DEPENDENCIES

To install the SDK run the following command in your terminal:

```sh
yarn add amazon-ivs-react-native-player
```

For iOS you will have to run `pod install` inside `ios` directory in order to install needed native dependencies. Android won't require any additional steps.

## RENDERING `IVSPlayer` COMPONENT IN YOUR APP

To render the player in your app just use [`IVSPlayer`](./ivs-player-reference.md) component wherever you need it.

```jsx
import IVSPlayer from 'amazon-ivs-react-native-player';

export default function App() {
  return (
    <View>
      <IVSPlayer />
    </View>
  );
}
```

## LOADING STREAM URL

To load and play the video or a live stream use [`streamUrl`](./ivs-player-reference.md#streamurl-optional) prop.
In order to play the video directly after loading [`autoplay`](./ivs-player-reference.md#autoplay-optional) prop can be used.

```jsx
<IVSPlayer
  streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
  autoplay
/>
```

You can also set the video volume or its quality using component props. The whole list of available props can be found [here](ivs-player-reference.md#props).

## CHANGING VIDEO QUALITY

In order to set video quality, you need to get the list of available qualities that come from the `onData` callback.

```tsx
import IVSPlayer, { Quality } from 'amazon-ivs-react-native';

export default function App() {
  const [qualities, setQualities] = useState<Quality[]>();

  return (
    <IVSPlayer
      streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
      onData={(data) => setQualities(data.qualities)}
      quality={qualities[0]}
    />
  );
}
```

## LISTENING ON `onPlayerStateChange` AND OTHER USEFUL CALLBACKS

The SDK exposes a number of useful callbacks that help to expose important information about the Player, and the video playing.
e.g. `onProgress` helps to build a video progress bar or `onLoad` that is triggered once a video is loaded with the information about the total duration.
You can find the full list of events in the [api-reference](./ivs-player-reference.md#props) which starts with the `on` prefix.

```tsx
<IVSPlayer
  streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
  onSeek={(newPosition) => {
    console.log('new position', newPosition)
  }}
  onPlayerStateChange={(state) => {
    console.log(`state changed: ${state}`); // e.g. PlayerState.Playing
  }}
  onDurationChange={(duration) => {
    console.log(`duration changed: ${duration)}`); // in miliseconds
  }}
  onQualityChange={(newQuality) => {
    console.log(`quality changed: ${newQuality?.name}`)
  }}
  onPipChange={(isActive) => {
    console.log(`picture in picture changed - isActive: ${isActive}`)
  }}
  onRebuffering={() => {
     console.log('rebuffering...')
  }}
  onLoadStart={() => {
    console.log(`load started`)
  }}
  onLoad={(loadedDuration) => {
    console.log(`loaded duration changed: ${loadedDuration)}`) // in miliseconds
  }}
  onLiveLatencyChange={(liveLatency) =>
    console.log(`live latency changed: ${liveLatency}`)
  }
  onTextCue={(textCue) => {
    console.log('text cue type', textCue.type)
    console.log('text cue size', textCue.size)
    console.log('text cue text', textCue.text)
    // type, line, size, position, text, textAlignment
  }}
  onTextMetadataCue={(textMetadataCue) =>
    console.log('text metadata cue text', textMetadataCue.text)
    // type, text, textDescription
  }
  onProgress={(position) => {
    console.log(
      `progress changed: ${position}` // in miliseconds
    );
  }}
  onData={(data) => {
    console.log(`data: ${data.version}`)
    // qualities, version, sessionId
    console.log(`data: ${data.qualities[0].width}`)
    // name, codecs, bitrate, framerate, width, height
  }}
  onVideoStatistics={(video) => {
    console.log('video bitrate', video.bitrate)
    // bitrate, duration, framesDecoded, framesDropped
  }}
  onError={(error) => {
    console.log('error', error)
  }}
  onTimePoint={(timePoint) => {
    console.log('time point', timePoint)
  }}
/>
```

## TRIGGERING PLAY/PAUSE MANUALLY

In addition to configuring the player declaratively there is also a way to trigger some actions imperatively using component's ref.

Those actions are `play`, `pause`, `seekTo` and `togglePip` which can be used to manually stop, start the video, set the current time position and toggle picture in picture mode if available.

```tsx
import IVSPlayer, { IVSPlayerRef } from 'amazon-ivs-react-native-player'

export default function App() {
  const mediaPlayerRef = React.useRef<IVSPlayerRef>(null);

  const handlePlayPress = () => {
    mediaPlayerRef?.current?.play();
  };

  const handlePausePress = () => {
    mediaPlayerRef?.current?.pause();
  };

  const handleSeekToPress = () => {
    mediaPlayerRef?.current?.seekTo(15);
  };

    const handleTogglePipToPress = () => {
    mediaPlayerRef?.current?.togglePip();
  };

  return (
    <View>
      <IVSPlayer
        ref={mediaPlayerRef}
        streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
      />

      <Button onPress={handlePlayPress} title="play">
      <Button onPress={handlePausePress} title="pause">
      <Button onPress={handleSeekToPress} title="seek to">
      <Button onPress={handleTogglePipToPress} title="togglePip">
    </View>
  );
}
```

The list of all available methods can be found [here](./ivs-player-reference.md#ref-methods).

## STYLING THE PLAYER

The `IVSPlayer` component accepts the `style` property which means that you can additionally pass any `ViewStyle` prop to style your Player.
In this example, let's set `width`, `height` and `borderRadius`.
These styles will be applied to the Parent View of the Player

```tsx
<IVSPlayer
  streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
  style={{
    borderRadius: 24,
    width: 200,
    height: 80,
  }}
/>
```

## ADD CONTROL BUTTONS ON THE TOP OF THE PLAYER

Let's consider the popular type of video player which displays control buttons on the top of the Player.
To accomplish this, you need to add the control buttons as `children` of the component.
Let's assume you want to add play and pause buttons and use them to control the Player state.
In the following example you can see how it can be done:

```tsx
import IVSPlayer, { IVSPlayerRef } from 'amazon-ivs-react-native';
import { TouchableOpacity } from 'react-native';

export default function App() {
  const [paused, setPaused] = useState(false);

  return (
    <IVSPlayer
      autoplay
      pause={paused}
      streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setPaused((prev) => !prev);
          }}
        >
          <Text>{paused ? 'play' : 'pause'}</Text>
        </TouchableOpacity>
      </View>
    </IVSPlayer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
  },
});
```

## 3. PLAY/PAUSE VIDEO IN A BACKGROUND

Playing a video in a background feature is enabled by default in SDK.
Additionally, in order to use it on iOS, you must [Enable Background Audio](https://developer.apple.com/documentation/avfoundation/media_playback_and_selection/creating_a_basic_video_player_ios_and_tvos/enabling_background_audio) capability in your Xcode project.

In order to pause a video in a background you will need to handle it in your Application.
We recommend to use React Native `AppState` module to manage that.

Below, you can find the code snippet:

```tsx
import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

function App() {
  // ...
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    function handleAppStateChange(nextAppState) {
      if (nextAppState === 'active' && appState !== 'active') {
        play();
      } else if (
        appState === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        pause();
      }
      setAppState(nextAppState);
    }
    const state = AppState.addEventListener('change', handleAppStateChange);

    return () => state.remove();
  }, [onChange, appState]);

  // ...
}
```
