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
import { LogLevel } from './enums';
import type {
  Quality,
  PlayerData,
  TextCue,
  TextMetadataCue,
  VideoData,
} from './types';
export { PlayerState } from './enums';

export type MediaPlayerRef = {
  play: () => void;
  pause: () => void;
  seekTo: (position: number) => void;
};

export { LogLevel };

type MediaPlayerProps = {
  style?: ViewStyle;
  ref: any;
  muted?: boolean;
  looping?: boolean;
  liveLowLatency?: boolean;
  playbackRate?: number;
  streamUrl?: string;
  logLevel?: LogLevel;
  progressInterval?: number;
  volume?: number;
  quality?: Quality | null;
  autoMaxQuality?: Quality | null;
  autoQualityMode?: boolean;
  breakpoints?: number[];
  onSeek?(event: NativeSyntheticEvent<{ position: number }>): void;
  onData?(event: NativeSyntheticEvent<{ playerData: PlayerData }>): void;
  onVideo?(event: NativeSyntheticEvent<{ videoData: VideoData }>): void;
  onPlayerStateChange?(event: NativeSyntheticEvent<{ state: number }>): void;
  onDurationChange?(
    event: NativeSyntheticEvent<{ duration: number | null }>
  ): void;
  onQualityChange?(event: NativeSyntheticEvent<{ quality: Quality }>): void;
  onBuffer?(): void;
  onLoadStart?(): void;
  onLoad?(event: NativeSyntheticEvent<{ duration: number | null }>): void;
  onLiveLatencyChange?(
    event: NativeSyntheticEvent<{ liveLatency: number }>
  ): void;
  onTextCue?(event: NativeSyntheticEvent<{ textCue: TextCue }>): void;
  onTextMetadataCue?(
    event: NativeSyntheticEvent<{ textMetadataCue: TextMetadataCue }>
  ): void;
  onProgress?(event: NativeSyntheticEvent<{ position: number }>): void;
  onBandwidthEstimateChange?(
    event: NativeSyntheticEvent<{ bandwidthEstimate: number }>
  ): void;
  onError?(event: NativeSyntheticEvent<{ error: string }>): void;
  onTimePoint?(event: NativeSyntheticEvent<{ position: number }>): void;
};

const VIEW_NAME = 'AmazonIvs';

const MediaPlayer = requireNativeComponent<MediaPlayerProps>(VIEW_NAME);

type Props = {
  paused?: boolean;
  muted?: boolean;
  looping?: boolean;
  autoplay?: boolean;
  streamUrl?: string;
  liveLowLatency?: boolean;
  playbackRate?: number;
  logLevel?: LogLevel;
  progressInterval?: number;
  volume?: number;
  quality?: Quality | null;
  autoMaxQuality?: Quality | null;
  autoQualityMode?: boolean;
  breakpoints: number[];
  onSeek?(position: number): void;
  onData?(data: PlayerData): void;
  onVideo?(data: VideoData): void;
  onPlayerStateChange?(state: number): void;
  onDurationChange?(duration: number | null): void;
  onQualityChange?(quality: Quality | null): void;
  onBuffer?(): void;
  onLoadStart?(): void;
  onLoad?(duration: number | null): void;
  onLiveLatencyChange?(liveLatency: number): void;
  onTextCue?(textCue: TextCue): void;
  onTextMetadataCue?(textMetadataCue: TextMetadataCue): void;
  onProgress?(progress: number): void;
  onBandwidthEstimateChange?(bandwidthEstimate: number): void;
  onError?(error: string): void;
  onTimePoint?(position: number): void;
};

