import { createBooking, createPremiumBooking, date, extras, show } from '.';
import { Booking } from './bookings';
import { PremiumBooking } from './bookings/premium';

describe('createBooking', () => {
  it('should create a booking instance', () => {
    const booking = createBooking(show, date);
    expect(booking).toBeInstanceOf(Booking);
  });
});

describe('createPremiumBooking', () => {
  it('should create a premium booking instance', () => {
    const booking = createPremiumBooking(show, date, extras);
    expect(booking).toBeInstanceOf(PremiumBooking);
  });
});
