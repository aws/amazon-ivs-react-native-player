import React from 'react';
import { StyleSheet } from 'react-native';
import SettingsItem from './SettingsItem';
import { TextInput } from 'react-native-paper';

type Props = {
  label: string;
  onChangeText: (text: string) => void;
  text: string;
};

const SettingsInputItem = ({ label, onChangeText, text }: Props) => (
  <SettingsItem label={label}>
    <TextInput
      mode="outlined"
      value={text}
      onChangeText={onChangeText}
      style={styles.input}
      dense
    />
  </SettingsItem>
);

const styles = StyleSheet.create({
  input: {
    flex: 1,
  },
});

export default SettingsInputItem;
