import * as React from 'react';
import { Button, SafeAreaView, StyleSheet, View } from 'react-native';
import MediaPlayer, { MediaPlayerRef } from 'react-native-amazon-ivs';
import BottomSheet from '@gorhom/bottom-sheet';
import { useState } from 'react';
import SettingsInputItem from './components/SettingsInputItem';
import SettingsSwitchItem from './components/SettingsSwitchItem';
import { IconButton, Title } from 'react-native-paper';

export default function PlayerPlaygroundScreen() {
  const sheetRef = React.useRef<BottomSheet>(null);
  const mediaPlayerRef = React.useRef<MediaPlayerRef>(null);
  const [paused, setPaused] = useState(false);
  const [url, setUrl] = useState(
    'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8'
  );
  const [muted, setMuted] = useState(false);

  const handleSettingsOpen = React.useCallback(() => {
    sheetRef?.current?.expand();
  }, []);

  return (
    <View style={styles.container}>
      <MediaPlayer
        ref={mediaPlayerRef}
        paused={paused}
        muted={muted}
        streamUrl={url}
        onSeek={(position) => console.log('new position ', position)}
        onPlayerStateChange={(state) => console.log('state changed', state)}
      />
      <SafeAreaView style={styles.settingsIcon}>
        <IconButton
          icon="cog"
          size={30}
          color="black"
          onPress={handleSettingsOpen}
        />
      </SafeAreaView>
      <SafeAreaView>
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
          <SettingsSwitchItem
            label="is muted"
            value={muted}
            onValueChange={setMuted}
          />
          <SettingsSwitchItem
            label="is paused"
            onValueChange={setPaused}
            value={paused}
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
  player: {
    width: '100%',
    height: '100%',
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
});
