import { Bird } from '.';

describe('Bird', () => {
  it('should have a name', () => {
    const bird = new Bird({ name: 'birdie' });
    expect(bird.name).toBe('birdie');
  });

  describe('airSpeedVelocity', () => {
    it('should have airSpeedVelocity as null by default', () => {
      const bird = new Bird({ name: 'birdie' });
      expect(bird.airSpeedVelocity).toBeNull();
    });

    it('should have airSpeedVelocity as 35 for EuropeanSwallow', () => {
      const bird = new Bird({ name: 'birdie', type: 'EuropeanSwallow' });
      expect(bird.airSpeedVelocity).toBe(35);
    });
  });

  describe('plumage', () => {
    it('should keep the provided value, if defined', () => {
      const bird = new Bird({ name: 'birdie', plumage: 'beautiful' });
      expect(bird.plumage).toBe('beautiful');
    });

    it('should be average if not provided', () => {
      const bird = new Bird({ name: 'birdie' });
      expect(bird.plumage).toBe('average');
    });
  });
});
