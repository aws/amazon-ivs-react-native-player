# Amazon IVS React Native Player

This package implements native binding for Amazon IVS Player for iOS and Android Mobile Only. 
| Android Mobile | iOS | Android TV | tvOS |
| :-----: | :-: | :---: | :-: |
|   SDK >= 21    | >= 13  |  **X**   | **X**   |

## Installation

- install `amazon-ivs-react-native-player` dependency using yarn or npm

```sh
npm install amazon-ivs-react-native-player
```

- install pods for your ios project. Go to `ios` directory and run

```sh
pod install
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
