/* eslint-env detox/detox, jest */

import {
  expectNativePlayerToBeVisible,
  atLeastOneLogIsVisible,
  navigateToPlayground,
  togglePlayPauseVideo,
  TIMEOUT,
} from './utils';

jest.retryTimes(2);

describe('Playground player events', () => {
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

  it('Player notifies about state change', async () => {
    await expectNativePlayerToBeVisible();

    await atLeastOneLogIsVisible('state changed: Playing');

    await togglePlayPauseVideo();

    await atLeastOneLogIsVisible('state changed: Idle');
  });

  it('Player notifies about duration change', async () => {
    await expectNativePlayerToBeVisible();

    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);

    await element(by.id('settingsIcon')).tap();
    await waitFor(element(by.id('urlInput')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('urlInput')).replaceText(
      'https://d6hwdeiig07o4.cloudfront.net/ivs/956482054022/cTo5UpKS07do/2020-07-13T22-54-42.188Z/OgRXMLtq8M11/media/hls/master.m3u8'
    );
    await element(by.id('closeIcon')).tap();

    await atLeastOneLogIsVisible('duration changed: 00:06:02');
  });

  it('Player notifies about quality change', async () => {
    await expectNativePlayerToBeVisible();

    await atLeastOneLogIsVisible('state changed: Playing');

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);

    await element(by.id('settingsIcon')).tap();
    await waitFor(element(by.id('qualitiesPicker')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await waitFor(
      element(by.text('160P').withAncestor(by.id('qualitiesPicker')))
    )
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.text('160P').withAncestor(by.id('qualitiesPicker'))).tap();
    await element(by.id('closeIcon')).tap();

    await atLeastOneLogIsVisible('quality changed: 160p');
  });

  it('Player notifies about resize mode change', async () => {
    await expectNativePlayerToBeVisible();

    await atLeastOneLogIsVisible('state changed: Playing');

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);

    await element(by.id('settingsIcon')).tap();
    await waitFor(element(by.id('resizeModePicker')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await waitFor(
      element(by.text('ASPECT FIT').withAncestor(by.id('resizeModePicker')))
    )
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(
      by.text('ASPECT FIT').withAncestor(by.id('resizeModePicker'))
    ).tap();
    await element(by.id('closeIcon')).tap();

    await atLeastOneLogIsVisible('Resize mode changed: aspectFit');
  });

  it('Player notifies about load after loading recorded video', async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);

    await element(by.id('settingsIcon')).tap();
    await waitFor(element(by.id('urlInput')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('urlInput')).replaceText(
      'https://d6hwdeiig07o4.cloudfront.net/ivs/956482054022/cTo5UpKS07do/2020-07-13T22-54-42.188Z/OgRXMLtq8M11/media/hls/master.m3u8'
    );

    await element(by.id('closeIcon')).tap();

    await waitFor(element(by.text('load started')).atIndex(0))
      .toExist()
      .withTimeout(TIMEOUT);
    await waitFor(element(by.text('load started')).atIndex(1))
      .toExist()
      .withTimeout(TIMEOUT);
  });

  it('Player notifies about load started', async () => {
    await expectNativePlayerToBeVisible();

    await togglePlayPauseVideo();

    await atLeastOneLogIsVisible('load started');
  });

});
