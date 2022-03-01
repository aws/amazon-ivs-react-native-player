/* eslint-env detox/detox, jest */

import { expectNativePlayerToBeVisible, togglePlayPauseVideo } from './utils';

jest.retryTimes(3);

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
    await waitFor(element(by.id('Advanced')))
      .toBeVisible()
      .withTimeout(20000);
    await element(by.id('Advanced')).tap();
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

    await waitFor(element(by.id('playPauseButton').and(by.label('play'))))
      .toBeVisible()
      .withTimeout(20000);

    await togglePlayPauseVideo();

    await waitFor(element(by.id('playPauseButton').and(by.label('pause'))))
      .toBeVisible()
      .withTimeout(20000);
  });
});
