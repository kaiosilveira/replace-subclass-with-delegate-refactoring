import { PremiumBookingDelegate } from '.';
import { Booking } from '../..';

const sundayDecFifteenth = new Date('2024-12-15');

describe('PremiumBookingDelegate', () => {
  const extras = { dinner: true, breakfast: true, premiumFee: 10 };

  describe('hasTalkback', () => {
    it('should return true if show has talkback', () => {
      const booking = new Booking({ talkback: true }, sundayDecFifteenth);
      const delegate = new PremiumBookingDelegate(booking, extras);
      expect(delegate.hasTalkback).toBe(true);
    });

    it('should return false if show does not have talkback', () => {
      const booking = new Booking({}, sundayDecFifteenth);
      const delegate = new PremiumBookingDelegate(booking, extras);
      expect(delegate.hasTalkback).toBe(false);
    });
  });

  describe('basePrice', () => {
    it('should add premium fee to base price', () => {
      const booking = new Booking({ price: 100 }, sundayDecFifteenth);
      const delegate = new PremiumBookingDelegate(booking, extras);
      expect(delegate.extendBasePrice(booking.basePrice)).toBe(110);
    });
  });
});
