import { Booking } from './bookings/index.js';
import { PremiumBooking } from './bookings/premium/index.js';

export const show = { title: 'Kendrick Lamar - GNX Tour', price: 100, talkback: true };
export const extras = { premiumFee: 50, dinner: true };
export const date = new Date(2025, 3, 2);

export function createBooking(show, date) {
  return new Booking(show, date);
}

export function createPremiumBooking(show, date, extras) {
  const result = new PremiumBooking(show, date, extras);
  result._bePremium(extras);
  return result;
}
