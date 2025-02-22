import { createBird } from './index';
import { Bird } from '..';
import { AffricanSwallow } from '../affrican-swallow';
import { NorwegianBlueParrot } from '../norwegian-blue-parrot';

describe('createBird', () => {
  it('should create an AffricanSwallow', () => {
    const bird = createBird({ type: 'AffricanSwallow' });
    expect(bird).toBeInstanceOf(AffricanSwallow);
  });

  it('should create a NorwegianBlueParrot', () => {
    const bird = createBird({ type: 'NorwegianBlueParrot' });
    expect(bird).toBeInstanceOf(NorwegianBlueParrot);
  });

  describe('type is unknown', () => {
    it('should create a Bird', () => {
      const bird = createBird({ type: 'Unknown' });
      expect(bird).toBeInstanceOf(Bird);
    });
  });
});
