import { createPremiumBooking, date, extras, show } from './index.js';

const booking = createPremiumBooking(show, date, extras);

console.log(`Booking details`);
console.log(
  `Base price: ${Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(
    booking.basePrice
  )}`
);
console.log(`Has talkback: ${booking.hasTalkback ? 'Yes' : 'No'}`);
console.log(`Is peak day: ${booking.isPeakDay ? 'Yes' : 'No'}`);
console.log(`Has dinner: ${booking.hasDinner ? 'Yes' : 'No'}`);
console.log(`Date: ${Intl.DateTimeFormat('pt-PT').format(booking._date)}`);
console.log(`Show: ${booking._show.title}`);
