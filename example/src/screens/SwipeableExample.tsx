import * as React from 'react';
import { RefObject, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  GestureHandlerRootView,
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';
import { Card, Paragraph, Text } from 'react-native-paper';
import IVSPlayer, {
  IVSPlayerRef,
  Source,
} from 'amazon-ivs-react-native-player';

// Test content to cycle through
const videos: Array<string> = [
  'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.XFAcAcypUxQm.m3u8',
  'https://46074450f652.us-west-2.playback.live-video.net/api/video/v1/us-west-2.385480771703.channel.ajs2EabyQ9fO.m3u8',
  'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.XFAcAcypUxQm.m3u8',
  'https://46074450f652.us-west-2.playback.live-video.net/api/video/v1/us-west-2.385480771703.channel.ajs2EabyQ9fO.m3u8',
  'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.XFAcAcypUxQm.m3u8',
];

export default function SwipeableExample() {
  return <SwipeableVideo videos={videos} />;
}

type SwipeableVideoProps = {
  videos: Array<string>;
};

const SwipeableVideo = (props: SwipeableVideoProps) => {
  const [prevIndex, setPrevIndex] = useState(-1);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loadingIndex, setLoadingIndex] = useState(-1);

  const playerRef = useRef<IVSPlayerRef>(null);
  const prevSource = useRef<Source | undefined>();
  const currentSource = useRef<Source | undefined>();
  const nextSource = useRef<Source | undefined>();

  const calcPrevIndex = (index: number) => {
    return index === 0 ? props.videos.length - 1 : index - 1;
  };
  const calcNextIndex = (index: number) => {
    return index === props.videos.length - 1 ? 0 : index + 1;
  };

  const onSwipe = (
    event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    const { translationX, state } = event.nativeEvent;

    if (state === State.END) {
      // Swiped from the right
      if (translationX < 0) {
        loadSource(calcNextIndex(currentIndex));

        // Swiped from the left
      } else {
        // For demo app purposes, only allow swiping right
        console.warn(
          "[onSwipe] the demo doesn't allow navigating to previous videos"
        );
      }
    }
  };

  // For test purposes, always cache bust
  const cacheBust = (url: string): string => {
    const delim = url.indexOf('?') === -1 ? '?' : '&';

    return `${url}${delim}cb=${Date.now()}`;
  };

  const loadSource = (indexToLoad: number) => {
    if (playerRef.current === null) {
      return;
    }
    const player = playerRef.current;

    console.log('\n[loadSource] playing index:', indexToLoad);

    let lastIndex = -1;
    if (currentSource.current !== undefined) {
      // previousSource?.release();
      console.log('\treusing currentSource, assigning to prevSource');

      // Example of how to discard a source we no longer intend to use
      const prevSourceInstance = prevSource.current;
      if (prevSourceInstance !== undefined) {
        console.log(
          "\t\treleasing old prevSource, as we don't intend to use it again"
        );
        player.releaseSource(prevSourceInstance);
      }

      prevSource.current = currentSource.current;
      lastIndex = calcPrevIndex(indexToLoad);
    }

    if (nextSource.current !== undefined) {
      console.log('\treusing nextSource, assigning to currentSource');
      currentSource.current = nextSource.current;
    } else {
      const url = cacheBust(props.videos[indexToLoad]);
      console.log('\tloading new currentSource', url);
      currentSource.current = player.preload(url);
    }

    player.loadSource(currentSource.current);

    const nextIndex = calcNextIndex(indexToLoad);
    const nextUrl = cacheBust(props.videos[nextIndex]);
    console.log('\tloading new nextSource', nextUrl);
    // Preload the next source
    nextSource.current = player.preload(nextUrl);

    console.log('\tcurrent indexes:');
    console.log('\t\tprevIndex:', lastIndex);
    console.log('\t\tcurrentIndex:', indexToLoad);
    console.log('\t\tnextIndex:', nextIndex);

    setPrevIndex(lastIndex);
    setCurrentIndex(indexToLoad);
    setLoadingIndex(nextIndex);
  };

  useEffect(() => {
    // On mount, load the first source
    loadSource(0);

    // On unmount, release any remaining sources
    () => {
      if (playerRef.current === null) {
        return;
      }
      const player = playerRef.current;

      [prevSource.current, currentSource.current, nextSource.current].forEach(
        (source: Source | undefined) => {
          if (source !== undefined) {
            player.releaseSource(source);
          }
        }
      );
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        onHandlerStateChange={onSwipe}
        activeOffsetX={[-10, 10]}
      >
        <View>
          <View
            style={{ width: '100%', height: '70%', backgroundColor: 'black' }}
          >
            <IVSPlayerContainer playerRef={playerRef} />
          </View>
          <Card testID="Simple" style={{}}>
            <Card.Title title="Preload sources, status" />
            <Card.Content style={{ marginLeft: 10, marginTop: -10 }}>
              <View style={styles.controlsRow}>
                <Text style={styles.textShadow}>Loaded video:</Text>
                <Text style={{ marginLeft: 2, textAlign: 'right' }}>
                  #{prevIndex + 1}
                </Text>
              </View>
              <View style={styles.controlsRow}>
                <Text style={styles.textShadow}>Playing video:</Text>
                <Text style={styles.controlsRow}>#{currentIndex + 1}</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={styles.textShadow}>Loading video:</Text>
                <Text style={styles.controlsRow}>#{loadingIndex + 1}</Text>
              </View>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Paragraph>
                Swipe from right-to-left to go to the next video. The next video
                will automatically preload when the first starts playing.
              </Paragraph>
            </Card.Content>
          </Card>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

type IVSPlayerContainerProps = {
  playerRef: RefObject<IVSPlayerRef>;
};

const IVSPlayerContainer = (props: IVSPlayerContainerProps) => {
  return <IVSPlayer ref={props.playerRef} muted={true} testID="IVSPlayer" />;
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },

  controlsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textShadow: {
    fontSize: 14,
    color: ' #FFFFFF',
    paddingLeft: 20,
    paddingRight: 20,
    textShadowColor: '#585858',
    textShadowOffset: {
      width: 10,
      height: 10,
    },
    textShadowRadius: 20,

    marginBottom: 2,
  },
});
