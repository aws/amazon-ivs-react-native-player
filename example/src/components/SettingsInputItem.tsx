import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDebounce } from '../hooks';
import SettingsItem from './SettingsItem';

type Props = {
  testID?: string;
  label: string;
  onChangeText: (text: string) => void;
  value: string;
  multiline?: boolean;
};

const SettingsInputItem = ({
  label,
  onChangeText,
  value,
  multiline,
}: Props) => {
  const [internalValue, setInternalValue] = useState(value);
  const finalValue = useDebounce(internalValue, 1000);

  useEffect(() => {
    if (finalValue.trim().length > 0) {
      onChangeText(finalValue.trim());
    }
  }, [finalValue, onChangeText]);

  return (
    <SettingsItem label={label}>
      <TextInput
        testID={`${label}Input`}
        mode="outlined"
        value={internalValue}
        onChangeText={setInternalValue}
        style={styles.input}
        dense
        multiline={multiline}
      />
    </SettingsItem>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
  },
});

export default SettingsInputItem;
