import * as React from 'react';
import { Button } from 'react-native-paper';
import { LogLevel } from 'react-native-amazon-ivs';

type Props = {
  logLevel: LogLevel;
  setLogLevel: (logLevel: LogLevel) => void;
};

const LogLevelPicker = ({ logLevel, setLogLevel }: Props) => (
  <>
    <Button
      mode={logLevel === LogLevel.IVSLogLevelDebug ? 'contained' : 'outlined'}
      compact
      onPress={() => setLogLevel(LogLevel.IVSLogLevelDebug)}
    >
      Debug
    </Button>
    <Button
      mode={logLevel === LogLevel.IVSLogLevelInfo ? 'contained' : 'outlined'}
      compact
      onPress={() => setLogLevel(LogLevel.IVSLogLevelInfo)}
    >
      Info
    </Button>
    <Button
      mode={logLevel === LogLevel.IVSLogLevelWarning ? 'contained' : 'outlined'}
      compact
      onPress={() => setLogLevel(LogLevel.IVSLogLevelWarning)}
    >
      Warning
    </Button>
    <Button
      mode={logLevel === LogLevel.IVSLogLevelError ? 'contained' : 'outlined'}
      compact
      onPress={() => setLogLevel(LogLevel.IVSLogLevelError)}
    >
      Error
    </Button>
  </>
);

export default LogLevelPicker;
