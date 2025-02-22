import { SpeciesDelegate } from '.';

describe('SpeciesDelegate', () => {
  describe('plumage', () => {
    it('should return the bird plumage if set', () => {
      const bird = { _plumage: 'beautiful' };
      const speciesDelegate = new SpeciesDelegate({}, bird);
      expect(speciesDelegate.plumage).toBe('beautiful');
    });

    it('should return average if bird plumage is not set', () => {
      const bird = {};
      const speciesDelegate = new SpeciesDelegate({}, bird);
      expect(speciesDelegate.plumage).toBe('average');
    });
  });
});
