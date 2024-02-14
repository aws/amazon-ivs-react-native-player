/* eslint-env detox/detox, mocha, jest/globals */
import {
  afterAllTestPlan,
  beforeAllTestPlan,
  waitForClearLogs,
  waitForTestPlan,
  waitForLogMessage,
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
    await waitForLogMessage('onPlayerStateChange ::: Playing');
  });

  it('paused controls playback state', async () => {
    await waitForTestPlan(`
    inputs:
    - paused: false
    events:
    - onPlayerStateChange
    `);
    await waitForLogMessage('onPlayerStateChange ::: Playing');
    await waitForTap(by.id('paused'));
    await waitForLogMessage('onPlayerStateChange ::: Idle');
  });

  it('autoMaxQuality controls highest quality picked on auto', async () => {
    await waitForTestPlan(`
    inputs:
    - autoMaxQuality
    events:
    - onPlayerStateChange
    - onQualityChange
    `);
    await waitForLogMessage('onPlayerStateChange ::: Playing');
    await waitForClearLogs();
    // bump down
    await waitForTap(by.id('autoMaxQuality:1'));
    await waitForLogMessage(/.*480p.*/);
    await waitForClearLogs();
    // back to max
    await waitForTap(by.id('autoMaxQuality:0'));
    await waitForLogMessage(/.*720p.*/);
  });
});
