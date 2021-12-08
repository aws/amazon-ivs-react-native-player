import {
  atLeastOneLogIsVisible,
  expectNativePlayerToBeVisible,
  togglePlayPauseVideo,
} from './utils';

const TIMEOUT = 300000;

describe('Advanced player', () => {
  beforeAll(async () => {
    await device.launchApp();
    await device.setURLBlacklist([
      '.*video-*',
      '.*player.stats.live-video.net*',
    ]);
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    waitFor(element(by.id('Advanced')))
      .toBeVisible()
      .withTimeout(20000);
    const button = element(by.id('Advanced'));
    await button.tap();
  });

  afterAll(async () => {
    await device.sendToHome();
  });

  it('Displays video in Advanced Example', async () => {
    await waitFor(element(by.text('AdvancedExample')))
      .toBeVisible()
      .withTimeout(20000);

    await expectNativePlayerToBeVisible();
  });

  it('Informs about infinite duration for livestreams', async () => {
    await expectNativePlayerToBeVisible();

    await waitFor(element(by.text('live')))
      .toBeVisible()
      .withTimeout(20000);
  });

  it('Player plays video on play press', async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await atLeastOneLogIsVisible('state changed: Playing', TIMEOUT);
  });
});
