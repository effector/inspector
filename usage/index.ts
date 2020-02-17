import * as effector from 'effector';
import * as inspector from '../src';

const $foo = effector.createStore('hello');
const $bar = $foo.map((foo) => foo.length);

const $deep = effector.createStore({
  demo: { baz: 1, baf: 'hello', naf: false },
});

const $bool = effector.createStore(false);
const $bool2 = effector.createStore(true);
const $null = effector.createStore(null);
const $date = effector.createStore(new Date());
const $symbol = effector.createStore(Symbol.asyncIterator);

inspector.addStore($foo);
inspector.addStore($bar);
inspector.addStore($deep);
inspector.addStore($bool);
inspector.addStore($bool2);
inspector.addStore($null);
inspector.addStore($date);
inspector.addStore($symbol);

inspector.createInspector({ visible: true });
