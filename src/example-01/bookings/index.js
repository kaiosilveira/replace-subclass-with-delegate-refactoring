import { PremiumBookingDelegate } from './premium/delegate/index.js';

const FRIDAY = 5;
const SATURDAY = 6;
export const PEAK_DAYS = [FRIDAY, SATURDAY];
export const isPeakDay = date => PEAK_DAYS.includes(date.getDay());

export class Booking {
  constructor(show, date) {
    this._show = show;
    this._date = date;
  }

  get hasDinner() {
    return this._premiumDelegate ? this._premiumDelegate.hasDinner : false;
  }

  get isPeakDay() {
    return isPeakDay(this._date);
  }

  get hasTalkback() {
    return this._premiumDelegate
      ? this._premiumDelegate.hasTalkback
      : this._show.hasOwnProperty('talkback') && !this.isPeakDay;
  }

  get basePrice() {
    let result = this._show.price;
    if (this.isPeakDay) result += Math.round(result * 0.15);
    return this._premiumDelegate ? this._premiumDelegate.extendBasePrice(result) : result;
  }

  _bePremium(extras) {
    this._premiumDelegate = new PremiumBookingDelegate(this, extras);
  }
}
