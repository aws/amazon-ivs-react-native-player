/* eslint-env detox/detox, jest */

export const TIMEOUT = 32000;

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
    .withTimeout(TIMEOUT);
};

export const atLeastOneLogIsVisible = async (text) => {
  try {
    await waitFor(element(by.label(text)))
      .toExist()
      .withTimeout(TIMEOUT);
  } catch (e) {
    await waitFor(element(by.label(text)).atIndex(0))
      .toExist()
      .withTimeout(TIMEOUT);
  }
};

export const navigateToPlayground = async () => {
  await waitFor(element(by.id('Playground')))
    .toBeVisible()
    .withTimeout(TIMEOUT);
  await element(by.id('Playground')).tap();

  await waitFor(element(by.text('PlaygroundExample')))
    .toBeVisible()
    .withTimeout(TIMEOUT);
};

export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const waitToBeVisible = async (match) => {
  try {
    await waitFor(element(match))
    .toBeVisible(100)
    .withTimeout(TIMEOUT);
  } catch (e) {
    // no-op
  }
};

export const waitToBeVisibleAndTap = async (match) => {
  await waitToBeVisible(match);
  await element(match).tap();
};

export const togglePlayPauseVideo = async () => {
  await waitToBeVisibleAndTap(by.id('playPauseButton'));
};

export const scrollToModalBottom = async (scrollDown = 500) => {
  await element(by.id('modalScrollView')).scroll(scrollDown, 'down');
};