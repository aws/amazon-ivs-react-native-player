import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Dimensions, StyleSheet, View, ScrollView } from 'react-native';
import IVSPlayer, {
  IVSPlayerRef,
  LogLevel,
  PlayerState,
  Quality,
  ResizeMode,
} from 'amazon-ivs-react-native-player';
import {
  IconButton,
  ActivityIndicator,
  Button,
  Text,
  Portal,
  Title,
} from 'react-native-paper';
import { Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { parseSecondsToString } from '../helpers';
import SettingsItem from '../components/SettingsItem';
import SettingsSliderItem from '../components/SettingsSliderItem';
import LogLevelPicker from '../components/LogLevelPicker';
import { Position, URL } from '../constants';
import SettingsInputItem from '../components/SettingsInputItem';
import SettingsSwitchItem from '../components/SettingsSwitchItem';
import type { RootStackParamList } from '../App';
import OptionPicker from '../components/OptionPicker';
import useAppState from '../useAppState';

const INITIAL_PLAYBACK_RATE = 1;
const INITIAL_PROGRESS_INTERVAL = 1;
const INITIAL_BREAKPOINTS = [10, 20, 40, 55, 60, 130, 250, 490, 970, 1930];
const UPDATED_BREAKPOINTS = [5, 15, 30, 45, 60, 120, 240, 480, 960, 1920];

type PlaygroundScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PlaygroundExample'
>;

type ResizeModeOption = {
  name: string;
  value: ResizeMode;
};

const RESIZE_MODES: ResizeModeOption[] = [
  {
    name: 'Aspect Fill',
    value: 'aspectFill',
  },
  {
    name: 'Aspect Fit',
    value: 'aspectFit',
  },
  {
    name: 'Aspect Zoom',
    value: 'aspectZoom',
  },
];

export default function PlaygroundExample() {
  const { setOptions } = useNavigation<PlaygroundScreenNavigationProp>();
  const mediaPlayerRef = React.useRef<IVSPlayerRef>(null);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [paused, setPaused] = useState(false);
  const [url, setUrl] = useState(URL);
  const [origin, setOrigin] = useState('');
  const [muted, setMuted] = useState(false);
  const [pauseInBackground, setPauseInBackground] = useState(false);
  const [manualQuality, setManualQuality] = useState<Quality | null>(null);
  const [detectedQuality, setDetectedQuality] = useState<Quality | null>(null);
  const [initialBufferDuration, setInitialBufferDuration] = useState(0.1);
  const [autoMaxQuality, setAutoMaxQuality] = useState<Quality | null>(null);
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [autoQualityMode, setAutoQualityMode] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [liveLowLatency, setLiveLowLatency] = useState(true);
  const [rebufferToLive, setRebufferToLive] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [logLevel, setLogLevel] = useState(LogLevel.IVSLogLevelError);
  const [progressInterval, setProgressInterval] = useState(1);
  const [volume, setVolume] = useState(1);
  const [position, setPosition] = useState<number>();
  const [lockPosition, setLockPosition] = useState(false);
  const [positionSlider, setPositionSlider] = useState(0);
  const [breakpoints, setBreakpoints] = useState<number[]>(INITIAL_BREAKPOINTS);
  const [orientation, setOrientation] = useState(Position.PORTRAIT);
  const [logs, setLogs] = useState<string[]>([]);
  const [resizeMode, setResizeMode] = useState<ResizeModeOption | null>(
    RESIZE_MODES[1]
  );

  useAppState({
    onBackground: () => {
      pauseInBackground && setPaused(true);
    },
    onForeground: () => {
      pauseInBackground && setPaused(false);
    },
  });

  const log = useCallback(
    (text: string) => {
      console.log(text);
      setLogs((logs) => [text, ...logs.slice(0, 30)]);
    },
    [setLogs]
  );

  const onDimensionChange = useCallback(
    ({ window: { width, height } }) => {
      if (width < height) {
        setOrientation(Position.PORTRAIT);

        setOptions({ headerShown: true, gestureEnabled: true });
      } else {
        setOrientation(Position.LANDSCAPE);
        setOptions({ headerShown: false, gestureEnabled: false });
      }
    },
    [setOptions]
  );

  useEffect(() => {
    Dimensions.addEventListener('change', onDimensionChange);

    return () => {
      Dimensions.removeEventListener('change', onDimensionChange);
    };
  }, [onDimensionChange]);

  const slidingCompleteHandler = (value: number) => {
    mediaPlayerRef?.current?.seekTo(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        {/*
          Note: A buffering indicator is included by default on Android. It's
          styling is managed in /example/android/app/src/main/res/values/styles.xml
          by adjusting the 'android:indeterminateTint'.
        */}
        {buffering && Platform.OS === 'ios' ? (
          <ActivityIndicator
            animating={true}
            size="large"
            style={styles.loader}
          />
        ) : null}

        <IVSPlayer
          key={resizeMode?.value}
          ref={mediaPlayerRef}
          paused={paused}
          resizeMode={resizeMode?.value}
          muted={muted}
          autoplay={autoplay}
          liveLowLatency={liveLowLatency}
          rebufferToLive={rebufferToLive}
          streamUrl={url}
          logLevel={logLevel}
          initialBufferDuration={initialBufferDuration}
          playbackRate={playbackRate}
          progressInterval={progressInterval}
          volume={volume}
          autoQualityMode={autoQualityMode}
          quality={manualQuality}
          autoMaxQuality={autoMaxQuality}
          breakpoints={breakpoints}
          onSeek={(newPosition) => console.log('new position', newPosition)}
          onPlayerStateChange={(state) => {
            if (state === PlayerState.Buffering) {
              log(`buffering at ${detectedQuality?.name}`);
            }
            if (state === PlayerState.Playing || state === PlayerState.Idle) {
              setBuffering(false);
            }
            log(`state changed: ${state}`);
          }}
          onDurationChange={(duration) => {
            setDuration(duration);
            log(`duration changed: ${parseSecondsToString(duration || 0)}`);
          }}
          onQualityChange={(newQuality) => {
            setDetectedQuality(newQuality);
            log(`quality changed: ${newQuality?.name}`);
          }}
          onPipChange={(isActive) => {
            log(`picture in picture changed - isActive: ${isActive}`);
          }}
          onRebuffering={() => setBuffering(true)}
          onLoadStart={() => log(`load started`)}
          onLoad={(loadedDuration) =>
            log(
              `loaded duration changed: ${parseSecondsToString(
                loadedDuration || 0
              )}`
            )
          }
          onLiveLatencyChange={(liveLatency) =>
            console.log(`live latency changed: ${liveLatency}`)
          }
          onTextCue={(textCue) => console.log('text cue', textCue)}
          onTextMetadataCue={(textMetadataCue) =>
            console.log('text metadata cue', textMetadataCue)
          }
          onProgress={(newPosition) => {
            if (!lockPosition) {
              setPosition(newPosition);
              setPositionSlider(newPosition);
            }
            console.log(
              `progress changed: ${parseSecondsToString(
                position ? position : 0
              )}`
            );
          }}
          onData={(data) => setQualities(data.qualities)}
          onVideoStatistics={(video) => console.log('onVideoStatistics', video)}
          onError={(error) => console.log('error', error)}
          onTimePoint={(timePoint) => console.log('time point', timePoint)}
        >
          {orientation === Position.PORTRAIT ? (
            <>
              <Button
                testID="settingsIcon"
                style={styles.icon}
                icon="cog"
                color="gray"
                onPress={() => setIsModalOpened(true)}
              >
                Settings
              </Button>
              <View style={styles.playButtonContainer}>
                <View style={styles.positionContainer}>
                  <View style={styles.durationsContainer}>
                    {duration && position !== null ? (
                      <Text style={styles.positionText} testID="videoPosition">
                        {parseSecondsToString(position ? position : 0)}
                      </Text>
                    ) : (
                      <Text />
                    )}
                    {duration ? (
                      <Text style={styles.positionText} testID="durationLabel">
                        {parseSecondsToString(duration)}
                      </Text>
                    ) : null}
                  </View>
                  {duration && !Number.isNaN(duration) ? (
                    <Slider
                      testID="durationSlider"
                      disabled={!duration || duration === Infinity}
                      minimumValue={0}
                      maximumValue={duration === Infinity ? 100 : duration}
                      value={duration === Infinity ? 100 : positionSlider}
                      onValueChange={setPosition}
                      onSlidingComplete={slidingCompleteHandler}
                      onTouchStart={() => setLockPosition(true)}
                      onTouchEnd={() => {
                        setLockPosition(false);
                        setPositionSlider(position ?? 0);
                      }}
                    />
                  ) : null}
                </View>
                <IconButton
                  testID="playPauseButton"
                  icon={paused ? 'play' : 'pause'}
                  size={40}
                  color="white"
                  onPress={() => {
                    setPaused((prev) => !prev);
                  }}
                  style={styles.playIcon}
                />
              </View>
            </>
          ) : null}
        </IVSPlayer>
        <View style={styles.logs}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.log} accessibilityLabel={log}>
              {log}
            </Text>
          ))}
        </View>
      </View>
      <Portal>
        {isModalOpened && (
          <View style={styles.modalContentContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Title>Settings</Title>
                <Button
                  testID="closeIcon"
                  icon="close"
                  color="gray"
                  onPress={() => setIsModalOpened(false)}
                >
                  Close
                </Button>
              </View>
              <ScrollView testID="modalScrollView">
                <View style={styles.settings}>
                  <SettingsInputItem
                    label="url"
                    onChangeText={setUrl}
                    value={url}
                    multiline
                  />
                  <SettingsItem label="Quality" testID="qualitiesPicker">
                    <OptionPicker
                      option={manualQuality}
                      options={qualities}
                      autoOption
                      setOption={(quality) => {
                        setAutoQualityMode(!quality);
                        setManualQuality(quality);
                      }}
                    />
                  </SettingsItem>
                  <SettingsItem label="Resize mode" testID="resizeModePicker">
                    <OptionPicker
                      option={resizeMode}
                      options={RESIZE_MODES}
                      setOption={(mode) => {
                        setResizeMode(mode);
                        log(`Resize mode changed: ${resizeMode?.value}`);
                      }}
                    />
                  </SettingsItem>
                  <SettingsSliderItem
                    label={`Playback Rate: ${playbackRate}`}
                    minimumValue={0.5}
                    maximumValue={2}
                    step={0.1}
                    value={playbackRate || INITIAL_PLAYBACK_RATE}
                    onValueChange={(value) =>
                      setPlaybackRate(Number(value.toFixed(1)))
                    }
                    testID="playbackRate"
                  />
                  <SettingsSliderItem
                    label={`Progress Interval: ${progressInterval}`}
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={progressInterval || INITIAL_PROGRESS_INTERVAL}
                    onValueChange={(value) =>
                      setProgressInterval(Number(value))
                    }
                    testID="progressInterval"
                  />
                  <SettingsSwitchItem
                    label="Muted"
                    value={muted}
                    onValueChange={setMuted}
                    testID="muted"
                  />
                  <SettingsSwitchItem
                    label="Autoplay"
                    onValueChange={setAutoplay}
                    value={autoplay}
                    testID="autoplay"
                  />
                  <SettingsSwitchItem
                    label="Paused"
                    onValueChange={setPaused}
                    value={paused}
                    testID="paused"
                  />
                  <SettingsSliderItem
                    label={`Volume: ${volume.toFixed(1)}`}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    value={volume}
                    onValueChange={setVolume}
                    testID="volume"
                  />
                  <SettingsSliderItem
                    label={`Initial buffer duration: ${initialBufferDuration.toFixed(
                      1
                    )}`}
                    minimumValue={0.1}
                    maximumValue={5}
                    step={0.1}
                    value={initialBufferDuration}
                    onValueChange={setInitialBufferDuration}
                    testID="initialBufferDuration"
                  />
                  <SettingsSwitchItem
                    label="Live Low Latency"
                    onValueChange={setLiveLowLatency}
                    value={liveLowLatency}
                    testID="liveLowLatency"
                  />
                  <SettingsSwitchItem
                    label="Rebuffer To Live"
                    onValueChange={setRebufferToLive}
                    value={rebufferToLive}
                    testID="rebufferToLive"
                  />
                  <SettingsSwitchItem
                    label="Pause in background"
                    value={pauseInBackground}
                    onValueChange={setPauseInBackground}
                    testID="pauseInBackground"
                  />
                  <SettingsItem label="Log Level" testID="logLevelPicker">
                    <LogLevelPicker
                      logLevel={logLevel}
                      setLogLevel={setLogLevel}
                    />
                  </SettingsItem>
                  <SettingsSwitchItem
                    label="Auto Quality"
                    onValueChange={(value) => {
                      if (value) {
                        setManualQuality(null);
                      }
                      setAutoQualityMode(value);
                    }}
                    value={autoQualityMode}
                    testID="autoQuality"
                  />
                  <SettingsItem
                    label="Auto Max Quality"
                    testID="autoMaxQualityPicker"
                  >
                    <OptionPicker
                      option={autoMaxQuality}
                      options={qualities}
                      autoOption
                      setOption={setAutoMaxQuality}
                    />
                  </SettingsItem>
                  <SettingsItem label="Breakpoints">
                    <Button onPress={() => setBreakpoints(UPDATED_BREAKPOINTS)}>
                      Add
                    </Button>
                  </SettingsItem>
                  <SettingsInputItem
                    label="origin"
                    onChangeText={setOrigin}
                    value={origin}
                  />
                  <SettingsItem label=" ">
                    <Button
                      onPress={() => {
                        mediaPlayerRef.current?.setOrigin(origin);
                        log(`header origin set to: ${origin}`);
                      }}
                    >
                      setOrigin
                    </Button>
                  </SettingsItem>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: 'black',
  },
  playerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  playButtonContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  playIcon: {
    borderWidth: 1,
    borderColor: 'white',
  },
  positionContainer: {
    width: '100%',
  },
  durationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    position: 'absolute',
    top: 5,
    right: 0,
  },
  settings: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  settingsHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  positionText: {
    color: 'white',
  },
  settingsTitle: {
    paddingBottom: 8,
  },
  flex1: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
  },
  logs: {
    top: 0,
    width: '100%',
    height: 250,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#e2e2e2',
    padding: 10,
    paddingTop: 20,
  },
  log: {
    fontSize: 7,
  },
  modalContentContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalContent: { backgroundColor: 'white', borderRadius: 4, height: '80%' },
  modalHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
