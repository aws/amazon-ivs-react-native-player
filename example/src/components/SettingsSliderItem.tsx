import React from 'react';
import { StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import SettingsItem from './SettingsItem';

type Props = {
  label: string;
  value: number;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  onValueChange: (value: number) => void;
};

const SettingsSliderItem = ({
  label,
  value,
  step,
  minimumValue,
  maximumValue,
  onValueChange,
}: Props) => {
  return (
    <SettingsItem label={label}>
      <Slider
        style={styles.flex1}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onValueChange}
      />
    </SettingsItem>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});

export default SettingsSliderItem;
