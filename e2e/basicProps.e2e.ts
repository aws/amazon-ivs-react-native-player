/* eslint-env detox/detox, jest/globals */
import {
  afterAllTestPlan,
  beforeAllTestPlan,
  tempHold,
  waitForClearLogs,
  waitForLogID,
  waitForLogLabel,
  waitForTap,
  waitForTestPlan,
} from './testPlan';

describe('Basic Props', () => {
  beforeAll(beforeAllTestPlan);
  afterAll(afterAllTestPlan);

  it('autoMaxQuality controls highest quality picked on auto', async () => {
    await waitForTestPlan(`
    inputs:
    - autoMaxQuality
    events:
    - onQualityChange
    `);
    await waitForLogID('onQualityChange', 30);
    await tempHold(4);
    await element(by.id('testPlan')).tapReturnKey();
    await waitForClearLogs();

    await waitForTap(by.id('autoMaxQuality:160p'), 4);
    await waitForLogLabel('onQualityChange ::: name ::: 160p', 30);
  });

  it('paused controls playback state', async () => {
    await waitForTestPlan(`
      inputs:
      - paused: true
      events:
      - onPlayerStateChange
      `);
    await waitForTap(by.id('paused'));
    await waitForLogLabel('onPlayerStateChange ::: Playing');
  });

  it('paused controls playback state', async () => {
    await waitForTestPlan(`
      inputs:
      - paused: false
      events:
      - onPlayerStateChange
      `);
    await waitForLogLabel('onPlayerStateChange ::: Playing');
    await waitForTap(by.id('paused'));
    await waitForLogLabel('onPlayerStateChange ::: Idle');
  });
});
