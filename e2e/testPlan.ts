/* eslint-env detox/detox, jest/globals */
import { by, device, element, waitFor } from 'detox';

// for slow android ci
jest.retryTimes(3);

type NativeMatcher = Parameters<typeof element>[0];

const defaultTimeoutSeconds = 24;

export const beforeAllTestPlan = async () => {
  await device.launchApp();
  await device.setURLBlacklist(['.*video-*', '.*player.stats.live-video.net*']);
};

export const afterAllTestPlan = async () => {
  await device.terminateApp();
};

export const waitForTestPlan = async (testPlan: string) => {
  try {
    await waitForTap(by.id('goBack'), 1);
  } catch (err) {
    //
  }

  // navigate to testing screen
  await waitForTap(by.id('TestPlan'));

  // set test plan content
  await waitForReplaceText(by.id('testPlan'), testPlan);

  // execute test plan
  await waitForTap(by.id('runPlan'));
};

export const waitToBeVisible = async (
  match: NativeMatcher,
  seconds = defaultTimeoutSeconds
) => {
  await waitFor(element(match).atIndex(0))
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
  await element(by.id('player')).tap();
};

export const waitForLogID = async (
  id: string,
  seconds = defaultTimeoutSeconds
) => {
  await waitFor(element(by.id(id.trim())).atIndex(0))
    .toExist()
    .withTimeout(seconds * 1000);
};

export const waitForLogLabel = async (
  label: string,
  seconds = defaultTimeoutSeconds
) => {
  await waitFor(element(by.label(label.trim())).atIndex(0))
    .toExist()
    .withTimeout(seconds * 1000);
};

export const waitForClearLogs = async () => {
  await waitForTap(by.id('clearLogs'));
  await waitForLogID('onClearLogs');
};

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

// pause for a long time so you can look at logs
export const tempHold = async (seconds = 24) => {
  await sleep(seconds * 1000);
};
