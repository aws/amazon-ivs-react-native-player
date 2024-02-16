/* eslint-env detox/detox, jest/globals */
import {
  afterAllTestPlan,
  beforeAllTestPlan,
  waitForClearLogs,
  waitForTestPlan,
  waitForLogLabel,
  waitForTap,
} from './testPlan';

describe('Basic Props', () => {
  beforeAll(beforeAllTestPlan);
  afterAll(afterAllTestPlan);

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

  it('autoMaxQuality controls highest quality picked on auto', async () => {
    await waitForTestPlan(`
    inputs:
    - autoMaxQuality
    events:
    - onQualityChange
    `);
    await waitForLogLabel('onQualityChange ::: name ::: 720p', 24);
    await waitForClearLogs();
    // bump down
    await waitForTap(by.id('autoMaxQuality:480p'));
    await waitForLogLabel('onQualityChange ::: name ::: 480p', 24);
    await waitForClearLogs();
    // back to max
    await waitForTap(by.id('autoMaxQuality:720p'));
    await waitForLogLabel('onQualityChange ::: name ::: 720p', 24);
  });
});
