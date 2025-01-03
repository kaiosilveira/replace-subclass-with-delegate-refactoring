const FRIDAY = 5;
const SATURDAY = 6;
export const PEAK_DAYS = [FRIDAY, SATURDAY];
export const isPeakDay = date => PEAK_DAYS.includes(date.getDay());

export class Booking {
  constructor(show, date) {
    this._show = show;
    this._date = date;
  }

  get isPeakDay() {
    return isPeakDay(this._date);
  }

  get hasTalkback() {
    return this._show.hasOwnProperty('talkback') && !this.isPeakDay;
  }

  get basePrice() {
    let result = this._show.price;
    if (this.isPeakDay) result += Math.round(result * 0.15);
    return result;
  }
}
