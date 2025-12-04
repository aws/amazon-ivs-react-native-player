import {
  codegenNativeCommands,
  codegenNativeComponent,
  type HostComponent,
  type ViewProps,
} from 'react-native';
import type {
  DirectEventHandler,
  Double,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';

type Quality = {
  name: string;
  codecs: string;
  bitrate: Int32;
  framerate: Double;
  width: Int32;
  height: Int32;
};

export interface NativeProps extends ViewProps {
  muted?: boolean;
  loop?: boolean;
  streamUrl?: string;
  liveLowLatency?: boolean;
  rebufferToLive?: boolean;
  playbackRate?: Double;
  logLevel?: Int32;
  resizeMode?: string;
  volume?: Double;
  quality?: Quality | null;
  autoMaxQuality?: Quality | null;
  autoQualityMode?: boolean;
  breakpoints?: Int32[];
  maxBitrate?: Int32;
  initialBufferDuration?: Double;
  pipEnabled?: boolean;
  progressInterval?: Double;
  maxVideoSize?: { size: { width: Int32; height: Int32 } };
  networkRecoveryMode?: string;
  playInBackground?: boolean;
  notificationTitle?: string;
  notificationText?: string;
  onLoadStart?: DirectEventHandler<{}>;
  onVideoStatistics?: DirectEventHandler<{
    videoData: {
      bitrate: Int32;
      duration: Int32 | null;
      framesDecoded?: Int32 | null;
      framesDropped?: Int32 | null;
    };
  }>;
  onData?: DirectEventHandler<{
    playerData: {
      version: string;
      sessionId: string;
      qualities: {
        name: string;
        codecs: string;
        bitrate: Int32;
        framerate: Double;
        width: Int32;
        height: Int32;
      }[];
    };
  }>;
  onSeek?: DirectEventHandler<{
    position: Double;
  }>;
  onQualityChange?: DirectEventHandler<{
    quality: {
      name: string;
      codecs: string;
      bitrate: Int32;
      framerate: Double;
      width: Int32;
      height: Int32;
    };
  }>;
  onProgress?: DirectEventHandler<{ position: Double }>;
  onPipChange?: DirectEventHandler<{ active: boolean }>;
  onPlayerStateChange?: DirectEventHandler<{ state: string }>;
  onDurationChange?: DirectEventHandler<{ duration: Double }>;
  onError?: DirectEventHandler<{ error: string }>;
  onTextCue?: DirectEventHandler<{
    textCue: {
      type: string;
      line: Double;
      size: Double;
      position: Double;
      text: string;
      textAlignment: string;
    };
  }>;
  onLiveLatencyChange?: DirectEventHandler<{ liveLatency?: Int32 }>;
  onTextMetadataCue?: DirectEventHandler<{
    textMetadataCue: {
      type: string;
      text: string;
      textDescription: string;
    };
  }>;
  onLoad?: DirectEventHandler<{ duration?: Double }>;
  onRebuffering?: DirectEventHandler<{}>;
  onTimePoint?: DirectEventHandler<{ position?: Double }>;
  onVideoSizeChange?: DirectEventHandler<{
    size: { width: Int32; height: Int32 };
  }>;
  onSeekComplete?: DirectEventHandler<{ success: boolean }>;
}

interface NativeCommands {
  preload: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    url: string,
    sourceId: Int32
  ) => void;
  loadSource: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    sourceId: Int32
  ) => void;
  releaseSource: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    sourceId: Int32
  ) => void;
  play: (viewRef: React.ElementRef<HostComponent<NativeProps>>) => void;
  pause: (viewRef: React.ElementRef<HostComponent<NativeProps>>) => void;
  seekTo: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    value: Double
  ) => void;
  setOrigin: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    value: string
  ) => void;
  togglePip: (viewRef: React.ElementRef<HostComponent<NativeProps>>) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: [
    'preload',
    'loadSource',
    'releaseSource',
    'play',
    'pause',
    'seekTo',
    'setOrigin',
    'togglePip',
  ],
});

export default codegenNativeComponent<NativeProps>('AmazonIvs');
