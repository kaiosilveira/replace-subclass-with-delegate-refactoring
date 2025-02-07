export class PremiumBookingDelegate {
  constructor(hostBooking, extras) {
    this._host = hostBooking;
    this._extras = extras;
  }

  get hasTalkback() {
    return this._host._show.hasOwnProperty('talkback');
  }

  extendBasePrice(base) {
    return Math.round(base + this._extras.premiumFee);
  }
}
