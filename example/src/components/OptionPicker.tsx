import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

interface Props<T> {
  option: T | null;
  options: T[];
  autoOption?: boolean;
  setOption: (quality: T | null) => void;
}

type ObjectWithOneRequiredProperty = Record<string, any> & { name: string };

function OptionPicker<T extends ObjectWithOneRequiredProperty>({
  option,
  options,
  autoOption,
  setOption,
}: Props<T>) {
  const sortedQualities = options.sort((a, b) => (a.name > b.name ? -1 : 1));

  return (
    <View style={styles.container}>
      {autoOption && (
        <Button
          style={styles.button}
          mode={!option ? 'contained' : 'outlined'}
          compact
          onPress={() => setOption(null)}
        >
          Auto
        </Button>
      )}
      {sortedQualities.map((optionItem) => (
        <Button
          style={styles.button}
          key={optionItem.name}
          mode={option === optionItem ? 'contained' : 'outlined'}
          compact
          onPress={() => setOption(optionItem)}
        >
          {optionItem.name}
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

export default OptionPicker;
