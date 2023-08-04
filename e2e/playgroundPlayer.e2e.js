/* eslint-env detox/detox, jest */

import {
  expectNativePlayerToBeVisible,
  atLeastOneLogIsVisible,
  waitToBeVisibleAndTap,
  navigateToPlayground,
  togglePlayPauseVideo,
  scrollToModalBottom,
  TIMEOUT,
  sleep,
} from './utils';

jest.retryTimes(2);

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

  it("Player doesn't crash after setting auto quality", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await element(by.text('720P').withAncestor(by.id('qualitiesPicker'))).tap();
    await element(by.text('AUTO').withAncestor(by.id('qualitiesPicker'))).tap();
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });

  it("Player doesn't crash after changing muted property", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await scrollToModalBottom(100);
    await element(by.id('muted')).tap();
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });

  it("Player doesn't crash after changing autoplay property", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await scrollToModalBottom(100);
    await waitToBeVisibleAndTap(by.id('autoplay'));
    await waitToBeVisibleAndTap(by.id('closeIcon'));

    await expectNativePlayerToBeVisible(); // Not a crash
  });

  it("Player doesn't crash after changing paused property", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await scrollToModalBottom();
    await element(by.id('paused')).tap();
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });

  it("Player doesn't crash after changing liveLowLatency property", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await scrollToModalBottom();
    await element(by.id('liveLowLatency')).tap();
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });

  it("Player doesn't crash after changing autoQuality property", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await scrollToModalBottom();
    await element(by.id('autoQuality')).tap();
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });

  it("Player doesn't crash after changing log level", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await scrollToModalBottom();
    await element(by.text('DEBUG').withAncestor(by.id('logLevelPicker'))).tap();
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });

  it("Player doesn't crash after changing autoMaxQuality", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await scrollToModalBottom();
    await element(
      by.text('720P').withAncestor(by.id('autoMaxQualityPicker'))
    ).tap();
    await element(
      by.text('AUTO').withAncestor(by.id('autoMaxQualityPicker'))
    ).tap();
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });

  it("Player doesn't crash after changing playback rate", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    // await scrollToModalBottom();
    await element(by.id('playbackRate')).replaceText('2');
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });

  it("Player doesn't crash after changing progress interval", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await scrollToModalBottom(100);
    await element(by.id('progressInterval')).replaceText('1');
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });

  it("Player doesn't crash after changing volume", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await scrollToModalBottom();
    await element(by.id('volume')).replaceText('0.5');
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });

  it("Player doesn't crash after changing initialBufferDuration", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await scrollToModalBottom()
    await element(by.id('initialBufferDuration')).replaceText('4.0');
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });

  it("Player doesn't crash after changing pauseInBackground", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await scrollToModalBottom();
    await element(by.id('pauseInBackground')).tap();
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });  
});
