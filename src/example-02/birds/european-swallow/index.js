import { Bird } from '..';

export class EuropeanSwallow extends Bird {
  constructor(data) {
    super(data);
  }

  get airSpeedVelocity() {
    return 35;
  }
}
