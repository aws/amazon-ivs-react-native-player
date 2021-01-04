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
import type { Quality } from './types';

export type MediaPlayerRef = {
  play: () => void;
  pause: () => void;
  seekTo: (position: number) => void;
};

type MediaPlayerProps = {
  style?: ViewStyle;
  ref: any;
  muted: boolean;
  looping: boolean;
  liveLowLatency?: boolean;
  playbackRate?: number;
  streamUrl?: string;
  onSeek?(event: NativeSyntheticEvent<{ position: number }>): void;
  onPlayerStateChange?(event: NativeSyntheticEvent<{ state: number }>): void;
  onDurationChange?(
    event: NativeSyntheticEvent<{ duration: number | null }>
  ): void;
  onQualityChange?(event: NativeSyntheticEvent<Quality>): void;
  onBuffer?(): void;
  onLoadStart?(): void;
  onLoad?(event: NativeSyntheticEvent<{ duration: number | null }>): void;
};

const VIEW_NAME = 'AmazonIvs';

export const MediaPlayer = requireNativeComponent<MediaPlayerProps>(VIEW_NAME);

type Props = {
  paused?: boolean;
  muted?: boolean;
  looping?: boolean;
  streamUrl?: string;
  liveLowLatency?: boolean;
  playbackRate?: number;
  onSeek?(position: number): void;
  onPlayerStateChange?(state: number): void;
  onDurationChange?(duration: number | null): void;
  onQualityChange?(quality: Quality | null): void;
  onBuffer?(): void;
  onLoadStart?(): void;
  onLoad?(duration: number | null): void;
};

const PlayerContainer = React.forwardRef<MediaPlayerRef, Props>(
  (
    {
      streamUrl,
      paused = false,
      muted = false,
      looping = false,
      liveLowLatency,
      playbackRate,
      onSeek,
      onPlayerStateChange,
      onDurationChange,
      onQualityChange,
      onBuffer,
      onLoadStart,
      onLoad,
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

    const seekTo = useCallback((value) => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(mediaPlayerRef.current),

        UIManager.getViewManagerConfig(VIEW_NAME).Commands.seekTo,
        [value]
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
        seekTo,
      }),
      [play, pause, seekTo]
    );

    const onSeekHandler = (
      event: NativeSyntheticEvent<{ position: number }>
    ) => {
      const { position } = event.nativeEvent;
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

    const onQualityChangeHandler = (event: NativeSyntheticEvent<Quality>) => {
      const quality = event.nativeEvent;
      onQualityChange?.(quality);
    };

    const onLoadHandler = (
      event: NativeSyntheticEvent<{ duration: number | null }>
    ) => {
      const { duration } = event.nativeEvent;
      onLoad?.(duration);
    };

    return (
      <View style={styles.container} ref={ref as any}>
        <MediaPlayer
          muted={muted}
          looping={looping}
          liveLowLatency={liveLowLatency}
          style={styles.mediaPlayer}
          onQualityChange={onQualityChangeHandler}
          ref={mediaPlayerRef}
          playbackRate={playbackRate}
          streamUrl={streamUrl}
          onSeek={onSeekHandler}
          onPlayerStateChange={onPlayerStateChangeHandler}
          onDurationChange={onDurationChangeHandler}
          onBuffer={onBuffer}
          onLoadStart={onLoadStart}
          onLoad={onLoadHandler}
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
