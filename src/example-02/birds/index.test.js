import { Bird } from '.';

describe('Bird', () => {
  it('should have a name', () => {
    const bird = new Bird({ name: 'birdie' });
    expect(bird.name).toBe('birdie');
  });

  it('should have airSpeedVelocity as null', () => {
    const bird = new Bird({ name: 'birdie' });
    expect(bird.airSpeedVelocity).toBeNull();
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
