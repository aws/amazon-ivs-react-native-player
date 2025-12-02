import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  type NativeSyntheticEvent,
  type ViewStyle,
} from 'react-native';
import type {
  IVSPlayerRef,
  PlayerData,
  Quality,
  ResizeMode,
  Source,
  TextCue,
  TextMetadataCue,
  VideoData,
} from '../types';
import type { LogLevel, PlayerState } from '../types/enums';
import { createSourceWrapper } from '../types/source';
import AmazonIvsViewNativeComponent, {
  Commands,
} from './AmazonIvsViewNativeComponent';
import { ErrorNotification } from './ErrorNotification';

const MAX_PROGRESS_INTERVAL = 5;

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
  showErrorMessage?: boolean;
  playInBackground?: boolean;
  notificationTitle?: string;
  notificationText?: string;
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
      progressInterval = 1,
      volume,
      quality,
      autoMaxQuality,
      autoQualityMode,
      breakpoints = [],
      maxBitrate,
      initialBufferDuration,
      showErrorMessage,
      playInBackground = false,
      notificationTitle,
      notificationText,
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
    const [errorMessage, setErrorMessage] = useState<string>();

    const preload = (url: string) => {
      if (!mediaPlayerRef.current || !url) return null;
      const sourceWrapper = createSourceWrapper(url);

      Commands.preload(
        mediaPlayerRef.current,
        sourceWrapper.getUri(),
        sourceWrapper.getId()
      );

      return sourceWrapper;
    };

    const loadSource = (source: Source) => {
      if (!mediaPlayerRef.current || !source) return;
      Commands.loadSource(mediaPlayerRef.current, source.getId());
    };

    const releaseSource = (source: Source) => {
      if (!mediaPlayerRef.current || !source) return;
      Commands.releaseSource(mediaPlayerRef.current, source.getId());
    };

    const play = () => {
      if (!mediaPlayerRef.current) return;
      Commands.play(mediaPlayerRef.current);
    };

    const pause = () => {
      if (!mediaPlayerRef.current) return;
      Commands.pause(mediaPlayerRef.current);
    };

    const seekTo = (value: number) => {
      if (!mediaPlayerRef.current) return;
      Commands.seekTo(mediaPlayerRef.current, value);
    };

    const setOrigin = (value: string) => {
      if (!mediaPlayerRef.current) return;
      Commands.setOrigin(mediaPlayerRef.current, value);
    };

    const togglePip = () => {
      if (!mediaPlayerRef.current) return;
      Commands.togglePip(mediaPlayerRef.current);
    };

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
      const { quality } = event.nativeEvent;
      onQualityChange?.(quality);
    };

    const onPipChangeHandler = (
      event: NativeSyntheticEvent<{ active: boolean }>
    ) => {
      const { active } = event.nativeEvent;
      onPipChange?.(active);
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

      if (showErrorMessage) {
        setErrorMessage(error);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
      onError?.(error);
    };

    const onTimePointHandler = (
      event: NativeSyntheticEvent<{ position: number }>
    ) => {
      const { position } = event.nativeEvent;
      onTimePoint?.(position);
    };

    const constrainedProgressInterval = useMemo(() => {
      if (!progressInterval || progressInterval <= 0.1) {
        return 0.1;
      }

      return Math.min(progressInterval, MAX_PROGRESS_INTERVAL);
    }, [progressInterval]);

    return (
      <View style={[styles.container, style]}>
        <ErrorNotification message={errorMessage} />
        <AmazonIvsViewNativeComponent
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
          progressInterval={constrainedProgressInterval}
          volume={volume}
          quality={quality}
          initialBufferDuration={initialBufferDuration}
          autoMaxQuality={autoMaxQuality}
          autoQualityMode={autoQualityMode}
          breakpoints={breakpoints}
          maxBitrate={maxBitrate}
          pipEnabled={pipEnabled}
          playInBackground={playInBackground}
          notificationTitle={notificationTitle}
          notificationText={notificationText}
          onVideoStatistics={onVideoStatisticsHandler}
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
