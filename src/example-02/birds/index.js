export class Bird {
  constructor(data) {
    this._name = data.name;
    this._plumage = data.plumage;
  }

  get name() {
    return this._name;
  }

  get plumage() {
    return this._plumage || 'average';
  }

  get airSpeedVelocity() {
    return null;
  }
}
