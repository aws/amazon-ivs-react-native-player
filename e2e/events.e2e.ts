import {
    afterAllTestPlan,
    beforeAllTestPlan,
    setupTestPlan,
    waitForEvent,
  } from './testPlan';
  
  describe('Events', () => {
    beforeAll(beforeAllTestPlan);
    afterAll(afterAllTestPlan);
  
    it('player throws an error when given a bad uri to load', async () => {
      await setupTestPlan(`
      url: baduri
      events:
      - onError
      `);
      await waitForEvent('onError');
    });
  });
  
  