const PlayerContainer = React.forwardRef<MediaPlayerRef, Props>(
  (
    {
      streamUrl,
      paused,
      muted,
      looping,
      autoplay,
      liveLowLatency,
      playbackRate,
      logLevel,
      progressInterval,
      volume,
      quality,
      autoMaxQuality,
      autoQualityMode,
      breakpoints = [],
      onSeek,
      onData,
      onVideo,
      onPlayerStateChange,
      onDurationChange,
      onQualityChange,
      onBuffer,
      onLoadStart,
      onLoad,
      onLiveLatencyChange,
      onTextCue,
      onTextMetadataCue,
      onProgress,
      onBandwidthEstimateChange,
      onError,
      onTimePoint,
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

    const onQualityChangeHandler = (
      event: NativeSyntheticEvent<{ quality: Quality }>
    ) => {
      const { quality: newQuality } = event.nativeEvent;
      onQualityChange?.(newQuality);
    };

    const onLoadStartHandler = () => {
      if (autoplay && !paused) {
        play();
      }

      onLoadStart?.();
    };

    const onLoadHandler = (
      event: NativeSyntheticEvent<{ duration: number | null }>
    ) => {
      const { duration } = event.nativeEvent;
      onLoad?.(duration);
    };

    const onLiveLatencyChangeHandler = (
      event: NativeSyntheticEvent<{ liveLatency: number }>
    ) => {
      const { liveLatency } = event.nativeEvent;
      onLiveLatencyChange?.(liveLatency);
    };

    const onBandwidthEstimateChangeHandler = (
      event: NativeSyntheticEvent<{ bandwidthEstimate: number }>
    ) => {
      const { bandwidthEstimate } = event.nativeEvent;
      onBandwidthEstimateChange?.(bandwidthEstimate);
    };

    const onDataHandler = (
      event: NativeSyntheticEvent<{ playerData: PlayerData }>
    ) => {
      const { playerData } = event.nativeEvent;
      onData?.(playerData);
    };

    const onTextCueHandler = (
      event: NativeSyntheticEvent<{ textCue: TextCue }>
    ) => {
      const { textCue } = event.nativeEvent;
      onTextCue?.(textCue);
    };

    const onVideoHandler = (
      event: NativeSyntheticEvent<{ videoData: VideoData }>
    ) => {
      const { videoData } = event.nativeEvent;
      onVideo?.(videoData);
    };

    const onTextMetadataCueHandler = (
      event: NativeSyntheticEvent<{ textMetadataCue: TextMetadataCue }>
    ) => {
      const { textMetadataCue } = event.nativeEvent;
      onTextMetadataCue?.(textMetadataCue);
    };

    const onProgressHandler = (
      event: NativeSyntheticEvent<{ position: number }>
    ) => {
      const { position } = event.nativeEvent;
      onProgress?.(position);
    };

    const onErrorHandler = (event: NativeSyntheticEvent<{ error: string }>) => {
      const { error } = event.nativeEvent;
      onError?.(error);
    };

    const onTimePointHandler = (
      event: NativeSyntheticEvent<{ position: number }>
    ) => {
      const { position } = event.nativeEvent;
      onTimePoint?.(position);
    };

    return (
      <View style={styles.container} ref={ref as any}>
        <MediaPlayer
          muted={muted}
          looping={looping}
          liveLowLatency={liveLowLatency}
          style={styles.mediaPlayer}
          ref={mediaPlayerRef}
          playbackRate={playbackRate}
          streamUrl={streamUrl}
          logLevel={logLevel}
          progressInterval={progressInterval}
          volume={volume}
          quality={quality}
          autoMaxQuality={autoMaxQuality}
          autoQualityMode={autoQualityMode}
          breakpoints={breakpoints}
          onVideo={onVideo ? onVideoHandler : undefined}
          onData={onDataHandler}
          onSeek={onSeekHandler}
          onQualityChange={onQualityChangeHandler}
          onPlayerStateChange={onPlayerStateChangeHandler}
          onDurationChange={onDurationChangeHandler}
          onBuffer={onBuffer}
          onLoadStart={onLoadStartHandler}
          onLoad={onLoadHandler}
          onTextCue={onTextCueHandler}
          onTextMetadataCue={onTextMetadataCueHandler}
          onProgress={onProgressHandler}
          onLiveLatencyChange={
            onLiveLatencyChange ? onLiveLatencyChangeHandler : undefined
          }
          onBandwidthEstimateChange={
            onBandwidthEstimateChange
              ? onBandwidthEstimateChangeHandler
              : undefined
          }
          onError={onErrorHandler}
          onTimePoint={onTimePointHandler}
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
