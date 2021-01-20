import * as React from 'react';
import MediaPlayer from 'react-native-amazon-ivs';

const URL =
  'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8';

export default function SimpleExample() {
  return <MediaPlayer streamUrl={URL} />;
}
