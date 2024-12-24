import { createBird } from './birds/_factory/index.js';

const europeanSwallow = createBird({ type: 'EuropeanSwallow' });
console.log(`EuropeanSwallow`);
console.log(`plumage: ${europeanSwallow.plumage}`);
console.log(`airSpeedVelocity: ${europeanSwallow.airSpeedVelocity}`);

console.log(`--------------------------------`);

const affricanSwallow = createBird({ type: 'AffricanSwallow', numberOfCoconuts: 1 });
console.log(`AffricanSwallow`);
console.log(`plumage: ${affricanSwallow.plumage}`);
console.log(`airSpeedVelocity: ${affricanSwallow.airSpeedVelocity}`);

console.log(`--------------------------------`);

const beautifulNorwegianBlueParrot = createBird({ type: 'NorwegianBlueParrot', voltage: 99 });

console.log(`Beautiful Norwegian Blue Parrot`);
console.log(`plumage: ${beautifulNorwegianBlueParrot.plumage}`);
console.log(`airSpeedVelocity: ${beautifulNorwegianBlueParrot.airSpeedVelocity}`);

console.log(`--------------------------------`);

const scorchedNorwegianBlueParrot = createBird({ type: 'NorwegianBlueParrot', voltage: 101 });

console.log(`Scorched Norwegian Blue Parrot`);
console.log(`plumage: ${scorchedNorwegianBlueParrot.plumage}`);
console.log(`airSpeedVelocity: ${scorchedNorwegianBlueParrot.airSpeedVelocity}`);

console.log(`--------------------------------`);

const nailedNorwegianBlueParrot = createBird({ type: 'NorwegianBlueParrot', isNailed: true });

console.log(`Nailed Norwegian Blue Parrot`);
console.log(`plumage: ${nailedNorwegianBlueParrot.plumage}`);
console.log(`airSpeedVelocity: ${nailedNorwegianBlueParrot.airSpeedVelocity}`);

console.log(`--------------------------------`);

const notNailedNorwegianBlueParrot = createBird({
  type: 'NorwegianBlueParrot',
  isNailed: false,
  voltage: 100,
});

console.log(`Not Nailed Norwegian Blue Parrot`);
console.log(`plumage: ${notNailedNorwegianBlueParrot.plumage}`);
console.log(`airSpeedVelocity: ${notNailedNorwegianBlueParrot.airSpeedVelocity}`);

console.log(`--------------------------------`);

const unknown = createBird({ type: 'Unknown' });
console.log(`Unknown`);
console.log(`plumage: ${unknown.plumage}`);
