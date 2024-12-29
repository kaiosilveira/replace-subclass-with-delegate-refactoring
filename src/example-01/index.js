import { Booking } from "./bookings/index.js";

export const show = { title: 'Kendrick Lamar - GNX Tour', price: 100, talkback: true };
export const extras = { premiumFee: 50, dinner: true };
export const date = new Date(2025, 3, 2);

export function createBooking(show, date) {
  return new Booking(show, date);
}
