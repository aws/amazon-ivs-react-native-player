/* eslint-env detox/detox, jest */

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

export const togglePlayPauseVideo = async () => {
  await waitFor(element(by.id('playPauseButton')))
    .toBeVisible()
    .withTimeout(24000);

  await element(by.id('playPauseButton')).tap();
};
