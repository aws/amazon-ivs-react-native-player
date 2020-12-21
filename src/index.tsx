import { requireNativeComponent, ViewStyle } from 'react-native';

type AmazonIvsProps = {
  style?: ViewStyle;
};

export const MediaPlayer = requireNativeComponent<AmazonIvsProps>('AmazonIvs');

export default MediaPlayer;
