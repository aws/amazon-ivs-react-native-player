import { by, device, element, waitFor } from 'detox';

export const beforeAllTestPlan = async () => {
  await device.launchApp();
  await device.setURLBlacklist(['.*video-*', '.*player.stats.live-video.net*']);
};

export const afterAllTestPlan = async () => {
  await device.terminateApp();
};

export const waitToBeVisible = async (match: Detox.NativeMatcher) => {
  await waitFor(element(match)).toBeVisible();
};

export const waitForTap = async (match: Detox.NativeMatcher) => {
  await waitToBeVisible(match);
  await element(match).tap();
};

export const setupTestPlan = async (testPlan: string) => {
  // reload app
  await device.reloadReactNative();

  // navigate to testing screen
  await waitForTap(by.id('TestPlan'));

  // set test plan content
  await waitToBeVisible(by.id('testPlan'));
  await element(by.id('testPlan')).replaceText(testPlan);

  // execute test plan
  await waitForTap(by.id('runPlan'));
};

export const waitForLogMessage = async (
  text: string | RegExp,
  timeout = 8000
) => {
  const match = typeof text === 'string' ? new RegExp(`${text}.*`) : text;
  console.info('waitForLogMessage', match)
  await waitFor(element(by.id(match)))
    .toExist()
    .withTimeout(timeout);
};

export const clearLogs = async () => {
  await waitForTap(by.id('clearLogs'));
  await waitForLogMessage('onClearLogs :::')
}

export const waitForEvent = async (name: string) => {
  await waitForLogMessage(`${name} ::: `);
};

export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

// pause for a long time so you can look at logs
export const tempHold = async (seconds = 24) => {
  await sleep(seconds * 1000);
};