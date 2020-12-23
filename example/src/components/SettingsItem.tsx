import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Caption } from 'react-native-paper';

type Props = {
  label: string;
  children?: any;
};

const SettingsItem = ({ label, children }: Props) => (
  <View style={styles.container}>
    <Caption style={styles.label}>{label.toUpperCase()}</Caption>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  label: {
    paddingRight: 10,
    width: 100,
  },
});

export default SettingsItem;
