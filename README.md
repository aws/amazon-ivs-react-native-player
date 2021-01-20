# react-native-amazon-ivs

This package implements native binding for Amazon IVS Player for iOS and Android.

## Installation

- install `react-native-amazon-ivs` dependency using yarn or npm

```sh
npm install react-native-amazon-ivs
```

- install pods for your ios project. Go to `ios` directory and run

```sh
pod install
```

## Usage

```tsx
import MediaPlayer from 'react-native-amazon-ivs';

const URL = 'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8';

function App() {
  return <MediaPlayer streamUrl={URL} />
}
```

A more detailed guide about usage can be found [here](./docs/usage-guide.md)

## MediaPlayer component

`MediaPlayer` is a component that can render a video stream based on the passed URL.

- [Props documentation](./docs/media-player-reference.md#props)
- [Ref methods documentation](./docs/media-player-reference.md#ref-methods)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Troubleshooting

To hide Home Indicator on iOS when video is in full screen, use this library:
https://github.com/flowkey/react-native-home-indicator