# MediaPlayer component usage guide

Media Player component allows setup and interaction with the native implementation of Amazon IVS player on iOS and Android.

## 1. Installing dependencies

To install the SDK run the following command in your terminal:

```sh
yarn add react-native-amazon-ivs
```

For iOS you will have to run `pod install` inside `ios` directory in order to install needed native dependencies. Android won't require any additional steps.

## 2. Rendering `MediaPlayer` component in your app

To render the player in your app just use [`MediaPlayer`](./media-player-reference.md) component wherever you need it.

```jsx
import MediaPlayer from 'react-native-amazon-ivs';

export default function App() {
  return (
    <View>
      <MediaPlayer />
    </View>
  );
}
```

## 3. Setting `streamUrl` and other useful props

To load and play the video or a live stream use [`streamUrl`](./media-player-reference.md#streamurl-optional) prop.
In order to play the video directly after loading [`autoplay`](./media-player-reference.md#autoplay-optional) prop can be used.

```jsx
<MediaPlayer
  streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
  autoplay
/>
```

You can also set the video volume or its quality using component props. The whole list of available props can be found [here](media-player-reference.md#props).

## 4. Triggering play/pause manually

In addition to configuring the player declaratively there is also a way to trigger some actions imperatively using component's ref.

On of those actions are `play` and `pause` which can be used to manually stop and start the video.

```jsx
export default function App() {
  const mediaPlayerRef = React.useRef(null);

  const handlePlayPress = () => {
    mediaPlayerRef?.current?.play();
  };

  return (
    <View>
      <MediaPlayer
        ref={mediaPlayerRef}
        streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
      />

      <Button onPress={handlePlayPress} title="play">
    </View>
  );
}
```

The list of all available methods can be found [here](./media-player-reference.md#ref-methods).
