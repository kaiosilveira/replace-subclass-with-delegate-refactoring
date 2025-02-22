import { EuropeanSwallowDelegate } from '.';

describe('EuropeanSwallowDelegate', () => {
  describe('airSpeedVelocity', () => {
    it('should be 35', () => {
      const delegate = new EuropeanSwallowDelegate();
      expect(delegate.airSpeedVelocity).toBe(35);
    });
  });
});
