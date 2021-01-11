import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MediaPlayer, {
  MediaPlayerRef,
  LogLevel,
  PlayerState,
} from 'react-native-amazon-ivs';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useState } from 'react';
import SettingsInputItem from './components/SettingsInputItem';
import SettingsSwitchItem from './components/SettingsSwitchItem';
import {
  RadioButton,
  Button,
  IconButton,
  Title,
  ActivityIndicator,
} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { parseSeconds } from './helpers';
import SettingsItem from './components/SettingsItem';
import type { Quality } from 'src/types';
import QualitiesPicker from './components/QualitiesPicker';
import SettingsSliderItem from './components/SettingsSliderItem';

const INITIAL_PLAYBACK_RATE = 1;
const INITIAL_PROGRESS_INTERVAL = 1;

export default function PlayerPlaygroundScreen() {
  const sheetRef = React.useRef<BottomSheet>(null);
  const mediaPlayerRef = React.useRef<MediaPlayerRef>(null);
  const [paused, setPaused] = useState(false);
  const [url, setUrl] = useState(
    'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8'
  );
  const [muted, setMuted] = useState(false);
  const [quality, setQuality] = useState<Quality | null>(null);
  const [autoMaxQuality, setAutoMaxQuality] = useState<Quality | null>(null);
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [autoQualityMode, setAutoQualityMode] = useState(true);
  const [looping, setLooping] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [liveLowLatency, setLiveLowLatency] = useState(true);
  // min - 0.5 max - 2.0
  const [playbackRate, setPlaybackRate] = useState(1);
  const [logLevel, setLogLevel] = useState(LogLevel.IVSLogLevelError);
  const [logLevelRadioValue, setLogLevelRadioValue] = useState('error');
  const [progressInterval, setProgressInterval] = useState(1);
  const [volume, setVolume] = useState(1);
  const [position, setPosition] = useState<number>();
  const [lockPosition, setLockPosition] = useState(false);
  const [positionSlider, setPositionSlider] = useState(0);

  const handleSettingsOpen = React.useCallback(() => {
    sheetRef?.current?.expand();
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

        <MediaPlayer
          ref={mediaPlayerRef}
          paused={paused}
          muted={muted}
          looping={looping}
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
          onError={(error) => console.log('error', error)}
        />
      </View>
      <SafeAreaView style={styles.settingsIcon}>
        <IconButton
          icon="cog"
          size={30}
          color="black"
          onPress={handleSettingsOpen}
        />
      </SafeAreaView>
      <SafeAreaView>
        <View style={styles.durationsContainer}>
          {duration && position ? (
            <Text>{parseSeconds(position ?? 0)}</Text>
          ) : null}
          {duration ? <Text>{parseSeconds(duration)}</Text> : null}
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
        <Button
          onPress={() =>
            mediaPlayerRef.current ? mediaPlayerRef.current.play() : null
          }
        >
          Play
        </Button>
        <Button
          onPress={() =>
            mediaPlayerRef.current ? mediaPlayerRef.current.pause() : null
          }
        >
          Pause
        </Button>
      </SafeAreaView>
      <BottomSheet ref={sheetRef} index={0} snapPoints={[0, '80%']}>
        <BottomSheetScrollView>
          <View style={styles.settings}>
            <Title style={styles.settingsTitle}>Settings</Title>
            <SettingsInputItem label="url" onChangeText={setUrl} value={url} />
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
              label="Looping"
              onValueChange={setLooping}
              value={looping}
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
              <View style={styles.flex1}>
                <RadioButton.Group
                  value={logLevelRadioValue}
                  onValueChange={(newValue) => {
                    setLogLevelRadioValue(newValue);
                    switch (newValue) {
                      case 'debug':
                        return setLogLevel(LogLevel.IVSLogLevelDebug);
                      case 'info':
                        return setLogLevel(LogLevel.IVSLogLevelInfo);
                      case 'warning':
                        return setLogLevel(LogLevel.IVSLogLevelWarning);
                      case 'error':
                        return setLogLevel(LogLevel.IVSLogLevelError);
                    }
                  }}
                >
                  <RadioButton.Item value="debug" label="Debug" />
                  <RadioButton.Item value="info" label="Info" />
                  <RadioButton.Item value="warning" label="Warning" />
                  <RadioButton.Item value="error" label="Error" />
                </RadioButton.Group>
              </View>
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
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  playerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  durationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settingsIcon: {
    position: 'absolute',
    top: 15,
    right: 0,
  },
  settings: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
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
