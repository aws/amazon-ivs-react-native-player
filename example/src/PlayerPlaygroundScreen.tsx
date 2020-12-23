import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import MediaPlayer from 'react-native-amazon-ivs';
import BottomSheet from '@gorhom/bottom-sheet';
import { useState } from 'react';
import SettingsInputItem from './components/SettingsInputItem';
import SettingsSwitchItem from './components/SettingsSwitchItem';
import { IconButton, Title } from 'react-native-paper';

export default function PlayerPlaygroundScreen() {
  const sheetRef = React.useRef<BottomSheet>(null);
  const [url, setUrl] = useState('');
  const [muted, setMuted] = useState(false);

  const handleSettingsOpen = React.useCallback(() => {
    sheetRef?.current?.expand();
  }, []);

  return (
    <View style={styles.container}>
      <MediaPlayer style={styles.player} />
      <SafeAreaView style={styles.settingsIcon}>
        <IconButton
          icon="cog"
          size={30}
          color="black"
          onPress={handleSettingsOpen}
        />
      </SafeAreaView>
      <BottomSheet ref={sheetRef} index={0} snapPoints={[0, '50%']}>
        <View style={styles.settings}>
          <Title style={styles.settingsTitle}>Settings</Title>
          <SettingsInputItem
            label="url"
            onChangeText={setUrl}
            text={url}
          ></SettingsInputItem>
          <SettingsSwitchItem
            label="is muted"
            value={muted}
            onValueChange={setMuted}
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
