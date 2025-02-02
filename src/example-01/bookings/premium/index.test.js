import { PremiumBooking } from '.';

const saturdayDecFourteenth = new Date('2024-12-14');
const sundayDecFifteenth = new Date('2024-12-15');

describe('PremiumBooking', () => {
  describe('talkback', () => {
    it('should offer talkback', () => {
      const booking = new PremiumBooking({ talkback: true }, saturdayDecFourteenth);
      booking._bePremium();
      expect(booking.hasTalkback).toBe(true);
    });
  });

  describe('dinner', () => {
    it('should offer dinner for non-peak days', () => {
      const booking = new PremiumBooking({}, sundayDecFifteenth, { dinner: true });
      expect(booking.hasDinner).toBe(true);
    });

    it('should not offer dinner for peak days', () => {
      const booking = new PremiumBooking({}, saturdayDecFourteenth, { dinner: true });
      expect(booking.hasDinner).toBe(false);
    });
  });

  describe('basePrice', () => {
    it('should add up premium fee to base price', () => {
      const booking = new PremiumBooking({ price: 100 }, sundayDecFifteenth, { premiumFee: 10 });
      expect(booking.basePrice).toBe(110);
    });
  });
});
