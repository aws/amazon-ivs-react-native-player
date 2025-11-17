import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Switch } from 'react-native-paper';
import { theme } from '../App';
import SettingsItem from './SettingsItem';

type Props = {
  label: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
  testID?: string;
};

const SettingsSwitchItem = ({ label, onValueChange, value, testID }: Props) => {
  const [switchValue, setSwitchValue] = useState(value);

  const onToggleSwitch = () => {
    setSwitchValue(!switchValue);
    onValueChange(!switchValue);
  };

  return (
    <SettingsItem label={label} style={styles.item}>
      <Switch
        onValueChange={onToggleSwitch}
        value={switchValue}
        color={theme.colors.primary}
        testID={testID}
      />
    </SettingsItem>
  );
};

const styles = StyleSheet.create({
  item: {
    width: '50%',
  },
});

export default SettingsSwitchItem;
