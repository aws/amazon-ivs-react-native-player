import * as React from 'react';
import IVSPlayer from 'amazon-ivs-react-native-player';

const URL =
  'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8';

export default function SimpleExample() {
  return <IVSPlayer streamUrl={URL} testID="IVSPlayer" />;
}
