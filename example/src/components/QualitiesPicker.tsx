import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import type { Quality } from 'src/types';

type Props = {
  quality: Quality | null;
  qualities: Quality[];
  setQuality: (quality: Quality | null) => void;
};

function QualitiesPicker({ quality, qualities, setQuality }: Props) {
  const sortedQualities = qualities.sort((a, b) => (a.name > b.name ? -1 : 1));

  return (
    <View style={styles.container}>
      <Button
        style={styles.button}
        mode={!quality ? 'contained' : 'outlined'}
        compact
        onPress={() => setQuality(null)}
      >
        Auto
      </Button>
      {sortedQualities.map((qualityOption) => (
        <Button
          style={styles.button}
          key={qualityOption.name}
          mode={quality === qualityOption ? 'contained' : 'outlined'}
          compact
          onPress={() => setQuality(qualityOption)}
        >
          {qualityOption.name}
        </Button>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  button: {
    marginBottom: 5,
    marginHorizontal: 5,
    minWidth: 60,
  },
});

export default QualitiesPicker;
