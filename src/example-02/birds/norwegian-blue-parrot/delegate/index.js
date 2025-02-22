export class NorwegianBlueParrotDelegate {
  constructor(data, bird) {
    this._voltage = data.voltage;
    this._isNailed = data.isNailed;
    this._bird = bird;
  }

  get airSpeedVelocity() {
    return this._isNailed ? 0 : 10 + this._voltage / 10;
  }

  get plumage() {
    if (this._voltage > 100) return 'scorched';
    return this._bird._plumage || 'beautiful';
  }
}
