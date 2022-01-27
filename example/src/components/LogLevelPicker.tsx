import * as React from 'react';
import { Button } from 'react-native-paper';
import { LogLevel } from 'amazon-ivs-react-native-player';
import { StyleSheet, View } from 'react-native';

type Props = {
  logLevel: LogLevel;
  setLogLevel: (logLevel: LogLevel) => void;
};

const LogLevelPicker = ({ logLevel, setLogLevel }: Props) => (
  <View style={styles.container}>
    <Button
      style={styles.button}
      mode={logLevel === LogLevel.IVSLogLevelDebug ? 'contained' : 'outlined'}
      compact
      onPress={() => setLogLevel(LogLevel.IVSLogLevelDebug)}
    >
      Debug
    </Button>
    <Button
      style={styles.button}
      mode={logLevel === LogLevel.IVSLogLevelInfo ? 'contained' : 'outlined'}
      compact
      onPress={() => setLogLevel(LogLevel.IVSLogLevelInfo)}
    >
      Info
    </Button>
    <Button
      style={styles.button}
      mode={logLevel === LogLevel.IVSLogLevelWarning ? 'contained' : 'outlined'}
      compact
      onPress={() => setLogLevel(LogLevel.IVSLogLevelWarning)}
    >
      Warning
    </Button>
    <Button
      style={styles.button}
      mode={logLevel === LogLevel.IVSLogLevelError ? 'contained' : 'outlined'}
      compact
      onPress={() => setLogLevel(LogLevel.IVSLogLevelError)}
    >
      Error
    </Button>
  </View>
);

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

export default LogLevelPicker;
