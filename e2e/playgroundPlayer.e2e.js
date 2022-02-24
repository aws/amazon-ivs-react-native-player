/* eslint-env detox/detox, jest */

import {
  expectNativePlayerToBeVisible,
  atLeastOneLogIsVisible,
  navigateToPlayground,
  togglePlayPauseVideo,
} from './utils';

const TIMEOUT = 300000;

jest.setTimeout(1200000);

jest.retryTimes(3);

describe('Playground player', () => {
  beforeAll(async () => {
    await device.launchApp();
    await device.setURLBlacklist([
      '.*',
      '.*video-*',
      '.*player.stats.live-video.net*',
    ]);
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await navigateToPlayground();
  });

  afterAll(async () => {
    await device.sendToHome();
  });

  it('Displays video in Playground Example', async () => {
    await waitFor(element(by.text('PlaygroundExample')))
      .toBeVisible()
      .withTimeout(TIMEOUT);

    await expectNativePlayerToBeVisible();
  });

  it('Player plays live video', async () => {
    await expectNativePlayerToBeVisible();

    await atLeastOneLogIsVisible('state changed: Playing', TIMEOUT);
  });

  it('Player pauses video on pause press', async () => {
    await expectNativePlayerToBeVisible();

    await togglePlayPauseVideo();
    await atLeastOneLogIsVisible('state changed: Idle', TIMEOUT);
  });

  // skipped at the moments since it fails randomly on CI
  // TODO: investigate the problem
  it.skip('Player pauses video using paused prop', async () => {
    await expectNativePlayerToBeVisible();

    await element(by.id('settingsIcon')).tap();
    await element(by.id('paused')).tap();
    await element(by.id('closeIcon')).tap();

    await atLeastOneLogIsVisible('state changed: Idle', TIMEOUT);
  });

  it('Informs about infinite duration for livestreams', async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('durationLabel')))
      .toHaveText('live')
      .withTimeout(TIMEOUT);
  });

  it('Shows real duration for recorded videos', async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toExist()
      .withTimeout(TIMEOUT);

    await element(by.id('settingsIcon')).tap();
    await waitFor(element(by.id('urlInput')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('urlInput')).replaceText(
      'https://d6hwdeiig07o4.cloudfront.net/ivs/956482054022/cTo5UpKS07do/2020-07-13T22-54-42.188Z/OgRXMLtq8M11/media/hls/master.m3u8'
    );
    await element(by.id('closeIcon')).tap();

    await waitFor(element(by.id('durationLabel')))
      .not.toHaveText('live')
      .withTimeout(TIMEOUT);
  });
});
