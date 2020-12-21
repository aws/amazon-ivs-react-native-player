import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import MediaPlayer from 'react-native-amazon-ivs';

export default function App() {
  return (
    <View style={styles.container}>
      <MediaPlayer style={styles.player} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  player: {
    width: '100%',
    height: '100%',
  },
});
