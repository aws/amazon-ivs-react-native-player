import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Platform, UIManager } from 'react-native';
import type { IVSPlayerRef } from '../types';

import IVSPlayer from '../IVSPlayer';

const URL =
  'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.UIManager.getViewManagerConfig = (name: string) => {
    if (name === 'AmazonIvs') {
      return {
        Commands: {
          play: 1,
          pause: 2,
          seekTo: 3,
          setOrigin: 4,
          togglePip: undefined,
        },
      };
    }
    return {};
  };

  return RN;
});

const testCallbackPassing = async (
  name: string,
  nativeEvent?: any,
  result?: any
) => {
  const mockFn = jest.fn();

  const { findByTestId } = render(
    <IVSPlayer streamUrl={URL} {...{ [name]: mockFn }} />
  );
  const nativePlayer = await findByTestId('IVSPlayer');

  fireEvent(
    nativePlayer,
    name,
    nativeEvent
      ? {
          nativeEvent,
        }
      : undefined
  );
  expect(mockFn).toHaveBeenCalledWith(result);
};

test('Renders the native component', async () => {
  const { findByTestId } = render(<IVSPlayer />);
  const nativePlayer = await findByTestId('IVSPlayer');

  expect(nativePlayer).toBeDefined();
});

test('Passing onDurationChange down works correctly', async () => {
  await testCallbackPassing('onDurationChange', { duration: 1 }, 1);
});

test('Passing onSeek down works correctly', async () => {
  await testCallbackPassing('onSeek', { position: 1 }, 1);
});

test('Passing onData down works correctly', async () => {
  await testCallbackPassing(
    'onData',
    { playerData: { sessionId: 1 } },
    { sessionId: 1 }
  );
});

test('Passing onVideoStatistics down works correctly', async () => {
  await testCallbackPassing(
    'onVideoStatistics',
    { videoData: { duration: 1 } },
    { duration: 1 }
  );
});

test('Passing onPlayerStateChange down works correctly', async () => {
  await testCallbackPassing('onPlayerStateChange', { state: 1 }, 1);
});

test('Passing onQualityChange down works correctly', async () => {
  await testCallbackPassing(
    'onQualityChange',
    { quality: { bitrate: 1 } },
    { bitrate: 1 }
  );
});

test('Passing onPipChange down works correctly with boolean', async () => {
  await testCallbackPassing('onPipChange', { active: true }, true);
});

test('Passing onPipChange down works correctly with string', async () => {
  await testCallbackPassing('onPipChange', { active: 'true' }, true);
});

test('Passing onRebuffering down works correctly', async () => {
  await testCallbackPassing('onRebuffering');
});

test('Passing onLoadStart down works correctly', async () => {
  await testCallbackPassing('onLoadStart');
});

test('Passing onLoad down works correctly', async () => {
  await testCallbackPassing('onLoad', { duration: 1 }, 1);
});

test('Passing onLiveLatencyChange down works correctly', async () => {
  await testCallbackPassing('onLiveLatencyChange', { liveLatency: 1 }, 1);
});

test('Passing onTextCue down works correctly', async () => {
  await testCallbackPassing(
    'onTextCue',
    { textCue: { text: 'text' } },
    { text: 'text' }
  );
});

test('Passing onTextMetadataCue down works correctly', async () => {
  await testCallbackPassing(
    'onTextMetadataCue',
    { textMetadataCue: { text: 'text' } },
    { text: 'text' }
  );
});

test('Passing onProgress down works correctly', async () => {
  await testCallbackPassing('onProgress', { position: 1 }, 1);
});

test('Passing onError down works correctly', async () => {
  await testCallbackPassing('onError', { error: 'err' }, 'err');
});

test('Passing onTimePoint down works correctly', async () => {
  await testCallbackPassing('onTimePoint', { position: 1 }, 1);
});

