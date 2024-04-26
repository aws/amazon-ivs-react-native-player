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
  Platform,
} from 'react-native';
import type { LogLevel, PlayerState } from './enums';
import type {
  Quality,
  PlayerData,
  TextCue,
  TextMetadataCue,
  VideoData,
  IVSPlayerRef,
  ResizeMode,
  Source,
} from './types';
import { createSourceWrapper } from './source';

type IVSPlayerProps = {
  style?: ViewStyle;
  testID?: string;
  ref: any;
  muted?: boolean;
  loop?: boolean;
  liveLowLatency?: boolean;
  rebufferToLive?: boolean;
  playbackRate?: number;
  streamUrl?: string;
  resizeMode?: ResizeMode;
  logLevel?: LogLevel;
  progressInterval?: number;
  pipEnabled?: boolean;
  volume?: number;
  quality?: Quality | null;
  autoMaxQuality?: Quality | null;
  autoQualityMode?: boolean;
  breakpoints?: number[];
  maxBitrate?: number;
  initialBufferDuration?: number;
  onSeek?(event: NativeSyntheticEvent<{ position: number }>): void;
  onData?(event: NativeSyntheticEvent<{ playerData: PlayerData }>): void;
  onVideoStatistics?(
    event: NativeSyntheticEvent<{ videoData: VideoData }>
  ): void;
  onPlayerStateChange?(
    event: NativeSyntheticEvent<{ state: PlayerState }>
  ): void;
  onDurationChange?(
    event: NativeSyntheticEvent<{ duration: number | null }>
  ): void;
  onQualityChange?(event: NativeSyntheticEvent<{ quality: Quality }>): void;
  onPipChange?(event: NativeSyntheticEvent<{ active: boolean | string }>): void;
  onRebuffering?(): void;
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
  onError?(event: NativeSyntheticEvent<{ error: string }>): void;
  onTimePoint?(event: NativeSyntheticEvent<{ position: number }>): void;
};

const VIEW_NAME = 'AmazonIvs';

const IVSPlayer = requireNativeComponent<IVSPlayerProps>(VIEW_NAME);

export type Props = {
  style?: ViewStyle;
  testID?: string;
  paused?: boolean;
  muted?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  streamUrl?: string;
  liveLowLatency?: boolean;
  rebufferToLive?: boolean;
  playbackRate?: number;
  logLevel?: LogLevel;
  resizeMode?: ResizeMode;
  progressInterval?: number;
  volume?: number;
  quality?: Quality | null;
  autoMaxQuality?: Quality | null;
  autoQualityMode?: boolean;
  breakpoints?: number[];
  maxBitrate?: number;
  initialBufferDuration?: number;
  pipEnabled?: boolean;
  onSeek?(position: number): void;
  onData?(data: PlayerData): void;
  onVideoStatistics?(data: VideoData): void;
  onPlayerStateChange?(state: PlayerState): void;
  onDurationChange?(duration: number | null): void;
  onQualityChange?(quality: Quality | null): void;
  onPipChange?(isActive: boolean): void;
  onRebuffering?(): void;
  onLoadStart?(): void;
  onLoad?(duration: number | null): void;
  onLiveLatencyChange?(liveLatency: number): void;
  onTextCue?(textCue: TextCue): void;
  onTextMetadataCue?(textMetadataCue: TextMetadataCue): void;
  onProgress?(progress: number): void;
  onError?(error: string): void;
  onTimePoint?(position: number): void;
  children?: React.ReactNode;
};

function parseDuration(duration: number | null) {
  if (duration == null) {
    return duration;
  }
  return duration > 0 ? duration : Infinity;
}

