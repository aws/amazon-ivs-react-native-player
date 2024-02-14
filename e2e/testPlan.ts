/* eslint-env detox/detox, mocha, jest/globals */
import { by, device, element, waitFor } from 'detox';

type NativeMatcher = Parameters<typeof element>[0];

export const beforeAllTestPlan = async () => {
  await device.launchApp();
  await device.setURLBlacklist(['.*video-*', '.*player.stats.live-video.net*']);
};

export const afterAllTestPlan = async () => {
  await device.terminateApp();
};

export const waitForTestPlan = async (testPlan: string) => {
  // reload app
  await device.reloadReactNative();

  // navigate to testing screen
  await waitForTap(by.id('TestPlan'));

  // set test plan content
  await waitForReplaceText(by.id('testPlan'), testPlan);

  // execute test plan
  await waitForTap(by.id('runPlan'));
};

export const waitToBeVisible = async (match: NativeMatcher, seconds = 8) => {
  await waitFor(element(match))
    .toBeVisible()
    .withTimeout(seconds * 1000);
};

export const waitForTap = async (match: NativeMatcher, seconds?: number) => {
  await waitToBeVisible(match, seconds);
  await element(match).tap();
};

export const waitForReplaceText = async (
  match: NativeMatcher,
  text: any,
  seconds?: number
) => {
  await waitToBeVisible(match, seconds);
  await element(match).replaceText(`${text}`);
};

export const waitForLogMessage = async (text: string | RegExp, seconds = 8) => {
  const match = typeof text === 'string' ? new RegExp(`${text}.*`) : text;
  console.info('waitForLogMessage', match);
  await waitFor(element(by.id(match)))
    .toExist()
    .withTimeout(seconds * 1000);
};

export const waitForClearLogs = async () => {
  await waitForTap(by.id('clearLogs'));
  await waitForLogMessage('onClearLogs :::');
};

export const waitForEvent = async (name: string, seconds?: number) => {
  await waitForLogMessage(`${name} ::: `, seconds);
};

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

// pause for a long time so you can look at logs
export const tempHold = async (seconds = 24) => {
  await sleep(seconds * 1000);
};
