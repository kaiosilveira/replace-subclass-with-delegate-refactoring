import { Booking } from '.';

const mondayDecNinth = new Date('2024-12-09');
const tuesdayDecTenth = new Date('2024-12-10');
const wednesdayDecEleventh = new Date('2024-12-11');
const thursdayDecTwelfth = new Date('2024-12-12');
const fridayDecThirteenth = new Date('2024-12-13');
const saturdayDecFourteenth = new Date('2024-12-14');
const sundayDecFifteenth = new Date('2024-12-15');

describe('Booking', () => {
  describe('talkback', () => {
    it('should offer talkback for non-peak days', () => {
      const booking = new Booking({ talkback: true }, sundayDecFifteenth);
      expect(booking.hasTalkback).toBe(true);
    });

    it('should not offer talkback for peak days', () => {
      const booking = new Booking({ talkback: true }, saturdayDecFourteenth);
      expect(booking.hasTalkback).toBe(false);
    });
  });

  describe('basePrice', () => {
    it('should calculate base price for non-peak days', () => {
      const booking = new Booking({ price: 100 }, sundayDecFifteenth);
      expect(booking.basePrice).toBe(100);
    });

    it('should calculate base price for peak days', () => {
      const booking = new Booking({ price: 100 }, saturdayDecFourteenth);
      expect(booking.basePrice).toBe(115);
    });
  });

  describe('peak days', () => {
    describe('monday', () => {
      it('should not be a peak day', () => {
        const booking = new Booking({}, mondayDecNinth);
        expect(booking.isPeakDay).toBe(false);
      });
    });

    describe('tuesday', () => {
      it('should not be a peak day', () => {
        const booking = new Booking({}, tuesdayDecTenth);
        expect(booking.isPeakDay).toBe(false);
      });
    });

    describe('wednesday', () => {
      it('should not be a peak day', () => {
        const booking = new Booking({}, wednesdayDecEleventh);
        expect(booking.isPeakDay).toBe(false);
      });
    });

    describe('thursday', () => {
      it('should not be a peak day', () => {
        const booking = new Booking({}, thursdayDecTwelfth);
        expect(booking.isPeakDay).toBe(false);
      });
    });

    describe('friday', () => {
      it('should be a peak day', () => {
        const booking = new Booking({}, fridayDecThirteenth);
        expect(booking.isPeakDay).toBe(true);
      });
    });

    describe('saturday', () => {
      it('should be a peak day', () => {
        const booking = new Booking({}, saturdayDecFourteenth);
        expect(booking.isPeakDay).toBe(true);
      });
    });

    describe('sunday', () => {
      it('should not be a peak day', () => {
        const booking = new Booking({}, sundayDecFifteenth);
        expect(booking.isPeakDay).toBe(false);
      });
    });
  });
});
