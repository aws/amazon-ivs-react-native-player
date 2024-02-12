import {
  afterAllTestPlan,
  beforeAllTestPlan,
  clearLogs,
  setupTestPlan,
  waitForLogMessage,
  waitForTap,
} from './testPlan';

describe('Basic Props', () => {
  beforeAll(beforeAllTestPlan);
  afterAll(afterAllTestPlan);

  it('paused controls playback state', async () => {
    await setupTestPlan(`
    inputs:
    - paused: true
    events:
    - onPlayerStateChange
    `);
    await waitForTap(by.id('paused'));
    await waitForLogMessage('onPlayerStateChange ::: Playing');
  });

  it('paused controls playback state', async () => {
    await setupTestPlan(`
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
    await setupTestPlan(`
    inputs:
    - autoMaxQuality
    events:
    - onPlayerStateChange
    - onQualityChange
    `);
    await waitForLogMessage('onPlayerStateChange ::: Playing');
    await waitForTap(by.id('clearLogs'));
    // bump down
    await waitForTap(by.id('autoMaxQuality:1'));
    await waitForLogMessage(/.*480p.*/);
    await clearLogs();
    // back to max
    await waitForTap(by.id('autoMaxQuality:0'));
    await waitForLogMessage(/.*720p.*/);
  });
});

