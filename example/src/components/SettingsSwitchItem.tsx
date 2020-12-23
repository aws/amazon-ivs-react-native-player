import React from 'react';
import { Switch } from 'react-native-paper';
import { theme } from '../App';
import SettingsItem from './SettingsItem';

type Props = {
  label: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
};

const SettingsSwitchItem = ({ label, onValueChange, value }: Props) => (
  <SettingsItem label={label}>
    <Switch
      onValueChange={onValueChange}
      value={value}
      color={theme.colors.primary}
    />
  </SettingsItem>
);

export default SettingsSwitchItem;
