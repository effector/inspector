import * as effector from 'effector';
import * as inspector from '../src';

const event = effector.createEvent();

const $foo = effector.createStore('hello');
const $bar = $foo.map((foo) => foo.length);

const $deep = effector.createStore({
  demo: { baz: 1, baf: 'hello', naf: false },
});

const $number = effector.createStore(0);
const $bigint = effector.createStore(BigInt(498));
const $bool = effector.createStore(false);
const $bool2 = effector.createStore(true);
const $null = effector.createStore(null);
const $date = effector.createStore(new Date());
const $symbol = effector.createStore(Symbol.asyncIterator);

const domain = effector.createDomain();

const $example = domain.createStore(100);

const $set = effector.createStore(
  new Set(['a', 2, false, null, undefined, new Date()]),
);

const $setWrapped = effector.createStore({
  ref: new Set(['a', 2, false, null, undefined, new Date()]),
});

const $map = effector.createStore(
  new Map<string, any>([
    ['a', 2],
    ['b', false],
  ]),
);

const $mapWrapped = effector.createStore({
  ref: new Map<string, any>([
    ['a', 2],
    ['b', false],
  ]),
});

const $setInMap = effector.createStore(
  new Map([['hello', new Set<any>(['a', 2, false, null, undefined])]]),
);

const $mapInSet = effector.createStore(
  new Set([
    new Map([['hello', new Set<any>(['b', 12])]]),
  ]),
);

const $array = effector.createStore([
  false,
  5,
  900e50,
  'hello',
  BigInt(720587) * BigInt(44),
  new Map([['hello', new Set<any>(['a', 2, false, null, undefined])]]),
  new Set([
    new Map([['hello', new Set<any>(['b', 12])]]),
  ]),
  {
    ref: new Set(['a', 2, false, null, undefined, new Date()]),
  },
]);

const $fn1 = effector.createStore(function demo() {
  /* */
});
const $fn2 = effector.createStore(() => 5);
const op = (a, b) => a + b;
const $fn3 = effector.createStore(op);

const $setOfFns = effector.createStore({
  ref: new Set([
    function demo() {
      return 0;
    },
    () => 5,
    (a, b) => a + b,
  ]),
});

const $args = effector.createStore(
  (function(a, b, c, d) {
    return arguments; // eslint-disable-line prefer-rest-params
  })(1, 5, {}, () => 0),
);

const $error = effector.createStore(new Error('random'));
const $errorType = effector.createStore(new TypeError('random'));
class CustomError extends Error {
  demo = 123;
  hello = '';
  name = 'Custom';
  constructor(message: string) {
    super(message);
    this.hello = message;
  }
}
const $errorCustom = effector.createStore(new CustomError('message'));

const $window = effector.createStore(window);

const $uint = effector.createStore(new Uint32Array([0, 5, 1, 2]));
const $weakSet = effector.createStore(
  new WeakSet([{ a: 1 }, { b: 2 }, { c: 3 }]),
);

const $iterators = effector.createStore([
  new Set(['a', 2, false, null, undefined, new Date()]).entries(),
  ['a', 2, false, null, undefined, new Date()].entries(),
  new Map<string, any>([
    ['a', 2],
    ['b', false],
  ]).entries(),
]);

inspector.addStore($error);
inspector.addStore($errorType);
inspector.addStore($errorCustom);
inspector.addStore($set);
inspector.addStore($setWrapped);
inspector.addStore($map);
inspector.addStore($mapWrapped);
inspector.addStore($setInMap);
inspector.addStore($mapInSet);
inspector.addStore($array);
inspector.addStore($example);
inspector.addStore($fn1);
inspector.addStore($fn2);
inspector.addStore($fn3);
inspector.addStore($setOfFns);
inspector.addStore($uint);
inspector.addStore($weakSet);
inspector.addStore($iterators);
inspector.addStore($foo);
inspector.addStore($bar, { mapped: true });
inspector.addStore($deep);
inspector.addStore($number);
inspector.addStore($bigint);
inspector.addStore($bool);
inspector.addStore($bool2);
inspector.addStore($null);
inspector.addStore($date);
inspector.addStore($symbol);
inspector.addStore($args);
inspector.addStore($window);

inspector.createInspector({ visible: true });

setInterval(event, 1800);

$number.on(event, (counter) => counter + 1);
$example.on(event, (counter) => counter + 110);
$date.on(event, () => new Date());
