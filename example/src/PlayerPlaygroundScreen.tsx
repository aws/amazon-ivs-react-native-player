import * as React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MediaPlayer, {
  MediaPlayerRef,
  PlayerState,
} from 'react-native-amazon-ivs';
import BottomSheet from '@gorhom/bottom-sheet';
import { useState } from 'react';
import SettingsInputItem from './components/SettingsInputItem';
import SettingsSwitchItem from './components/SettingsSwitchItem';
import { IconButton, Title, ActivityIndicator } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { parseSeconds } from './helpers';
import SettingsItem from './components/SettingsItem';

export default function PlayerPlaygroundScreen() {
  const sheetRef = React.useRef<BottomSheet>(null);
  const mediaPlayerRef = React.useRef<MediaPlayerRef>(null);
  const [paused, setPaused] = useState(false);
  const [url, setUrl] = useState(
    'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8'
  );
  const [muted, setMuted] = useState(false);
  const [looping, setLooping] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [liveLowLatency, setLiveLowLatency] = useState(true);
  // min - 0.5 max - 2.0
  const [playbackRate, setPlaybackRate] = useState(1);

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
          playbackRate={playbackRate}
          onSeek={(position) => console.log('new position', position)}
          onPlayerStateChange={(state) => {
            if (state === PlayerState.Playing || state === PlayerState.Idle) {
              setBuffering(false);
            }
            console.log('state changed', state);
          }}
          onDurationChange={setDuration}
          onQualityChange={(quality) => console.log('quality changed', quality)}
          onBuffer={() => setBuffering(true)}
          onLoadStart={() => console.log('loadStart')}
          onLoad={(loadedDuration) =>
            console.log('load ', loadedDuration, ' - duration')
          }
          onLiveLatencyChange={(liveLatency) =>
            console.log('live latency', liveLatency)
          }
          onData={(data) => console.log(data)}
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
          {/* TODO: placeholder for current time */}
          <Text />
          {duration ? <Text>{parseSeconds(duration)}</Text> : null}
        </View>
        {duration ? (
          <Slider
            minimumValue={0}
            maximumValue={duration}
            onSlidingComplete={slidingCompleteHandler}
          />
        ) : null}
        <Button
          title="Play"
          onPress={() =>
            mediaPlayerRef.current ? mediaPlayerRef.current.play() : null
          }
        />
        <Button
          title="Pause"
          onPress={() =>
            mediaPlayerRef.current ? mediaPlayerRef.current.pause() : null
          }
        />
      </SafeAreaView>
      <BottomSheet ref={sheetRef} index={0} snapPoints={[0, '50%']}>
        <View style={styles.settings}>
          <Title style={styles.settingsTitle}>Settings</Title>
          <SettingsInputItem label="url" onChangeText={setUrl} text={url} />
          <SettingsItem label={`Playback Rate: ${playbackRate}`}>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2}
              step={0.1}
              value={playbackRate}
              onValueChange={(value) =>
                setPlaybackRate(Number(value.toFixed(1)))
              }
            />
          </SettingsItem>
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
          <SettingsSwitchItem
            label="Live Low Latency"
            onValueChange={setLiveLowLatency}
            value={liveLowLatency}
          />
        </View>
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
  },
  settingsTitle: {
    paddingBottom: 8,
  },
  slider: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
  },
});
