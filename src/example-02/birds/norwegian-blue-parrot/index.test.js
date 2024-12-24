import { NorwegianBlueParrot } from './index';

describe('NorwegianBlueParrot', () => {
  describe('plumage', () => {
    it('should be beautiful if voltage is less than 100', () => {
      const bird = new NorwegianBlueParrot({ type: 'NorwegianBlueParrot', voltage: 99 });
      expect(bird.plumage).toBe('beautiful');
    });

    it('should be scorched if voltage is greater than 100', () => {
      const bird = new NorwegianBlueParrot({ type: 'NorwegianBlueParrot', voltage: 101 });
      expect(bird.plumage).toBe('scorched');
    });
  });

  describe('airSpeedVelocity', () => {
    it('should have speed 0 if nailed', () => {
      const bird = new NorwegianBlueParrot({ type: 'NorwegianBlueParrot', isNailed: true });
      expect(bird.airSpeedVelocity).toBe(0);
    });

    it('should have speed of 10 + 10% of voltage if not nailed', () => {
      const bird = new NorwegianBlueParrot({
        type: 'NorwegianBlueParrot',
        isNailed: false,
        voltage: 100,
      });

      const tenPercentOfVoltage = 100 * 0.1;
      expect(bird.airSpeedVelocity).toBe(10 + tenPercentOfVoltage);
    });
  });
});
