import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import SettingsItem from './SettingsItem';

type Props = {
  label: string;
  value: number;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  onValueChange: (value: number) => void;
  testID?: string;
};

const SettingsSliderItem = ({
  label,
  value,
  step,
  minimumValue,
  maximumValue,
  onValueChange,
  testID,
}: Props) => {
  return (
    <SettingsItem label={label}>
      <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onValueChange}
      />
      <TextInput
        value={value.toFixed(1)}
        onChangeText={(val) => val && onValueChange(parseFloat(val))}
        dense
        textAlign="left"
        mode="outlined"
        testID={testID}
      />
    </SettingsItem>
  );
};

const styles = StyleSheet.create({
  slider: {
    flex: 1,
    marginRight: 10,
  },
});

export default SettingsSliderItem;
