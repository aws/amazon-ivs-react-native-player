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
  NativeSyntheticEvent,
} from 'react-native';

export type MediaPlayerRef = {
  play: () => void;
  pause: () => void;
};

type MediaPlayerProps = {
  style?: ViewStyle;
  ref: any;
  muted: boolean;
  looping: boolean;
  streamUrl?: string;
  onSeek?(event: NativeSyntheticEvent<number>): void;
  onPlayerStateChange?(event: NativeSyntheticEvent<{ state: number }>): void;
  onDurationChange?(
    event: NativeSyntheticEvent<{ duration: number | null }>
  ): void;
};

const VIEW_NAME = 'AmazonIvs';

export const MediaPlayer = requireNativeComponent<MediaPlayerProps>(VIEW_NAME);

type Props = {
  paused?: boolean;
  muted?: boolean;
  looping?: boolean;
  streamUrl?: string;
  onSeek?(position: number): void;
  onPlayerStateChange?(state: number): void;
  onDurationChange?(duration: number | null): void;
};

const PlayerContainer = React.forwardRef<MediaPlayerRef, Props>(
  (
    {
      streamUrl,
      paused = false,
      muted = false,
      looping = false,
      onSeek,
      onPlayerStateChange,
      onDurationChange,
    },
    ref
  ) => {
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

    const onSeekHandler = (event: NativeSyntheticEvent<number>) => {
      const position = event.nativeEvent;
      onSeek?.(position);
    };

    const onPlayerStateChangeHandler = (
      event: NativeSyntheticEvent<{ state: number }>
    ) => {
      const { state } = event.nativeEvent;
      onPlayerStateChange?.(state);
    };

    const onDurationChangeHandler = (
      event: NativeSyntheticEvent<{ duration: number | null }>
    ) => {
      const { duration } = event.nativeEvent;
      onDurationChange?.(duration);
    };

    return (
      <View style={styles.container} ref={ref as any}>
        <MediaPlayer
          muted={muted}
          looping={looping}
          style={styles.mediaPlayer}
          ref={mediaPlayerRef}
          streamUrl={streamUrl}
          onSeek={onSeekHandler}
          onPlayerStateChange={onPlayerStateChangeHandler}
          onDurationChange={onDurationChangeHandler}
        />
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
