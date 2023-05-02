import {createDomain, createEffect, createEvent, createStore} from 'effector';

import * as inspector from '../src';
import {
  $args,
  $error,
  $errorCustom,
  $errorType,
  $fn1,
  $fn2,
  $fn3,
  $setOfFns,
  $window, // @ts-ignore
} from './another';

const emptyEvent = createEvent();
const event = createEvent<{count: number}>();
const just = createEvent<string>();

const $foo = createStore('hello');
const $bar = $foo.map((foo) => foo.length);

const $deep = createStore({
  demo: {baz: 1, baf: 'hello', naf: false},
});

const veryRootDomain = createDomain();

const anotherInsideDeepDarkDomainForRoot = veryRootDomain.createDomain();

const $number = anotherInsideDeepDarkDomainForRoot.createStore(0);
const $anotherNumber = createStore(0);
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

const $setInMap = createStore(new Map([['hello', new Set<any>(['a', 2, false, null, undefined])]]));

const $mapInSet = createStore(new Set([new Map([['hello', new Set<any>(['b', 12])]])]));

const $array = createStore([
  false,
  5,
  900e50,
  'hello',
  BigInt(720587) * BigInt(44),
  new Map([['hello', new Set<any>(['a', 2, false, null, undefined])]]),
  new Set([new Map([['hello', new Set<any>(['b', 12])]])]),
  {
    ref: new Set(['a', 2, false, null, undefined, new Date()]),
  },
]);

const $uint = createStore(new Uint32Array([0, 5, 1, 2]));
const $weakSet = createStore(new WeakSet([{a: 1}, {b: 2}, {c: 3}]));

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

const cdFirst = {};
// @ts-ignore
cdFirst.cdFirst = cdFirst;

const $circularObject = createStore(cdFirst);
const circular = createEvent<Record<string, any>>();

const exampleFx = createEffect({
  handler() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  },
});

const exampleFx2 = createEffect({
  handler() {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  },
});

const trimDomain = createDomain();

const trimDomainStore = trimDomain.createStore('No Domain in name');
const trimDomainEvent = trimDomain.createEvent();
const trimDomainEffect = trimDomain.createEffect();

inspector.attachInspector(domain);
inspector.attachInspector([
  exampleFx,
  exampleFx2,
  emptyEvent,
  event,
  just,
  $args,
  $array,
  $bar,
  $bigint,
  $bool,
  $bool2,
  $date,
  $deep,
  $error,
  $errorCustom,
  $errorType,
  $fn1,
  $fn2,
  $fn3,
  $foo,
  $iterators,
  $map,
  $mapInSet,
  $mapWrapped,
  $null,
  $number,
  $numberInf,
  $numberNot,
  $promise,
  $promiseRejected,
  $promiseResolved,
  $regexp1,
  $regexp2,
  $set,
  $setInMap,
  $setOfFns,
  $setWrapped,
  $symbol,
  $uint,
  $weakSet,
  $window,
  $anotherNumber,
  $circularObject,
  trimDomainStore,
  trimDomainEvent,
  trimDomainEffect,
]);

inspector.createInspector({visible: true, trimDomain: 'trimDomain'});
let incrementor = 0;
setInterval(() => emptyEvent(), 2000);
setInterval(() => event({count: incrementor++}), 2000);
setTimeout(() => just('hello'), 0);
setInterval(() => {
  exampleFx();
}, 1500);

setInterval(() => {
  exampleFx2();
}, 4000);
setInterval(() => {
  exampleFx2();
}, 3500);
setTimeout(() => {
  const cdSecond = {};
  // @ts-ignore
  cdSecond.cdSecond = cdSecond;

  circular(cdSecond);
}, 2000)

$anotherNumber.on(event, (counter) => counter + 1);
$date.on(event, () => new Date());
$foo.on(just, (s, n) => s + n);
$example.on(event, () => Math.random() * 100);
$circularObject.on(circular, (value, nextValue) => ({
  ...value,
  ...nextValue,
}));
