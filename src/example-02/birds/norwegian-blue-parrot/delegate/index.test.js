import { NorwegianBlueParrotDelegate } from '.';

describe('NorwegianBlueParrotDelegate', () => {
  describe('airSpeedVelocity', () => {
    it('should have speed 0 if nailed', () => {
      const bird = new NorwegianBlueParrotDelegate({ type: 'NorwegianBlueParrot', isNailed: true });
      expect(bird.airSpeedVelocity).toBe(0);
    });

    it('should have speed of 10 + 10% of voltage if not nailed', () => {
      const bird = new NorwegianBlueParrotDelegate({
        type: 'NorwegianBlueParrot',
        isNailed: false,
        voltage: 100,
      });

      const tenPercentOfVoltage = 100 * 0.1;
      expect(bird.airSpeedVelocity).toBe(10 + tenPercentOfVoltage);
    });
  });
});