const IVSPlayerContainer = React.forwardRef<IVSPlayerRef, Props>(
  (
    {
      style,
      streamUrl,
      paused,
      muted,
      loop = false,
      resizeMode,
      autoplay = true,
      liveLowLatency,
      rebufferToLive,
      playbackRate,
      pipEnabled,
      logLevel,
      progressInterval,
      volume,
      quality,
      autoMaxQuality,
      autoQualityMode,
      breakpoints = [],
      maxBitrate,
      initialBufferDuration,
      onSeek,
      onData,
      onVideoStatistics,
      onPlayerStateChange,
      onDurationChange,
      onQualityChange,
      onPipChange,
      onRebuffering,
      onLoadStart,
      onLoad,
      onLiveLatencyChange,
      onTextCue,
      onTextMetadataCue,
      onProgress,
      onError,
      onTimePoint,
      children,
    },
    ref
  ) => {
    const mediaPlayerRef = useRef(null);
    const initialized = useRef(false);

    const preload = useCallback((url: string) => {
      const sourceWrapper = createSourceWrapper(url);

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(mediaPlayerRef.current),

        UIManager.getViewManagerConfig(VIEW_NAME).Commands.preload,
        [sourceWrapper.getId(), sourceWrapper.getUri()]
      );

      return sourceWrapper;
    }, []);

    const loadSource = useCallback((source: Source) => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(mediaPlayerRef.current),

        UIManager.getViewManagerConfig(VIEW_NAME).Commands.loadSource,
        [source.getId()]
      );
    }, []);

    const releaseSource = useCallback((source: Source) => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(mediaPlayerRef.current),

        UIManager.getViewManagerConfig(VIEW_NAME).Commands.releaseSource,
        [source.getId()]
      );
    }, []);

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

    const setOrigin = useCallback((value) => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(mediaPlayerRef.current),

        UIManager.getViewManagerConfig(VIEW_NAME).Commands.setOrigin,
        [value]
      );
    }, []);

    const togglePip = useCallback(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(mediaPlayerRef.current),

        UIManager.getViewManagerConfig(VIEW_NAME).Commands.togglePip,
        []
      );
    }, []);

    useEffect(() => {
      if (initialized.current || autoplay) {
        if (paused) {
          pause();
        } else {
          play();
        }
      }
      initialized.current = true;
    }, [pause, paused, play, autoplay]);

    useImperativeHandle(
      ref,
      () => ({
        preload,
        loadSource,
        releaseSource,
        play,
        pause,
        seekTo,
        setOrigin,
        togglePip,
      }),
      [
        preload,
        loadSource,
        releaseSource,
        play,
        pause,
        seekTo,
        setOrigin,
        togglePip,
      ]
    );

    const onSeekHandler = (
      event: NativeSyntheticEvent<{ position: number }>
    ) => {
      const { position } = event.nativeEvent;
      onSeek?.(position);
    };

    const onPlayerStateChangeHandler = (
      event: NativeSyntheticEvent<{ state: PlayerState }>
    ) => {
      const { state } = event.nativeEvent;
      onPlayerStateChange?.(state);
    };

    const onDurationChangeHandler = (
      event: NativeSyntheticEvent<{ duration: number | null }>
    ) => {
      const { duration } = event.nativeEvent;

      onDurationChange?.(parseDuration(duration));
    };

    const onQualityChangeHandler = (
      event: NativeSyntheticEvent<{ quality: Quality }>
    ) => {
      const { quality: newQuality } = event.nativeEvent;
      onQualityChange?.(newQuality);
    };

    const onPipChangeHandler = (
      event: NativeSyntheticEvent<{ active: string | boolean }>
    ) => {
      const { active } = event.nativeEvent;
      onPipChange?.(active === true || active === 'true');
    };

    const onLoadHandler = (
      event: NativeSyntheticEvent<{
        duration: number | null;
      }>
    ) => {
      if (Platform.OS === 'android') {
        const shouldAutoPlay = autoplay && !paused;
        shouldAutoPlay ? play() : pause();
      }

      const { duration } = event.nativeEvent;

      onLoad?.(parseDuration(duration));
    };

    const onLiveLatencyChangeHandler = (
      event: NativeSyntheticEvent<{ liveLatency: number }>
    ) => {
      const { liveLatency } = event.nativeEvent;
      onLiveLatencyChange?.(liveLatency);
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

    const onVideoStatisticsHandler = (
      event: NativeSyntheticEvent<{ videoData: VideoData }>
    ) => {
      const { videoData } = event.nativeEvent;
      const statistics: VideoData = {
        ...videoData,
        duration: parseDuration(videoData.duration),
      };
      onVideoStatistics?.(statistics);
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
      <View style={[styles.container, style]} ref={ref as any}>
        <IVSPlayer
          testID="IVSPlayer"
          muted={muted}
          loop={loop}
          liveLowLatency={liveLowLatency}
          rebufferToLive={rebufferToLive}
          style={styles.mediaPlayer}
          ref={mediaPlayerRef}
          playbackRate={playbackRate}
          streamUrl={streamUrl}
          logLevel={logLevel}
          resizeMode={resizeMode}
          progressInterval={progressInterval}
          volume={volume}
          quality={quality}
          initialBufferDuration={initialBufferDuration}
          autoMaxQuality={autoMaxQuality}
          autoQualityMode={autoQualityMode}
          breakpoints={breakpoints}
          maxBitrate={maxBitrate}
          pipEnabled={pipEnabled}
          onVideoStatistics={
            onVideoStatistics ? onVideoStatisticsHandler : undefined
          }
          onData={onDataHandler}
          onSeek={onSeekHandler}
          onQualityChange={onQualityChangeHandler}
          onPipChange={onPipChangeHandler}
          onPlayerStateChange={onPlayerStateChangeHandler}
          onDurationChange={onDurationChangeHandler}
          onRebuffering={onRebuffering}
          onLoadStart={onLoadStart}
          onLoad={onLoadHandler}
          onTextCue={onTextCueHandler}
          onTextMetadataCue={onTextMetadataCueHandler}
          onProgress={onProgressHandler}
          onLiveLatencyChange={
            onLiveLatencyChange ? onLiveLatencyChangeHandler : undefined
          }
          onError={onErrorHandler}
          onTimePoint={onTimePointHandler}
        />
        <View style={styles.children}>{children}</View>
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
  children: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default IVSPlayerContainer;
