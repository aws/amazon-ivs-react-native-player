import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import IVSPlayer, {
  IVSPlayerRef,
  LogLevel,
  PlayerState,
  Quality,
} from 'react-native-amazon-ivs';
import BottomSheet from 'reanimated-bottom-sheet';
import {
  IconButton,
  Title,
  ActivityIndicator,
  Button,
  Text,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { parseSeconds } from '../helpers';
import SettingsItem from '../components/SettingsItem';
import QualitiesPicker from '../components/QualitiesPicker';
import SettingsSliderItem from '../components/SettingsSliderItem';
import LogLevelPicker from '../components/LogLevelPicker';
import { Position } from '../constants';
import SettingsInputItem from '../components/SettingsInputItem';
import SettingsSwitchItem from '../components/SettingsSwitchItem';
import type { RootStackParamList } from '../App';

const INITIAL_PLAYBACK_RATE = 1;
const INITIAL_PROGRESS_INTERVAL = 1;
const INITIAL_BREAKPOINTS = [10, 20, 40, 55, 60, 130, 250, 490, 970, 1930];
const UPDATED_BREAKPOINTS = [5, 15, 30, 45, 60, 120, 240, 480, 960, 1920];

type PlaygroundScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PlaygroundExample'
>;

export default function PlaygroundExample() {
  const { setOptions } = useNavigation<PlaygroundScreenNavigationProp>();
  const sheetRef = React.useRef<BottomSheet>(null);
  const mediaPlayerRef = React.useRef<IVSPlayerRef>(null);
  const [autoplay, setAutoplay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [paused, setPaused] = useState(false);
  const [url, setUrl] = useState(
    'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8'
  );
  const [muted, setMuted] = useState(false);
  const [quality, setQuality] = useState<Quality | null>(null);
  const [autoMaxQuality, setAutoMaxQuality] = useState<Quality | null>(null);
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [autoQualityMode, setAutoQualityMode] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [liveLowLatency, setLiveLowLatency] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [logLevel, setLogLevel] = useState(LogLevel.IVSLogLevelError);
  const [progressInterval, setProgressInterval] = useState(1);
  const [volume, setVolume] = useState(1);
  const [position, setPosition] = useState<number>();
  const [lockPosition, setLockPosition] = useState(false);
  const [positionSlider, setPositionSlider] = useState(0);
  const [breakpoints, setBreakpoints] = useState<number[]>(INITIAL_BREAKPOINTS);
  const [, setOpenSheet] = useState(false);
  const [orientation, setOrientation] = useState(Position.PORTRAIT);

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

  const handleToggleSettings = React.useCallback(() => {
    setOpenSheet((prev) => {
      if (prev) {
        sheetRef?.current?.snapTo(1);
      } else {
        sheetRef?.current?.snapTo(0);
      }

      return !prev;
    });
  }, []);

  const slidingCompleteHandler = (value: number) => {
    mediaPlayerRef?.current?.seekTo(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        {buffering ? (
          <ActivityIndicator
            animating={true}
            size="large"
            style={styles.loader}
          />
        ) : null}
        <IVSPlayer
          ref={mediaPlayerRef}
          paused={paused}
          muted={muted}
          autoplay={autoplay}
          liveLowLatency={liveLowLatency}
          streamUrl={url}
          logLevel={logLevel}
          playbackRate={playbackRate}
          progressInterval={progressInterval}
          volume={volume}
          autoQualityMode={autoQualityMode}
          quality={quality}
          autoMaxQuality={autoMaxQuality}
          breakpoints={breakpoints}
          onSeek={(newPosition) => console.log('new position', newPosition)}
          onPlayerStateChange={(state) => {
            if (state === PlayerState.Playing || state === PlayerState.Idle) {
              setBuffering(false);
            }
            console.log('state changed', state);
          }}
          onDurationChange={setDuration}
          onQualityChange={(newQuality) =>
            console.log('quality changed', newQuality)
          }
          onBuffer={() => setBuffering(true)}
          onLoadStart={() => console.log('loadStart')}
          onLoad={(loadedDuration) =>
            console.log('load ', loadedDuration, ' - duration')
          }
          onLiveLatencyChange={(liveLatency) =>
            console.log('live latency', liveLatency)
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
          }}
          onBandwidthEstimateChange={(bandwidthEstimate) =>
            console.log('bandwidth estimate', bandwidthEstimate)
          }
          onData={(data) => setQualities(data.qualities)}
          onVideoStatistics={(video) => console.log('onVideoStatistics', video)}
          onError={(error) => console.log('error', error)}
          onTimePoint={(timePoint) => console.log('time point', timePoint)}
        />
      </View>
      {orientation === Position.PORTRAIT ? (
        <>
          <IconButton
            style={styles.icon}
            icon="cog"
            size={25}
            color="lightgrey"
            onPress={handleToggleSettings}
          />
          <SafeAreaView style={styles.playButtonContainer}>
            <View style={styles.positionContainer}>
              <View style={styles.durationsContainer}>
                {duration && position !== null ? (
                  <Text style={styles.positionText}>
                    {parseSeconds(position ? position : 0)}
                  </Text>
                ) : (
                  <Text />
                )}
                {duration ? (
                  <Text style={styles.positionText}>
                    {parseSeconds(duration)}
                  </Text>
                ) : null}
              </View>
              {duration ? (
                <Slider
                  minimumValue={0}
                  maximumValue={duration}
                  value={positionSlider}
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
              icon={isPlaying ? 'pause' : 'play'}
              size={40}
              color="white"
              onPress={() => {
                isPlaying
                  ? mediaPlayerRef.current?.pause()
                  : mediaPlayerRef.current?.play();
                setIsPlaying((prev) => !prev);
              }}
              style={styles.playIcon}
            />
          </SafeAreaView>
        </>
      ) : null}
      <BottomSheet
        ref={sheetRef}
        initialSnap={1}
        snapPoints={['80%', 0]}
        enabledContentTapInteraction={false}
        onCloseEnd={() => setOpenSheet(false)}
        renderHeader={() => (
          <View style={styles.settingsHeader}>
            <Title style={styles.settingsTitle}>Settings</Title>
          </View>
        )}
        renderContent={() => (
          <View style={styles.settings}>
            <SettingsInputItem
              label="url"
              onChangeText={setUrl}
              value={url}
              multiline
            />
            <SettingsItem label="Quality">
              <QualitiesPicker
                quality={quality}
                qualities={qualities}
                setQuality={setQuality}
              />
            </SettingsItem>
            <SettingsItem label={`Playback Rate: ${playbackRate}`}>
              <Slider
                style={styles.flex1}
                minimumValue={0.5}
                maximumValue={2}
                step={0.1}
                value={INITIAL_PLAYBACK_RATE}
                onValueChange={(value) =>
                  setPlaybackRate(Number(value.toFixed(1)))
                }
              />
            </SettingsItem>
            <SettingsSliderItem
              label={`Progress Interval: ${progressInterval}`}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={INITIAL_PROGRESS_INTERVAL}
              onValueChange={(value) => setProgressInterval(Number(value))}
            />
            <SettingsSwitchItem
              label="Muted"
              value={muted}
              onValueChange={setMuted}
            />
            <SettingsSwitchItem
              label="Autoplay"
              onValueChange={setAutoplay}
              value={autoplay}
            />
            <SettingsSwitchItem
              label="Paused"
              onValueChange={setPaused}
              value={paused}
            />
            <SettingsSliderItem
              label={`Volume: ${volume.toFixed(1)}`}
              minimumValue={0}
              maximumValue={1}
              step={0.1}
              value={volume}
              onValueChange={setVolume}
            />
            <SettingsSwitchItem
              label="Live Low Latency"
              onValueChange={setLiveLowLatency}
              value={liveLowLatency}
            />
            <SettingsItem label="Log Level">
              <LogLevelPicker logLevel={logLevel} setLogLevel={setLogLevel} />
            </SettingsItem>
            <SettingsSwitchItem
              label="Auto Quality"
              onValueChange={setAutoQualityMode}
              value={autoQualityMode}
            />
            <SettingsItem label="Auto Max Quality">
              <QualitiesPicker
                quality={autoMaxQuality}
                qualities={qualities}
                setQuality={setAutoMaxQuality}
              />
            </SettingsItem>
            <SettingsItem label="Breakpoints">
              <Button onPress={() => setBreakpoints(UPDATED_BREAKPOINTS)}>
                Add
              </Button>
            </SettingsItem>
          </View>
        )}
      />
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
    justifyContent: 'center',
    position: 'absolute',
    bottom: 15,
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
    backgroundColor: '#fff',
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
});
