import React from 'react';
import { StyleSheet } from 'react-native';
import { Switch } from 'react-native-paper';
import { theme } from '../App';
import SettingsItem from './SettingsItem';

type Props = {
  label: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
};

const SettingsSwitchItem = ({ label, onValueChange, value }: Props) => (
  <SettingsItem label={label} style={styles.item}>
    <Switch
      onValueChange={onValueChange}
      value={value}
      color={theme.colors.primary}
    />
  </SettingsItem>
);

const styles = StyleSheet.create({
  item: {
    width: '50%',
  },
});

export default SettingsSwitchItem;
