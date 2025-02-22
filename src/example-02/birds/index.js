import { SpeciesDelegate } from './_delegate/index.js';
import { AffricanSwallowDelegate } from './affrican-swallow/delegate/index.js';
import { EuropeanSwallowDelegate } from './european-swallow/delegate/index.js';
import { NorwegianBlueParrotDelegate } from './norwegian-blue-parrot/delegate/index.js';

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
    return this._speciesDelegate.plumage;
  }

  get airSpeedVelocity() {
    return this._speciesDelegate ? this._speciesDelegate.airSpeedVelocity : null;
  }

  selectSpeciesDelegate(data) {
    switch (data.type) {
      case 'EuropeanSwallow':
        return new EuropeanSwallowDelegate(data, this);
      case 'AffricanSwallow':
        return new AffricanSwallowDelegate(data, this);
      case 'NorwegianBlueParrot':
        return new NorwegianBlueParrotDelegate(data, this);
      default:
        return new SpeciesDelegate(data, this);
    }
  }
}
