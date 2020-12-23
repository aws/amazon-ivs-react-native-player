import * as React from 'react';
import { Provider, DefaultTheme } from 'react-native-paper';
import PlayerPlaygroundScreen from './PlayerPlaygroundScreen';

export const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

export default function App() {
  return (
    <Provider theme={theme}>
      <PlayerPlaygroundScreen />
    </Provider>
  );
}
