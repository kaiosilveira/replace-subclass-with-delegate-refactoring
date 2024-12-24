import { AffricanSwallow } from './index';

describe('AffricanSwallow', () => {
  it('should have airSpeedVelocity 38 if number of coconuts is 1', () => {
    const bird = new AffricanSwallow({ type: 'AffricanSwallow', numberOfCoconuts: 1 });
    expect(bird.airSpeedVelocity).toBe(38);
  });
});
