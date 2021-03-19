import { createStore, createEvent, createDomain, createEffect } from 'effector';
import * as inspector from '../src';

const event = createEvent<number>();
const just = createEvent<string>();

const $foo = createStore('hello');
const $bar = $foo.map((foo) => foo.length);

const $deep = createStore({
  demo: { baz: 1, baf: 'hello', naf: false },
});

const veryRootDomain = createDomain();

const anotherInsideDeepDarkDomainForRoot = veryRootDomain.createDomain();

const $number = anotherInsideDeepDarkDomainForRoot.createStore(0);
const $numberInf = createStore(Infinity);
const $numberNot = createStore(NaN);
const $bigint = createStore(BigInt(498));
const $bool = createStore(false);
const $bool2 = createStore(true);
const $null = createStore(null);
const $date = createStore(new Date());
const $symbol = createStore(Symbol.asyncIterator);

const domain = createDomain();

const $example = domain.createStore(100);

const $set = createStore(new Set(['a', 2, false, null, undefined, new Date()]));

const $setWrapped = createStore({
  ref: new Set(['a', 2, false, null, undefined, new Date()]),
});

const $map = createStore(
  new Map<string, any>([
    ['a', 2],
    ['b', false],
  ]),
);

const $mapWrapped = createStore({
  ref: new Map<string, any>([
    ['a', 2],
    ['b', false],
  ]),
});

const $setInMap = createStore(
  new Map([['hello', new Set<any>(['a', 2, false, null, undefined])]]),
);

const $mapInSet = createStore(
  new Set([
    new Map([['hello', new Set<any>(['b', 12])]]),
  ]),
);

const $array = createStore([
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

const $fn1 = createStore(function demo() {
  /* */
});
const $fn2 = createStore(() => 5);
const op = (a, b) => a + b;
const $fn3 = createStore(op);

const $setOfFns = createStore({
  ref: new Set([
    function demo() {
      return 0;
    },
    () => 5,
    (a, b) => a + b,
  ]),
});

const $args = createStore(
  (function(a, b, c, d) {
    return arguments; // eslint-disable-line prefer-rest-params
  })(1, 5, {}, () => 0),
);

const $error = createStore(new Error('random'));
const $errorType = createStore(new TypeError('random'));
class CustomError extends Error {
  demo = 123;
  hello = '';
  name = 'Custom';
  constructor(message: string) {
    super(message);
    this.hello = message;
  }
}
const $errorCustom = createStore(new CustomError('message'));

const $window = createStore(window);

const $uint = createStore(new Uint32Array([0, 5, 1, 2]));
const $weakSet = createStore(new WeakSet([{ a: 1 }, { b: 2 }, { c: 3 }]));

const $iterators = createStore([
  new Set(['a', 2, false, null, undefined, new Date()]).entries(),
  ['a', 2, false, null, undefined, new Date()].entries(),
  new Map<string, any>([
    ['a', 2],
    ['b', false],
  ]).entries(),
]);

const $regexp1 = createStore(/[\w\s]+/gi);
const $regexp2 = createStore(new RegExp('[\\w\\s]+', 'gi'));

const $promise = createStore(new Promise((resolve) => setTimeout(resolve, 5000)));
const $promiseResolved = createStore(Promise.resolve(1));
const $promiseRejected = createStore(Promise.reject(1));

const exampleFx = createEffect({
  handler() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  },
});

inspector.addEffect(exampleFx);
inspector.addEvent(event);
inspector.addEvent(just);
inspector.addStore($args);
inspector.addStore($array);
inspector.addStore($bar, { mapped: true });
inspector.addStore($bigint);
inspector.addStore($bool);
inspector.addStore($bool2);
inspector.addStore($date);
inspector.addStore($deep);
inspector.addStore($error);
inspector.addStore($errorCustom);
inspector.addStore($errorType);
inspector.addStore($example);
inspector.addStore($fn1);
inspector.addStore($fn2);
inspector.addStore($fn3);
inspector.addStore($foo);
inspector.addStore($iterators);
inspector.addStore($map);
inspector.addStore($mapInSet);
inspector.addStore($mapWrapped);
inspector.addStore($null);
inspector.addStore($number);
inspector.addStore($numberInf);
inspector.addStore($numberNot);
inspector.addStore($promise);
inspector.addStore($promiseRejected);
inspector.addStore($promiseResolved);
inspector.addStore($regexp1);
inspector.addStore($regexp2);
inspector.addStore($set);
inspector.addStore($setInMap);
inspector.addStore($setOfFns);
inspector.addStore($setWrapped);
inspector.addStore($symbol);
inspector.addStore($uint);
inspector.addStore($weakSet);
inspector.addStore($window);

inspector.createInspector({ visible: true });

setInterval(() => event(1), 2000);
setTimeout(() => just('hello'), 0);
setInterval(() => {
  exampleFx();
}, 1500);

$number.on(event, (counter) => counter + 1);
$date.on(event, () => new Date());
$foo.on(just, (s, n) => s + n);
