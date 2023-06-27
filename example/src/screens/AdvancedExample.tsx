import React, { useState, useEffect, useCallback } from 'react';
import { Dimensions, StyleSheet, View, Platform } from 'react-native';
import IVSPlayer, {
  IVSPlayerRef,
  PlayerState,
} from 'amazon-ivs-react-native-player';
import { IconButton, ActivityIndicator, Text } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { parseSecondsToString } from '../helpers';
import type { RootStackParamList } from '../App';
import { Position, URL } from '../constants';

type AdvancedScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdvancedExample'
>;

export default function AdvancedExample() {
  const { setOptions } = useNavigation<AdvancedScreenNavigationProp>();
  const mediaPlayerRef = React.useRef<IVSPlayerRef>(null);
  const [paused, setPaused] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [position, setPosition] = useState<number>();
  const [lockPosition, setLockPosition] = useState(false);
  const [positionSlider, setPositionSlider] = useState(0);
  const [orientation, setOrientation] = useState(Position.PORTRAIT);

  const onDimensionChange = useCallback(
    ({ window: { width, height } }) => {
      if (width < height) {
        setOrientation(Position.PORTRAIT);

        setOptions({ headerShown: true, gestureEnabled: true });
      } else {
        setOrientation(Position.LANDSCAPE);
        setOptions({ headerShown: false, gestureEnabled: false });
      }
    },
    [setOptions]
  );

  useEffect(() => {
    Dimensions.addEventListener('change', onDimensionChange);

    return () => {
      Dimensions.removeEventListener('change', onDimensionChange);
    };
  }, [onDimensionChange]);

  const slidingCompleteHandler = (value: number) => {
    mediaPlayerRef?.current?.seekTo(value);
  };

  useEffect(() => {
    mediaPlayerRef.current?.setOrigin('http://www.example.com');
  }, []);

  const togglePip = () => {
    mediaPlayerRef?.current?.togglePip();
  };

  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        {/*
          Note: A buffering indicator is included by default on Android. It's
          styling is managed in /example/android/app/src/main/res/values/styles.xml
          by adjusting the 'android:indeterminateTint'.
        */}
        {buffering && Platform.OS === 'ios' ? (
          <ActivityIndicator
            animating={true}
            size="large"
            style={styles.loader}
          />
        ) : null}
        <IVSPlayer
          ref={mediaPlayerRef}
          autoplay={false}
          loop
          paused={paused}
          streamUrl={URL}
          onDurationChange={setDuration}
          onRebuffering={() => setBuffering(true)}
          onPlayerStateChange={(state) => {
            if (state === PlayerState.Playing || state === PlayerState.Idle) {
              setBuffering(false);
            }
          }}
          onProgress={(newPosition) => {
            if (!lockPosition) {
              setPosition(newPosition);
              setPositionSlider(newPosition);
            }
          }}
        >
          {orientation === Position.PORTRAIT ? (
            <SafeAreaView style={styles.playButtonContainer}>
              <View style={styles.positionContainer}>
                <View style={styles.durationsContainer}>
                  {duration && position !== null ? (
                    <Text style={styles.positionText} testID="videoPosition">
                      {parseSecondsToString(position ? position : 0)}
                    </Text>
                  ) : (
                    <Text />
                  )}
                  {duration ? (
                    <Text style={styles.positionText}>
                      {parseSecondsToString(duration)}
                    </Text>
                  ) : null}
                </View>
                {duration && !Number.isNaN(duration) ? (
                  <Slider
                    disabled={!duration || duration === Infinity}
                    minimumValue={0}
                    maximumValue={duration === Infinity ? 100 : duration}
                    value={duration === Infinity ? 100 : positionSlider}
                    onValueChange={setPosition}
                    onSlidingComplete={slidingCompleteHandler}
                    onTouchStart={() => setLockPosition(true)}
                    onTouchEnd={() => {
                      setLockPosition(false);
                      setPositionSlider(position ?? 0);
                    }}
                  />
                ) : null}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  flex: 1,
                  width: '100%',
                }}
              >
                <IconButton
                  testID="playPauseButton"
                  accessibilityLabel={paused ? 'play' : 'pause'}
                  icon={paused ? 'play' : 'pause'}
                  size={40}
                  color="white"
                  onPress={() => {
                    setPaused((prev) => !prev);
                  }}
                  style={styles.playIcon}
                />
                <IconButton
                  testID="pipButton"
                  accessibilityLabel="picture-in-picture"
                  icon="picture-in-picture-top-right"
                  size={40}
                  borderless
                  color="white"
                  onPress={() => {
                    togglePip();
                  }}
                  style={styles.pipButton}
                />
              </View>
            </SafeAreaView>
          ) : null}
        </IVSPlayer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: 'black',
  },
  playerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  playButtonContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    width: '100%',
  },
  playIcon: {
    borderWidth: 1,
    borderColor: 'white',
  },
  pipButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  positionContainer: {
    width: '100%',
  },
  durationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    position: 'absolute',
    top: 15,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  positionText: {
    color: 'white',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
  },
});
