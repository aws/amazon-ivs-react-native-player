# Amazon IVS React Native Player

This package implements native binding for Amazon IVS Player for iOS and Android.

## Installation

- install `amazon-ivs-react-native-player` dependency using yarn or npm

```sh
npm install amazon-ivs-react-native-player
```

- install pods for your ios project. Go to `ios` directory and run

```sh
pod install
```

## Setup

Add the following attrs in `/android/app/src/main/AndroidManifest.xml` file

```xml
  <activity
    ...
      android:supportsPictureInPicture="true"
    ...
```

If you don't have to receive updates when the pip mode is entered or exited, you are good to go. In order to subscribe to the changes in the pip mode, add the following code to `MainActivity.java`.

Add this import to the activity

```java
import com.amazonaws.ivs.reactnative.player.AmazonIvsView;


public class MainActivity extends ReactActivity {

...

@Override
  public void onPictureInPictureModeChanged(boolean isInPictureInPictureMode, Configuration newConfig) {
    super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig);
    AmazonIvsView.Companion.emitPipModeChangedEvent(isInPictureInPictureMode);
  }
```

## Usage

```tsx
import IVSPlayer from 'amazon-ivs-react-native-player';

const URL =
  'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8';

function App() {
  return <IVSPlayer streamUrl={URL} />;
}
```

A more detailed guide about usage can be found [here](./docs/usage-guide.md)

## IVSPlayer component

`IVSPlayer` is a component that can render a video stream based on the passed URL.

- [Props documentation](./docs/ivs-player-reference.md#props)
- [Ref methods documentation](./docs/ivs-player-reference.md#ref-methods)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Troubleshooting

To hide Home Indicator on iOS when video is in full screen, use this library:
https://github.com/flowkey/react-native-home-indicator

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
