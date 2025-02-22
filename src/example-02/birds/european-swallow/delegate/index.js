import { SpeciesDelegate } from '../../_delegate/index.js';

export class EuropeanSwallowDelegate extends SpeciesDelegate {
  constructor(data, bird) {
    super(data, bird);
  }

  get airSpeedVelocity() {
    return 35;
  }
}
