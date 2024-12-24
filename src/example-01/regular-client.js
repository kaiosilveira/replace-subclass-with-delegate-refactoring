import { Booking } from './bookings/index.js';
import { date, show } from './index.js';

const booking = new Booking(show, date);

console.log(`Booking details`);
console.log(
  `Base price: ${Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(
    booking.basePrice
  )}`
);
console.log(`Has talkback: ${booking.hasTalkback ? 'Yes' : 'No'}`);
console.log(`Is peak day: ${booking.isPeakDay ? 'Yes' : 'No'}`);
console.log(`Date: ${Intl.DateTimeFormat('pt-PT').format(booking._date)}`);
console.log(`Show: ${booking._show.title}`);
