import { createStore } from 'effector';

export const $fn1 = createStore(function demo() {
  /* */
});
export const $fn2 = createStore(() => 5);
const op = (a: number, b: number) => a + b;
export const $fn3 = createStore(op);
export const $setOfFns = createStore({
  ref: new Set([
    function demo() {
      return 0;
    },
    () => 5,
    (a: number, b: number) => a + b,
  ]),
});
export const $args = createStore(
  (function(a, b, c, d) {
    return arguments; // eslint-disable-line prefer-rest-params
  })(1, 5, {}, () => 0),
);
export const $error = createStore(new Error('random'));
export const $errorType = createStore(new TypeError('random'));

class CustomError extends Error {
  demo = 123;
  hello = '';
  name = 'Custom';

  constructor(message: string) {
    super(message);
    this.hello = message;
  }
}

export const $errorCustom = createStore(new CustomError('message'));
export const $window = createStore(window);
