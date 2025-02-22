import { EuropeanSwallowDelegate } from './european-swallow/delegate';

export class Bird {
  constructor(data) {
    this._name = data.name;
    this._plumage = data.plumage;
    this._speciesDelegate = this.selectSpeciesDelegate(data);
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

  selectSpeciesDelegate(data) {
    switch (data.type) {
      case 'EuropeanSwallow':
        return new EuropeanSwallowDelegate();
      default:
        return null;
    }
  }
}
