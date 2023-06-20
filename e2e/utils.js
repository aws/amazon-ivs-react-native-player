/* eslint-env detox/detox, jest */

export const TIMEOUT = 30000;

export const expectNativePlayerToBeVisible = async () => {
  await waitFor(
    element(
      by.type(
        device.getPlatform() === 'ios'
          ? 'IVSPlayerView'
          : 'com.amazonaws.ivs.player.PlayerView'
      )
    )
  )
    .toBeVisible()
    .withTimeout(240000);
};

export const atLeastOneLogIsVisible = async (text, timeout) => {
  try {
    await waitFor(element(by.label(text)))
      .toExist()
      .withTimeout(timeout);
  } catch (e) {
    await waitFor(element(by.label(text)).atIndex(0))
      .toExist()
      .withTimeout(timeout);
  }
};

export const navigateToPlayground = async () => {
  await waitFor(element(by.id('Playground')))
    .toBeVisible()
    .withTimeout(32000);
  await element(by.id('Playground')).tap();

  await waitFor(element(by.text('PlaygroundExample')))
    .toBeVisible()
    .withTimeout(24000);
};

export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const waitToBeVisible = async (match) => {
  await waitFor(element(match))
    .toBeVisible(100)
    .withTimeout(TIMEOUT);
};

export const waitToBeVisibleAndTap = async (match) => {
  await waitToBeVisible(match);
  await element(match).tap();
};

export const togglePlayPauseVideo = async () => {
  await waitForElementToBeVisibleAndTap(by.id('playPauseButton'));
};

export const scrollToModalBottom = async (scrollDown = 500) => {
  await element(by.id('modalScrollView')).scroll(scrollDown, 'down');
  // wait for anim to finish ??
  await sleep(1000);
};