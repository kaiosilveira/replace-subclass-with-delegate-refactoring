import { EuropeanSwallow } from './index';

describe('EuropeanSwallow', () => {
  it('should have airSpeedVelocity 35', () => {
    const bird = new EuropeanSwallow({ type: 'EuropeanSwallow', name: 'bird' });
    expect(bird.airSpeedVelocity).toBe(35);
  });
});
