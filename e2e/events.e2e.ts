/* eslint-env detox/detox, jest/globals */
import {
  afterAllTestPlan,
  beforeAllTestPlan,
  waitForTestPlan,
  waitForReplaceText,
  waitForTap,
  waitForLogID,
  waitForLogLabel,
} from './testPlan';

describe('Events', () => {
  beforeAll(beforeAllTestPlan);
  afterAll(afterAllTestPlan);

  it('player raises a seek event', async () => {
    await waitForTestPlan(`
      inputs:
      - seekTo
      events:
      - onSeek
      - onPlayerStateChange
      `);
    await waitForLogLabel('onPlayerStateChange ::: Playing');
    await waitForReplaceText(by.id('seekTo:0'), 1);
    await waitForTap(by.id('seekTo'));
    await waitForLogLabel('onSeek ::: 1', 32);
  });

  it('player raises a video statistics event', async () => {
    await waitForTestPlan(`
      events:
      - onVideoStatistics
      `);
    await waitForLogID('onVideoStatistics');
  });

  it('player raises a player state change event', async () => {
    await waitForTestPlan(`
      events:
      - onPlayerStateChange
      `);
    await waitForLogLabel('onPlayerStateChange ::: Playing');
  });

  it('player raises a duration change event', async () => {
    await waitForTestPlan(`
      url: https://d6hwdeiig07o4.cloudfront.net/ivs/956482054022/cTo5UpKS07do/2020-07-13T22-54-42.188Z/OgRXMLtq8M11/media/hls/master.m3u8
      events:
      - onDurationChange
      `);
    await waitForLogID('onDurationChange');
  });

  it('player raises a quality change event', async () => {
    await waitForTestPlan(`
      events:
      - onQualityChange
      `);
    await waitForLogID('onQualityChange');
  });

  // it('player raises a pip change event', async () => {
  //   await setupTestPlan(`
  //     events:
  //     - onPipChange
  //     `);
  //   await waitForLogID('onPipChange');
  // });

  // it('player raises a rebuffering event', async () => {
  //   await setupTestPlan(`
  //     events:
  //     - onRebuffering
  //     `);
  //   await waitForLogID('onRebuffering');
  // });

  it('player raises a load start event', async () => {
    await waitForTestPlan(`
      inputs:
      - paused: true
      events:
      - onLoadStart
      `);
    await waitForTap(by.id('paused'));
    await waitForLogID('onLoadStart');
  });

  it('player raises a load event', async () => {
    await waitForTestPlan(`
      inputs:
      - paused: true
      events:
      - onLoad
      `);
    await waitForTap(by.id('paused'));
    await waitForLogID('onLoad');
  });

  it('player raises a live latency change event', async () => {
    await waitForTestPlan(`
      events:
      - onLiveLatencyChange
      `);
    await waitForLogID('onLiveLatencyChange');
  });

  it('player raises a text cue event', async () => {
    await waitForTestPlan(`
      url: https://d6hwdeiig07o4.cloudfront.net/ivs/956482054022/cTo5UpKS07do/2020-07-13T22-54-42.188Z/OgRXMLtq8M11/media/hls/master.m3u8
      events:
      - onTextCue
      `);
    await waitForLogID('onTextCue', 32);
  });

  it('player raises a text metadata cue event', async () => {
    await waitForTestPlan(`
      url: https://4c62a87c1810.us-west-2.playback.live-video.net/api/video/v1/us-west-2.049054135175.channel.GHRwjPylmdXm.m3u8
      events:
      - onTextMetadataCue
      `);
    await waitForLogID('onTextMetadataCue', 32);
  });

  it('player raises a progress event', async () => {
    await waitForTestPlan(`
      events:
      - onProgress
      `);
    await waitForLogID('onProgress');
  });

  it('player raises an error event when given a bad uri to load', async () => {
    await waitForTestPlan(`
      url: baduri
      events:
      - onError
      `);
    await waitForLogID('onError');
  });

  // it('player raises a time point event', async () => {
  //   await setupTestPlan(`
  //     url: https://d6hwdeiig07o4.cloudfront.net/ivs/956482054022/cTo5UpKS07do/2020-07-13T22-54-42.188Z/OgRXMLtq8M11/media/hls/master.m3u8
  //     events:
  //     - onTimePoint
  //     `);
  //   await waitForEvent('onTimePoint');
  // });
});
