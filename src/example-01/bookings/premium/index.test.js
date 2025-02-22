import { PremiumBooking } from '.';

const saturdayDecFourteenth = new Date('2024-12-14');
const sundayDecFifteenth = new Date('2024-12-15');

describe('PremiumBooking', () => {
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
});
