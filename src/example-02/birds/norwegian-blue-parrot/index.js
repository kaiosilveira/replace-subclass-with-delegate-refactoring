import { Bird } from '../index.js';

export class NorwegianBlueParrot extends Bird {
  constructor(data) {
    super(data);
    this._voltage = data.voltage;
    this._isNailed = data.isNailed;
  }

  get plumage() {
    return this._speciesDelegate.plumage;
  }

  get airSpeedVelocity() {
    return this._speciesDelegate.airSpeedVelocity;
  }
}
