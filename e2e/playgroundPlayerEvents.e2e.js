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

    await atLeastOneLogIsVisible('state changed: Playing', TIMEOUT);

    await togglePlayPauseVideo();

    await atLeastOneLogIsVisible('state changed: Idle', TIMEOUT);
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

    await atLeastOneLogIsVisible('duration changed: 00:06:02', TIMEOUT);
  });

  it('Player notifies about quality change', async () => {
    await expectNativePlayerToBeVisible();

    await atLeastOneLogIsVisible('state changed: Playing', TIMEOUT);

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

    await atLeastOneLogIsVisible('quality changed: 160p', TIMEOUT);
  });

  it('Player notifies about resize mode change', async () => {
    await expectNativePlayerToBeVisible();

    await atLeastOneLogIsVisible('state changed: Playing', TIMEOUT);

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

    await atLeastOneLogIsVisible('Resize mode changed: aspectFit', TIMEOUT);
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

    await atLeastOneLogIsVisible('load started', TIMEOUT);
  });

  it("Player doesn't crash after setting auto quality", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await waitFor(element(by.id('qualitiesPicker')))
      .toBeVisible()
      .whileElement(by.id('modalScrollView'))
      .scroll(50, 'down');
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
    await waitFor(element(by.id('muted')))
      .toBeVisible()
      .whileElement(by.id('modalScrollView'))
      .scroll(50, 'down');
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
    await waitFor(element(by.id('autoplay')))
      .toBeVisible()
      .whileElement(by.id('modalScrollView'))
      .scroll(50, 'down');
    await element(by.id('autoplay')).tap();
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });

  it("Player doesn't crash after changing paused property", async () => {
    await expectNativePlayerToBeVisible();
    await togglePlayPauseVideo();

    await waitFor(element(by.id('settingsIcon')))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id('settingsIcon')).tap();
    await waitFor(element(by.id('paused')))
      .toBeVisible()
      .whileElement(by.id('modalScrollView'))
      .scroll(50, 'down');
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
    await waitFor(element(by.id('liveLowLatency')))
      .toBeVisible()
      .whileElement(by.id('modalScrollView'))
      .scroll(50, 'down');
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
    await waitFor(element(by.id('autoQuality')))
      .toBeVisible()
      .whileElement(by.id('modalScrollView'))
      .scroll(50, 'down');
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
    await waitFor(element(by.id('logLevelPicker')))
      .toBeVisible()
      .whileElement(by.id('modalScrollView'))
      .scroll(150, 'down');
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
    await waitFor(element(by.id('autoMaxQualityPicker')))
      .toBeVisible()
      .whileElement(by.id('modalScrollView'))
      .scroll(150, 'down');
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
    await waitFor(element(by.id('playbackRate')))
      .toBeVisible()
      .whileElement(by.id('modalScrollView'))
      .scroll(50, 'down');
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
    await waitFor(element(by.id('progressInterval')))
      .toBeVisible()
      .whileElement(by.id('modalScrollView'))
      .scroll(50, 'down');
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
    await waitFor(element(by.id('volume')))
      .toBeVisible()
      .whileElement(by.id('modalScrollView'))
      .scroll(50, 'down');
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
    await waitFor(element(by.id('initialBufferDuration')))
      .toBeVisible()
      .whileElement(by.id('modalScrollView'))
      .scroll(50, 'down');
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
    await waitFor(element(by.id('pauseInBackground')))
      .toBeVisible()
      .whileElement(by.id('modalScrollView'))
      .scroll(50, 'down');
    await element(by.id('pauseInBackground')).tap();
    await element(by.id('closeIcon')).tap();

    await expectNativePlayerToBeVisible(); // Not a crash
  });
});
