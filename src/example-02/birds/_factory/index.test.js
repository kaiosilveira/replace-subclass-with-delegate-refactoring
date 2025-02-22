import { createBird } from './index';
import { Bird } from '..';

describe('createBird', () => {
  describe('type is unknown', () => {
    it('should create a Bird', () => {
      const bird = createBird({ type: 'Unknown' });
      expect(bird).toBeInstanceOf(Bird);
    });
  });
});
