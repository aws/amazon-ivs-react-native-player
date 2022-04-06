# IVSPlayer COMPONENT GUIDE USAGE

Let's create a full working example that implements an advanced `IVSPlayer` component with the control buttons and time slider.
Our example will contain:

- `IVSPlayer` component with a number of properties like `autoplay, streamUrl, volume` or `quality`
- Few event listeners that will help us react on specific Player events like `onProgress` or `onDurationChange`
- Control buttons for pausing, playing and muting the player.
- Time slider to control the current position of the video.

## RENDERING `IVSPlayer` COMPONENT IN YOUR APP

At the very beginning, let's create a screen where the Player will be placed.
To render the Player on your screen just use the [`IVSPlayer`](./ivs-player-reference.md) component wherever you need it.

> Please note that the player dimensions adjust to the parent component.

```jsx
import IVSPlayer from 'amazon-ivs-react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <IVSPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
});
```

To make the Player work we need to at least add the `streamUrl` prop which loads the video or live stream.

```jsx
<IVSPlayer streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8" />
```

Next, in our example we want to enable `autoplay` and set initial `volume`.
In order to do that, let's simply add properties accordingly.

```jsx
<IVSPlayer
  streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
  autoplay // <-- Add this line
  volume={0.4} // <-- Add this line
/>
```

As a next step, let's set a `quality` prop which forces `720p` quality.
In order to do this, you need to get the list of available qualities that comes from the `onData` callback.
Now, you can filter the list to find the proper quality based on its dimensions, frame rate or bitrate.

```tsx
//...
const [qualities, setQualities] = useState();

const fullHDQualities = qualities.find((quality) => quality.width >= 720);
const fullHDQuality =
  fullHDQualities && fullHDQualities.length > 0
    ? fullHDQualities[0]
    : undefined;

return (
  <IVSPlayer
    // ...
    onData={(data) => setQualities(data.qualities)}
    quality={fullHDQuality}
  />
);
// ...
```

This is how it looks so far:

```jsx
import IVSPlayer from 'amazon-ivs-react-native';

export default function App() {
  const [qualities, setQualities] = useState();
  const fullHDQualities = qualities.find((quality) => quality.width >= 720);
  const fullHDQuality =
    fullHDQualities && fullHDQualities.length > 0
      ? fullHDQualities[0]
      : undefined;

  return (
    <View style={styles.container}>
      <IVSPlayer
        streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
        autoplay
        volume={0.4}
        onData={(data) => setQualities(data.qualities)}
        quality={fullHDQuality}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
});
```

## ADD CONTROL BUTTONS

Let's consider the popular type of video player which displays control buttons on the top of the Player.
To accomplish this, you need to add the control buttons as `children` of the `IVSPlayer` component.
We need to add `play/pause` and `mute` buttons by passing them into the player. These buttons can respond to and update the necessary state.

```jsx
export default function App() {
  // ...
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);

  return (
    <IVSPlayer
      // ...props
      paused={paused}
      muted={muted}
    >
      <View style={styles.controls}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setPaused((prev) => !prev);
            }}
          >
            <Text>{paused ? 'play' : 'pause'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setMuted((prev) => !prev);
            }}
          >
            <Text>{muted ? 'unmute' : 'mute'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </IVSPlayer>
  );
}

const styles = StyleSheet.create({
  // ... other styles
  controls: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignSelf: 'flex-end',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'orange',
    width: 100,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf
});
```

Note that above we created the button using `TouchableOpacity` that toggles `paused` state and passes it into the Player as a `paused` prop.
This allows us to pause/play the Player when users tap the button.
Added styles should put the buttons at the very bottom of the player.

## ADD TIME SLIDER

To add the time slider we're going to use `@react-native-community/slider` for the example purposes. You can use any other component/library depending on your needs.
Before we add it, we need to know the `duration` of the video, if applicable (it doesn't concern streams), and current `position`.
For such purpose we can use `onDurationChange` and `onProgress` callbacks to get the proper pieces of information.

```tsx
//...
const [duration, setDuration] = useState();
const [position, setPosition] = useState();

return (
  <IVSPlayer
    // ...
    onDurationChange={(currentDuration) => setDuration(currentDuration)}
    onProgress={(newPosition) => setPosition(newPosition)}
  />
);
// ...
```

Now we can render a `Slider` component which displays the current progress of the video and total duration.

```jsx
<Slider minimumValue={0} maximumValue={duration} value={position} />
```

Now, let's handle a video stream when total duration is not available.
For such cases `onDurationChange` callback returns `Infinity` instead of a `number`.
Based on this value you can distinguish it and customise the logic of the Player.

```jsx
<>
  <Slider
    disabled={!duration || duration === Infinity}
    minimumValue={0}
    maximumValue={duration === Infinity ? 100 : duration}
    value={duration === Infinity ? 100 : position}
  />
  {duration && duration !== Infinity ? (
    <Text>
      {position.toFixed(0)} / {duration}
    </Text>
  ) : (
    <Text>Live</Text>
  )}
</>
```

> For more advanced implementation of the time slider please refer to the [AdvancedExample.tsx](https://github.com/aws/amazon-ivs-react-native/blob/main/example/src/screens/AdvancedExample.tsx) screen in the example App.

Now, let's put it all together:

```jsx
import IVSPlayer from 'amazon-ivs-react-native';

export default function App() {
  const [duration, setDuration] = useState();
  const [position, setPosition] = useState();
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);

  const fullHDQualities = qualities.find((quality) => quality.width >= 720);
  const fullHDQuality =
    fullHDQualities && fullHDQualities.length > 0
      ? fullHDQualities[0]
      : undefined;

  return (
    <View style={styles.container}>
      <IVSPlayer
        streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"
        autoplay
        volume={0.4}
        onData={(data) => setQualities(data.qualities)}
        quality={fullHDQuality}
        onDurationChange={(currentDuration) => setDuration(currentDuration)}
        onProgress={(newPosition) => setPosition(newPosition)}
        muted={muted}
        paused={paused}
      >
        <View style={styles.controls}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setPaused((prev) => !prev);
              }}
            >
              <Text>{paused ? 'play' : 'pause'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setMuted((prev) => !prev);
              }}
            >
              <Text>{muted ? 'unmute' : 'mute'}</Text>
            </TouchableOpacity>
          </View>

          <Slider
            disabled={!duration || duration === Infinity}
            minimumValue={0}
            maximumValue={duration === Infinity ? 100 : duration}
            value={duration === Infinity ? 100 : position}
          />
        </View>
      </IVSPlayer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
  controls: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignSelf: 'flex-end',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'orange',
    width: 100,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});
```
