import { createBooking, date, show } from '.';
import { Booking } from './bookings';

describe('createBooking', () => {
  it('should create a booking instance', () => {
    const booking = createBooking(show, date);
    expect(booking).toBeInstanceOf(Booking);
  });
});
