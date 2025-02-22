import { AffricanSwallowDelegate } from './affrican-swallow/delegate/index.js';
import { EuropeanSwallowDelegate } from './european-swallow/delegate/index.js';

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
    return this._speciesDelegate ? this._speciesDelegate.airSpeedVelocity : null;
  }

  selectSpeciesDelegate(data) {
    switch (data.type) {
      case 'EuropeanSwallow':
        return new EuropeanSwallowDelegate();
      case 'AffricanSwallow':
        return new AffricanSwallowDelegate(data);
      default:
        return null;
    }
  }
}
