/* eslint-env detox/detox, jest */

import { expectNativePlayerToBeVisible } from './utils';

jest.retryTimes(3);

describe('Simple player', () => {
  beforeAll(async () => {
    await device.launchApp();
    await device.setURLBlacklist([
      '.*video-*',
      '.*player.stats.live-video.net*',
    ]);
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  afterAll(async () => {
    await device.sendToHome();
  });

  it('Display video', async () => {
    await element(by.id('Simple')).tap();
    await waitFor(element(by.text('SimpleExample')))
      .toBeVisible()
      .withTimeout(12000);

    await expectNativePlayerToBeVisible();
  });
});