test('Player will autoplay without any props', async () => {
  const mockCommandFn = jest.fn();
  UIManager.dispatchViewManagerCommand = mockCommandFn;

  render(<IVSPlayer streamUrl={URL} />);

  expect(mockCommandFn).toHaveBeenCalled();

  // Checking if the second argument of the function is the "play" command
  expect(mockCommandFn.mock.calls[0][1]).toEqual(1);
});

test('Paused set to false wont play the video', async () => {
  const mockCommandFn = jest.fn();
  UIManager.dispatchViewManagerCommand = mockCommandFn;

  render(<IVSPlayer streamUrl={URL} paused />);

  expect(mockCommandFn).toHaveBeenCalled();

  // Checking if the second argument of the function is the "pause" command
  expect(mockCommandFn.mock.calls[0][1]).toEqual(2);
});

test('Using pause on ref calls pause on native component', async () => {
  const mockCommandFn = jest.fn();
  const ref = React.createRef<IVSPlayerRef>();

  render(<IVSPlayer streamUrl={URL} ref={ref} />);

  UIManager.dispatchViewManagerCommand = mockCommandFn;
  ref.current?.pause();

  expect(mockCommandFn).toHaveBeenCalled();

  // Checking if the second argument of the function is the "pause" command
  expect(mockCommandFn.mock.calls[0][1]).toEqual(2);
});

test('Using play on ref calls play on native component', async () => {
  const mockCommandFn = jest.fn();
  const ref = React.createRef<IVSPlayerRef>();

  render(<IVSPlayer streamUrl={URL} ref={ref} />);

  UIManager.dispatchViewManagerCommand = mockCommandFn;
  ref.current?.pause();
  ref.current?.play();

  expect(mockCommandFn).toHaveBeenCalledTimes(2);

  // Checking if the second argument of the function is the "play" command
  expect(mockCommandFn.mock.calls[1][1]).toEqual(1);
});

test('Using seekTo on ref calls seekTo on native component', async () => {
  const mockCommandFn = jest.fn();
  const ref = React.createRef<IVSPlayerRef>();

  render(<IVSPlayer streamUrl={URL} ref={ref} />);

  UIManager.dispatchViewManagerCommand = mockCommandFn;
  ref.current?.seekTo(10);

  expect(mockCommandFn).toHaveBeenCalled();

  // Checking if the second argument of the function is the "play" command
  expect(mockCommandFn.mock.calls[0][1]).toEqual(3);

  // Checking if the value we pass down is proper
  expect(mockCommandFn.mock.calls[0][2]).toEqual([10]);
});

test('Using togglePip on ref calls togglePip on native component', async () => {
  const mockCommandFn = jest.fn();
  const ref = React.createRef<IVSPlayerRef>();

  render(<IVSPlayer streamUrl={URL} ref={ref} />);

  UIManager.dispatchViewManagerCommand = mockCommandFn;
  ref.current?.togglePip();

  expect(mockCommandFn).toHaveBeenCalled();
  ref.current?.togglePip();
  expect(mockCommandFn).toHaveBeenCalledTimes(2);
});

test('Using setOrigin on ref calls setOrigin on native component', async () => {
  const mockCommandFn = jest.fn();
  const ref = React.createRef<IVSPlayerRef>();

  render(<IVSPlayer streamUrl={URL} ref={ref} />);

  UIManager.dispatchViewManagerCommand = mockCommandFn;
  ref.current?.setOrigin('Access-Control-Allow-Origin');
});

test('Autoplay when onLoad', async () => {
  const mockCommandFn = jest.fn();
  Platform.OS = 'android';

  const { findByTestId } = render(<IVSPlayer streamUrl={URL} />);
  UIManager.dispatchViewManagerCommand = mockCommandFn;
  const nativePlayer = await findByTestId('IVSPlayer');
  fireEvent(nativePlayer, 'onLoad', { nativeEvent: { duration: 10 } });

  expect(mockCommandFn).toHaveBeenCalled();

  // Checking if the second argument of the function is the "play" command
  expect(mockCommandFn.mock.calls[0][1]).toEqual(1);
});
