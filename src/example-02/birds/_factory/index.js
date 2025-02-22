import { Bird } from '../index.js';
import { NorwegianBlueParrot } from '../norwegian-blue-parrot/index.js';

export function createBird(data) {
  switch (data.type) {
    case 'NorwegianBlueParrot':
      return new NorwegianBlueParrot(data);
    default:
      return new Bird(data);
  }
}
