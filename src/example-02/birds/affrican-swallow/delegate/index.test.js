import { AffricanSwallowDelegate } from '.';

describe('AffricanSwallowDelegate', () => {
  describe('airSpeedVelocity', () => {
    it('should have airSpeedVelocity 38 if number of coconuts is 1', () => {
      const bird = new AffricanSwallowDelegate({ type: 'AffricanSwallow', numberOfCoconuts: 1 });
      expect(bird.airSpeedVelocity).toBe(38);
    });
  });
});
