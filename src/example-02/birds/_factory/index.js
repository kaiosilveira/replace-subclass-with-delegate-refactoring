import { Bird } from '../index.js';

export function createBird(data) {
  switch (data.type) {
    default:
      return new Bird(data);
  }
}
