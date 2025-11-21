import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { UIManager } from 'react-native';
import type { IVSPlayerRef } from '../types';

import IVSPlayer from '../IVSPlayer';

const URL =
  'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8';

jest.mocked(UIManager.getViewManagerConfig).mockImplementation((name) => {
  if (name === 'AmazonIvs') {
    return {
      Commands: {
        play: 'play',
        pause: 'pause',
        seekTo: 'seekTo',
        setOrigin: 'setOrigin',
        togglePip: 'togglePip',
      },
    };
  }
  return { Commands: {} };
});

let mockCommandFn: jest.SpyInstance;

beforeEach(() => {
  mockCommandFn = jest.spyOn(UIManager, 'dispatchViewManagerCommand');
  mockCommandFn.mockImplementation(() => {});
});

afterEach(() => {
  mockCommandFn.mockRestore();
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

test('Passing onTimePoint down works correctly', () => {
  void testCallbackPassing('onTimePoint', { position: 1 }, 1);
});

test('Player will autoplay without any props', () => {
  render(<IVSPlayer streamUrl={URL} />);

  expect(mockCommandFn).toHaveBeenCalled();

  // Checking if the second argument of the function is the "play" command
  expect(mockCommandFn.mock.calls[0][1]).toEqual('play');
});

test('Paused set to false wont play the video', () => {
  render(<IVSPlayer streamUrl={URL} paused />);

  expect(mockCommandFn).toHaveBeenCalled();

  // Checking if the second argument of the function is the "pause" command
  expect(mockCommandFn.mock.calls[0][1]).toEqual('pause');
});

test('Using pause on ref calls pause on native component', () => {
  const ref = React.createRef<IVSPlayerRef>();

  render(<IVSPlayer streamUrl={URL} ref={ref} />);

  ref.current?.pause();
  expect(mockCommandFn).toHaveBeenCalled();

  // Checking if the second argument of the function is the "pause" command
  expect(mockCommandFn.mock.calls[1][1]).toEqual('pause');
});

test('Using play on ref calls play on native component', () => {
  const ref = React.createRef<IVSPlayerRef>();

  render(<IVSPlayer streamUrl={URL} ref={ref} />);

  ref.current?.pause();
  ref.current?.play();

  expect(mockCommandFn).toHaveBeenCalledTimes(3);
  // Checking if the third argument of the function is the "play" command
  // autoplay -> pause -> play
  expect(mockCommandFn.mock.calls[2][1]).toEqual('play');
});

test('Using seekTo on ref calls seekTo on native component', () => {
  const ref = React.createRef<IVSPlayerRef>();

  render(<IVSPlayer streamUrl={URL} ref={ref} autoplay={false} />);

  ref.current?.seekTo(10);

  expect(mockCommandFn).toHaveBeenCalled();

  // Checking if the second argument of the function is the "play" command
  expect(mockCommandFn.mock.calls[0][1]).toEqual('seekTo');

  // Checking if the value we pass down is proper
  expect(mockCommandFn.mock.calls[0][2]).toEqual([10]);
});

test('Using togglePip on ref calls togglePip on native component', async () => {
  const ref = React.createRef<IVSPlayerRef>();

  render(<IVSPlayer streamUrl={URL} ref={ref} autoplay={false} />);

  ref.current?.togglePip();

  expect(mockCommandFn).toHaveBeenCalled();
  ref.current?.togglePip();
  expect(mockCommandFn).toHaveBeenCalledTimes(2);
});

test('Using setOrigin on ref calls setOrigin on native component', () => {
  const ref = React.createRef<IVSPlayerRef>();

  render(<IVSPlayer streamUrl={URL} ref={ref} autoplay={false} />);

  ref.current?.setOrigin('Access-Control-Allow-Origin');
  expect(mockCommandFn).toHaveBeenCalled();
});

test('Autoplay when onLoad', async () => {
  const { findByTestId } = render(<IVSPlayer streamUrl={URL} />);
  const nativePlayer = await findByTestId('IVSPlayer');

  // Now fire the event
  fireEvent(nativePlayer, 'onLoad', { nativeEvent: { duration: 10 } });

  expect(mockCommandFn).toHaveBeenCalled();

  // Checking if the second argument of the function is the "play" command
  expect(mockCommandFn.mock.calls[0][1]).toEqual('play');
});
