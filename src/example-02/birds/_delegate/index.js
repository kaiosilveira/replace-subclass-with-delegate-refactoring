export class SpeciesDelegate {
  constructor(data, bird) {
    this._bird = bird;
  }

  get plumage() {
    return this._bird._plumage || 'average';
  }

  get airSpeedVelocity() {
    return null;
  }
}
