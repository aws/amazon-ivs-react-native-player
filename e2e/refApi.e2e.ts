/* eslint-env detox/detox, jest/globals */
import {
  afterAllTestPlan,
  beforeAllTestPlan,
  waitForClearLogs,
  waitForTestPlan,
  waitForLogLabel,
  waitForTap,
} from './testPlan';

describe('Ref Api', () => {
  beforeAll(beforeAllTestPlan);
  afterAll(afterAllTestPlan);

  /*
    - https://3d26876b73d7.us-west-2.playback.live-video.net/api/video/v1/us-west-2.913157848533.channel.rkCBS9iD1eyd.m3u8
    - https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8
    - https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.XFAcAcypUxQm.m3u8
    - https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.YtnrVcQbttF0.m3u8
    - https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.xhP3ExfcX8ON.m3u8
    - https://46074450f652.us-west-2.playback.live-video.net/api/video/v1/us-west-2.385480771703.channel.ajs2EabyQ9fO.m3u8
    - https://d6hwdeiig07o4.cloudfront.net/ivs/956482054022/cTo5UpKS07do/2020-07-13T22-54-42.188Z/OgRXMLtq8M11/media/hls/master.m3u8
  */

  it('preload multiple sources to play', async () => {
    await waitForTestPlan(`
      prefetch:
      - https://3d26876b73d7.us-west-2.playback.live-video.net/api/video/v1/us-west-2.913157848533.channel.rkCBS9iD1eyd.m3u8
      - https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8
      events:
      - onPlayerStateChange
      `);
    await waitForClearLogs();
    await waitForTap(by.id('prefetch:0'));
    await waitForLogLabel('onPlayerStateChange ::: Playing');
    await waitForClearLogs();
    await waitForTap(by.id('prefetch:1'));
    await waitForLogLabel('onPlayerStateChange ::: Playing');
  });
});
