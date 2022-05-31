import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

type Props = {
  onBackground?: () => void;
  onForeground?: () => void;
  onChange?: (status: AppStateStatus) => void;
};

export default function useAppState({
  onChange,
  onForeground,
  onBackground,
}: Props) {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    function handleAppStateChange(nextAppState: AppStateStatus) {
      if (nextAppState === 'active' && appState !== 'active') {
        onForeground?.();
      } else if (
        appState === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        onBackground?.();
      }
      setAppState(nextAppState);
      onChange?.(nextAppState);
    }
    const state = AppState.addEventListener('change', handleAppStateChange);

    return () => state.remove();
  }, [onChange, onForeground, onBackground, appState]);

  return { appState };
}
