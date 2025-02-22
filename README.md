[![Continuous Integration](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Replace Subclass With Delegate

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
class Order {
  get daysToShip() {
    return this._warehouse.daysToShip;
  }
}

class PriorityOrder extends Order {
  get daysToShip() {
    return this._priorityPlan.daysToShip;
  }
}
```

</td>

<td>

```javascript
class Order {
  get daysToShip() {
    return this._priorityDelegate ? this._priorityDelegate.daysToShip : this._warehouse.daystoShip;
  }
}

class PriorityOrderDelegate {
  get daysToShip() {
    return this._priorityPlan.daysToShip;
  }
}
```

</td>
</tr>
</tbody>
</table>

Inheritance is at the core of Object-Oriented Programming, and it's the "go to" approach for most of the slight specific behaviors we want to isolate out of general, default ones. It has it's downsides, though: you can only vary in one dimension. Delegation helps in cases where we need to vary in multiple axis, and brings with it the benefit of a more structured separation of concerns, with reinforced indirection.

## Working examples

The book brings us two examples: one related to regular and premium bookings, and one related to birds and their different species and specificities.

### Example 01: Bookings

In this working example, we have a regular `Booking` class, with standard behavior, and a `PremiumBooking` class, which inherits from `Booking` and overrides some of its behaviors. We want to break down this inheritance and use delegation instead, so we can better control the variations from `Booking` itself.

#### Test suite

Since it's a relatively complex example, the test suite was ommited for brevity. Please check the [initial commit](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/2b1adfad1ed76cdf19377554dd0fc59369cdc103) which sets up the scenario for the actual implementation.

#### Steps

Our goal is to make `Booking` incorporate the details of premium bookings, via delegation. To accomplish that, we need a way to tell a `Booking` instance to be premium. As always, a good way to start is by introducing a layer of abstraction so we can have more control over the initializations. In this case, we add a factory for `Booking` creations:

```diff
diff --git top level...
+export function createBooking(show, date) {
+  return new Booking(show, date);
+}
```

and then we update the regular booking client to the factory:

```diff
diff --git top level...
-const booking = new Booking(show, date);
+const booking = createBooking(show, date);
 console.log(`Booking details`);
 console.log(
```

Same process goes for premium bookings. First the factory:

```diff
diff --git top level...
+export function createPremiumBooking(show, date, extras) {
+  return new PremiumBooking(show, date, extras);
+}
```

then the update:

```diff
diff --git top level...
-const booking = new PremiumBooking(show, date, extras);
+const booking = createPremiumBooking(show, date, extras);
```

Now, on to the delegate itself. We first create it:

```diff
diff --git PremiumBookingDelegate.js
+export class PremiumBookingDelegate {
+  constructor(hostBooking, extras) {
+    this._host = hostBooking;
+    this._extras = extras;
+  }
+}
```

and then take a moment to add a "private" `_bePremium` at `Booking`. This will be our bridge between regular booking behavior and premium functionality:

```diff
diff --git Booking.js
export class Booking {
+  _bePremium(extras) {
+    this._premiumDelegate = new PremiumBookingDelegate(this, extras);
+  }
 }
```

Now, back to the `createPremiumBooking` factory function, we can promote the booking to premium:

```diff
diff --git top level...
 export function createPremiumBooking(show, date, extras) {
-  return new PremiumBooking(show, date, extras);
+  const result = new PremiumBooking(show, date, extras);
+  result._bePremium(extras);
+  return result;
 }
```

Sharp eyes will notice that We are still initializing an instance of `PremiumBooking`, and that's because there's still behavior in the subclass. Our goal now is to start moving functionality to the delegate and, when we're finished, desintegrate the `PremiumBooking` for good.

On to moving functionality, we start by adding `hasTalkback` to the delegate:

```diff
diff --git PremiumBookingDelegate.js
export class PremiumBookingDelegate {
+  get hasTalkback() {
+    return this._host._show.hasOwnProperty('talkback');
+  }
 }
```

and then simply delegating the calculation at `PremiumBooking`:

```diff
diff --git PremiumBooking.js
export class PremiumBooking extends Booking {
   get hasTalkback() {
-    return this._show.hasOwnProperty('talkback');
+    return this._premiumDelegate.hasTalkback;
   }
```

We can also make `Booking` aware of the delegate, by modifying `hasTalkback`. Our assumption here is that whenever there's a `premiumDelegate` present, then it's a premium booking:

```diff
export class Booking {
   get hasTalkback() {
-    return this._show.hasOwnProperty('talkback') && !this.isPeakDay;
+    return this._premiumDelegate
+      ? this._premiumDelegate.hasTalkback
+      : this._show.hasOwnProperty('talkback') && !this.isPeakDay;
   }
```

With all the above in place, there's no difference between the behavior in `PremiumBooking` versus in `Booking`, so we remove `hasTalkback` from `PremiumBooking`:

```diff
export class PremiumBooking extends Booking {
     this._extras = extras;
   }
-  get hasTalkback() {
-    return this._premiumDelegate.hasTalkback;
-  }
```

Moving the price is trickier, and the path we find to do that is by extension. `PremiumBookingDelegate` now has a method to extend the base price to include the premium fee:

```diff
export class PremiumBookingDelegate {
+  extendBasePrice(base) {
+    return Math.round(base + this._extras.premiumFee);
+  }
 }
```

And all we need to do in `Booking` is to apply the premium fee if it's a premium booking:

```diff
export class Booking {
   get basePrice() {
     let result = this._show.price;
     if (this.isPeakDay) result += Math.round(result * 0.15);
-    return result;
+    return this._premiumDelegate ? this._premiumDelegate.extendBasePrice(result) : result;
   }
```

With all the above, we can now remove `basePrice` from `PremiumBooking`:

```diff
export class PremiumBooking extends Booking {
-  get basePrice() {
-    return Math.round(super.basePrice + this._extras.premiumFee);
-  }
```

Last one is `hasDinner`, a method that was implemented only at `PremiumBooking`. We first nove it to `PremiumBookingDelegate`:

```diff
export class PremiumBookingDelegate {
+  get hasDinner() {
+    return this._extras.hasOwnProperty('dinner') && !this._host.isPeakDay;
+  }
```

Then implement `hasDinner` at `Booking`, using the same thought process as above:

```diff
export class Booking {
+  get hasDinner() {
+    return this._premiumDelegate ? this._premiumDelegate.hasDinner : false;
+  }
```

And, finally, we remove `hasDinner` from `PremiumBooking`:

```diff
export class PremiumBooking extends Booking {
-  get hasDinner() {
-    return this._extras.hasOwnProperty('dinner') && !this.isPeakDay;
-  }
```

Now, the behavior of the superclass is the same of the subclass, so we can create regular `Booking` instances before promotion at `createPremiumBooking`:

```diff
 export function createPremiumBooking(show, date, extras) {
-  const result = new PremiumBooking(show, date, extras);
+  const result = new Booking(show, date, extras);
   result._bePremium(extras);
   return result;
 }
```

And, finally, delete `PremiumBooking`:

```diff
-export class PremiumBooking extends Booking {
-  constructor(show, date, extras) {
-    super(show, date);
-    this._extras = extras;
-  }
-}
```

And that's it! We ended up with a single `Booking` class that eventually delegates particular behavior to a specialized `PremiumBookingDelegate`.

#### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                            | Message                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [b6bd73d](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/b6bd73d14b9903bf5b586fcb29bf24f0527a9cdc) | add factory for creating a `Booking`                                   |
| [10adc0a](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/10adc0a37b49b475286b88337d7d8bfcea1971c5) | update regular booking client to use `createBooking` factory fn        |
| [05667f1](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/05667f17beff44963aed26cb48249e12b1d0afb2) | introduce `createPremiumBooking` factory fn                            |
| [5b36b3b](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/5b36b3bd184060e9fa16bcfeb2813ee561b95361) | update premium booking client to use `createPremiumBooking`            |
| [78c9449](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/78c9449e1b4f8aac88ff9424c4a33e5e3f972114) | introduce `PremiumBookingDelegate`                                     |
| [d0409f5](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/d0409f5f754880190ac8334b0c3bb73147f460ce) | implement `_bePremium` at `Booking`                                    |
| [f6308e3](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/f6308e30a7a82563a9716f8046eb5812ed43e8ce) | promote booking to premium at `createPremiumBooking`                   |
| [2c7d737](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/2c7d7375feee213733ba800f2b6ca368e86b03df) | move `hasTalkback` to `PremiumBookingDelegate`                         |
| [6da9026](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/6da9026ca586693e117f9b137557e548791a86e7) | delegate `hasTalkback` to `PremiumBookingDelegate` at `PremiumBooking` |
| [cfd3976](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/cfd39760722685c0f8e0132e1af4ddfdca01cc27) | add conditional premium logic at `Booking.hasTalkback`                 |
| [38bdb96](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/38bdb96fbb8e2700bc7874c9da5412c69a6d4642) | remove `hasTalkback` from `PremiumBooking`                             |
| [7f20218](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/7f202187dccda1fbc7d7b777319efb4aacb96715) | extend base price with premium fee at `PremiumBookingDelegate`         |
| [7b83061](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/7b830616634d1a2005f5f2b27212beb39277b274) | apply premium fee if booking is premium                                |
| [e2b7d37](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/e2b7d3785a31466b959e2a49fe746f5b1d7eab67) | remove `basePrice` from `PremiumBooking`                               |
| [898a827](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/898a8274976f58e156d0bc3a05504da2debe91e2) | implement `hasDinner` at `PremiumBookingDelegate`                      |
| [ebf529f](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/ebf529fec7be82f314f7949094169322f2754670) | implement `hasDinner` at `Booking`                                     |
| [001d4ca](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/001d4cadeaaa53ec29e400a489a08adb3c8c07ac) | remove `hasDinner` from `PremiumBooking`                               |
| [b9ed371](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/b9ed371780728fb8cfcea821bc56bf121ef67be8) | create regular `Booking` before promotion at `createPremiumBooking`    |
| [724b334](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/724b3346c94c9944bc64861e554928844b766254) | delete `PremiumBooking`                                                |

commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commits/main).

### Example 02: Birds

In this working example, we're dealing with birds. Our class hierarchy was created around species, but we want to add yet another dimension to the mix: whether birds are domestic or wild. This will require a replacement of inheritance with composition.

#### Test suite

Since it's a relatively complex example, the test suite was ommited for brevity. Please check the [initial commit](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/2b1adfad1ed76cdf19377554dd0fc59369cdc103) which sets up the scenario for the actual implementation.

#### Steps

Our main goal is to have a series of delegates, one for each species, that are resolved and referenced in runtime by `Bird`. We start by introducing a `EuropeanSwallowDelegate` and adding a `_speciesDelegate` to `Bird`, with custom delegate selection based on the bird type:

```diff
diff --git european-swallow/delegate
+export class EuropeanSwallowDelegate {}

diff --git Bird.js
 export class Bird {
   constructor(data) {
     this._name = data.name;
     this._plumage = data.plumage;
+    this._speciesDelegate = this.selectSpeciesDelegate(data);
   }

+  selectSpeciesDelegate(data) {
+    switch (data.type) {
+      case 'EuropeanSwallow':
+        return new EuropeanSwallowDelegate();
+      default:
+        return null;
+    }
+  }
 }
```

We can then start moving logic around. We start by moving `airSpeedVelocity` to `EuropeanSwallowDelegate`, which is easy since it has a fixed value:

```diff
-export class EuropeanSwallowDelegate {}
+export class EuropeanSwallowDelegate {
+  get airSpeedVelocity() {
+    return 35;
+  }
+}
```

Then, `Bird` can now make use of `airSpeedVelocity` from the delegate:

```diff
export class Bird {
   get airSpeedVelocity() {
-    return null;
+    return this._speciesDelegate ? this._speciesDelegate.airSpeedVelocity : null;
   }
```

With that, all the specific behavior of `EuropeanSwallow` is now covered by `Bird`, via the delegate. So we can remove it from the `createBird` factory:

```diff
 export function createBird(data) {
   switch (data.type) {
-    case 'EuropeanSwallow':
-      return new EuropeanSwallow(data);
     case 'AffricanSwallow':
       return new AffricanSwallow(data);
     case 'NorwegianBlueParrot':
```

And delete the subclass:

```diff
-export class EuropeanSwallow extends Bird {
-  constructor(data) {
-    super(data);
-  }
-
-  get airSpeedVelocity() {
-    return 35;
-  }
-}
```

We repeat the process for `AfricanSwallow`. First the delegate:

```diff
+export class AfricanSwallowDelegate {
+  constructor(data) {
+    this._numberOfCoconuts = data.numberOfCoconuts;
+  }
+}
```

... then the `airSpeedVelocity` implementation:

```diff
export class AffricanSwallowDelegate {
+  get airSpeedVelocity() {
+    return 40 - 2 * this._numberOfCoconuts;
+  }
 }
```

... then the type resolution:

```diff
export class Bird {
     switch (data.type) {
       case 'EuropeanSwallow':
         return new EuropeanSwallowDelegate();
+      case 'AffricanSwallow':
+        return new AffricanSwallowDelegate(data);
       default:
         return null;
     }
```

... then the delegation of the call:

```diff
export class AffricanSwallow extends Bird {
   get airSpeedVelocity() {
-    return 40 - 2 * this._numberOfCoconuts;
+    return this._speciesDelegate.airSpeedVelocity;
   }
 }
```

... then the removal from the factory:

```diff
 export function createBird(data) {
   switch (data.type) {
-    case 'AffricanSwallow':
-      return new AffricanSwallow(data);
     case 'NorwegianBlueParrot':
       return new NorwegianBlueParrot(data);
     default:
```

... and, finally, the deletion:

```diff
-export class AffricanSwallow extends Bird {
-  constructor(data) {
-    super(data);
-    this._numberOfCoconuts = data.numberOfCoconuts;
-  }
-
-  get airSpeedVelocity() {
-    return this._speciesDelegate.airSpeedVelocity;
-  }
-}
```

And the same goes to `NorwegianBlueParrot`. First the delegate:

```diff
+export class NorwegianBlueParrotDelegate {
+  constructor(data) {
+    this._voltage = data.voltage;
+    this._isNailed = data.isNailed;
+  }
+}
```

... then the `airSpeedVelocity` migration:

```diff
export class NorwegianBlueParrotDelegate {
+  get airSpeedVelocity() {
+    return this._isNailed ? 0 : 10 + this._voltage / 10;
+  }
 }
```

... then the type resolution:

```diff
 export class Bird {
  selectSpeciesDelegate(data) {
    switch (data.type) {
       case 'AffricanSwallow':
         return new AffricanSwallowDelegate(data);
+      case 'NorwegianBlueParrot':
+        return new NorwegianBlueParrotDelegate(data);
       default:
         return null;
     }
```

... then the call delegation:

```diff
export class NorwegianBlueParrot extends Bird {
   get airSpeedVelocity() {
-    return this._isNailed ? 0 : 10 + this._voltage / 10;
+    return this._speciesDelegate.airSpeedVelocity;
   }
 }
```

And here things change a bit. We have `plumage`, which is difficult to get rid of. We first add it to the delegate:

```diff
 export class NorwegianBlueParrotDelegate {
-  constructor(data) {
+  constructor(data, bird) {
     this._voltage = data.voltage;
     this._isNailed = data.isNailed;
+    this._bird = bird;
   }
   get airSpeedVelocity() {
     return this._isNailed ? 0 : 10 + this._voltage / 10;
   }
+
+  get plumage() {
+    if (this._voltage > 100) return 'scorched';
+    return this._bird._plumage || 'beautiful';
+  }
 }
```

But, since it needs info from the bird itself, we provide a back reference to `Bird` at `NorwegianBlueParrotDelegate`:

```diff
export class Bird {
       case 'AffricanSwallow':
         return new AffricanSwallowDelegate(data);
       case 'NorwegianBlueParrot':
-        return new NorwegianBlueParrotDelegate(data);
+        return new NorwegianBlueParrotDelegate(data, this);
       default:
         return null;
     }
```

And now `plumage` can be delegated at `NorwegianBlueParrot`:

```diff
export class NorwegianBlueParrot extends Bird {
   }
   get plumage() {
-    if (this._voltage > 100) return 'scorched';
-    return this._plumage || 'beautiful';
+    return this._speciesDelegate.plumage;
   }
```

But, since the other subclasses don't have this method implemented, if we modify the `Bird` class to invoke the call on the delegate, we'll have some serious errors. The solution to that is by introducing delegate... inheritance!

```diff
+export class SpeciesDelegate {
+  constructor(data, bird) {
+    this._bird = bird;
+  }
+
+  get plumage() {
+    return this._bird._plumage || 'average';
+  }
+}
```

And update all other delegates to extend the base class. We start with `AffricanSwallowDelegate`:

```diff
+export class AffricanSwallowDelegate extends SpeciesDelegate {
+  constructor(data, bird) {
+    super(data, bird);
     this._numberOfCoconuts = data.numberOfCoconuts;
   }
```

... then`EuropeanSwallowDelegate`:

```diff
+export class EuropeanSwallowDelegate extends SpeciesDelegate {
+  constructor(data, bird) {
+    super(data, bird);
+  }
```

... and, finally, `NorwegianBlueParrotDelegate`:

```diff
+export class NorwegianBlueParrotDelegate extends SpeciesDelegate {
   constructor(data, bird) {
+    super(data, bird);
     this._voltage = data.voltage;
     this._isNailed = data.isNailed;
     this._bird = bird;
```

And, now, we can safely delegate `plumage` to `speciesDelegate` at `Bird`:

```diff
export class Bird {
   get plumage() {
-    return this._plumage || 'average';
+    return this._speciesDelegate.plumage;
   }
 }
```

And since we have a base species class in place, we can move default behavior, such as `airSpeedVelocity`, there as well:

```diff
export class SpeciesDelegate {
+  get airSpeedVelocity() {
+    return null;
+  }
 }
```

Finally, we can stop resolving the `NorwegianBlueParrot` subclass at `createBird`:

```diff
 export function createBird(data) {
   switch (data.type) {
-    case 'NorwegianBlueParrot':
-      return new NorwegianBlueParrot(data);
     default:
       return new Bird(data);
   }
```

And delete it:

```diff
-export class NorwegianBlueParrot extends Bird {
-  constructor(data) {
-    super(data);
-    this._voltage = data.voltage;
-    this._isNailed = data.isNailed;
-  }
-
-  get plumage() {
-    return this._speciesDelegate.plumage;
-  }
-
-  get airSpeedVelocity() {
-    return this._speciesDelegate.airSpeedVelocity;
-  }
-}
```

And that's it! Now all species-related behavior is well encapsulated into each of the delegates, with a base delegate class providing default behavior.

#### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                            | Message                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [82926e2](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/82926e2b3cb96e70519ca082fbac75b756aa85ab) | introduce `_speciesDelegate` at `Bird` with custom selection              |
| [a69e88e](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/a69e88e7feb05cfcfad8976a1e62787359a724e7) | set `airSpeedVelocity` to `35` at `EuropeanSwallowDelegate`               |
| [8fc679d](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/8fc679d3f69b5e59ae4c7d8dba62a66845f4b509) | use `airSpeedVelocity` from delegate if present at `Bird`                 |
| [a0cf2ae](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/a0cf2ae46503abb33f860e1022482248eba1e891) | remove `EuropeanSwallow` from `createBird` factory                        |
| [b1fbd71](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/b1fbd7158c6dd360faf30412d411c1775ac99008) | delete `EuropeanSwallow` subclass                                         |
| [a4d9600](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/a4d96001a57711ef93ba9b5b9a5f05a7a4cad1f1) | add `AffricanSwallowDelegate`                                             |
| [81bfbaa](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/81bfbaa8131d60b5b269c968612d4cc1ea6502b3) | implement `airSpeedVelocity` at `AffricanSwallowDelegate`                 |
| [adb92cb](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/adb92cb3db71a9a29d45cc87badda5fb32c08df8) | add `AffricanSwallow` to `speciesDelegate` resolution                     |
| [f550605](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/f550605a9e40ae8a8127313d64598b702441076e) | delegate `airSpeedVelocity` to `speciesDelegate` at `AffricanSwallow`     |
| [b76480c](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/b76480ca8ed0e5c2e287424cf72a8cfdffe13ee1) | stop using `AffricanSwallow` subclass at `createBird` factory             |
| [00b266d](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/00b266d6a9a0aaa5b25a2adae742cab000f9d225) | delete `AffricanSwallow` subclass                                         |
| [0d75aa4](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/0d75aa472e8f3599803b03791a15621bf3497e71) | add `NorwegianBlueParrotDelegate`                                         |
| [e921119](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/e921119759c8c3e1d6e9b8a4d62a66a70b972683) | add `airSpeedVelocity` to `NorwegianBlueParrotDelegate`                   |
| [cd55b49](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/cd55b49a25336f0cc6b4867f94876ef19a050c72) | add `NorwegianBlueParrot` to `speciesDelegate` resolution                 |
| [fbef8ff](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/fbef8ff151ddf33a53063698f4d9a35502580dcb) | delegate `airSpeedVelocity` to `speciesDelegate` at `NorwegianBlueParrot` |
| [2394673](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/2394673ef91994a2e168866f32f502d158744183) | add `plumage` to `NorwegianBlueParrotDelegate`                            |
| [9d6dabc](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/9d6dabc2fec5183357ec3a203011be6c767f92f7) | provide self ref to `NorwegianBlueParrotDelegate`                         |
| [cec3388](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/cec33886172fda90a1a01b963ac0bd4a419fc186) | delegate `plumage` at `NorwegianBlueParrot`                               |
| [f328d93](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/f328d932aa9a0f1bd46adda8bd73d29aa36fa74e) | introduce `SpeciesDelegate` superclass                                    |
| [a39f5dc](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/a39f5dc7ba26a9c5122c0728404aa259a48101c1) | make `AffricanSwallowDelegate` extend `SpeciesDelegate`                   |
| [15659a1](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/15659a1551f91dbc4d03a3a69eb6900833029222) | make `EuropeanSwallowDelegate` extend `SpeciesDelegate`                   |
| [a69ba4d](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/a69ba4d19521d623cd640dbe50fdec2e55ed8b6f) | make `NorwegianBlueParrotDelegate` extend `SpeciesDelegate`               |
| [3a85cfc](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/3a85cfcee20a811dd8f6fd71e140bd4ce5d3076b) | delegate `plumage` to `speciesDelegate` at `Bird`                         |
| [e6553b2](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/e6553b2d13578be6c994d2f61412551e17976ef5) | implement default `airSpeedVelocity` at `Bird`                            |
| [02a8dc5](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/02a8dc5a3cbdb71f17a194a825729a9ea381c1df) | stop resolving `NorwegianBlueParrot` subclass at `createBird` factory fn  |
| [1cc7794](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commit/1cc779419e4196c00f2fe60dd8ca421c991630c8) | delete `NorwegianBlueParrot` subclass                                     |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/replace-subclass-with-delegate-refactoring/commits/main).
