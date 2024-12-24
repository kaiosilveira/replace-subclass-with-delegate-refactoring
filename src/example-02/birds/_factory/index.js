import { Bird } from '..';
import { AffricanSwallow } from '../affrican-swallow';
import { EuropeanSwallow } from '../european-swallow';
import { NorwegianBlueParrot } from '../norwegian-blue-parrot';

export function createBird(data) {
  switch (data.type) {
    case 'EuropeanSwallow':
      return new EuropeanSwallow(data);
    case 'AffricanSwallow':
      return new AffricanSwallow(data);
    case 'NorwegianBlueParrot':
      return new NorwegianBlueParrot(data);
    default:
      return new Bird(data);
  }
}
