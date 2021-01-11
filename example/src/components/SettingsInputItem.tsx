import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import SettingsItem from './SettingsItem';
import { useDebounce } from '../hooks';

type Props = {
  label: string;
  onChangeText: (text: string) => void;
  value: string;
};

const SettingsInputItem = ({ label, onChangeText, value }: Props) => {
  const [internalValue, setInternalValue] = useState(value);
  const finalValue = useDebounce(internalValue, 1000);

  useEffect(() => {
    onChangeText(finalValue.trim());
  }, [finalValue, onChangeText]);

  return (
    <SettingsItem label={label}>
      <TextInput
        mode="outlined"
        value={internalValue}
        onChangeText={setInternalValue}
        style={styles.input}
        dense
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
