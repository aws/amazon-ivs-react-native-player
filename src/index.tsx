import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  requireNativeComponent,
  ViewStyle,
  StyleSheet,
  UIManager,
  findNodeHandle,
  View,
} from 'react-native';

export type MediaPlayerRef = {
  play: () => void;
  pause: () => void;
};

type MediaPlayerProps = {
  style?: ViewStyle;
  ref: any;
};

const VIEW_NAME = 'AmazonIvs';

export const MediaPlayer = requireNativeComponent<MediaPlayerProps>(VIEW_NAME);

type Props = {
  paused?: boolean;
};

const PlayerContainer = React.forwardRef<MediaPlayerRef, Props>(
  ({ paused = false }, ref) => {
    const mediaPlayerRef = useRef(null);

    const play = useCallback(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(mediaPlayerRef.current),
        UIManager.getViewManagerConfig(VIEW_NAME).Commands.play,
        []
      );
    }, []);

    const pause = useCallback(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(mediaPlayerRef.current),
        UIManager.getViewManagerConfig(VIEW_NAME).Commands.pause,
        []
      );
    }, []);

    useEffect(() => {
      paused ? pause() : play();
    }, [pause, paused, play]);

    useImperativeHandle(
      ref,
      () => ({
        play,
        pause,
      }),
      [play, pause]
    );

    return (
      <View style={styles.container} ref={ref as any}>
        <MediaPlayer style={styles.mediaPlayer} ref={mediaPlayerRef} />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mediaPlayer: {
    flex: 1,
  },
});

export default PlayerContainer;
