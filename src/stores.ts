import { Store } from 'effector';
import { list } from 'forest';

import { StoreMeta } from './types.h';
import { NodeList, Node, NodeTitle, NodeContent } from './components';
import { ObjectView } from './object-view';

export function Stores($stores: Store<Record<string, StoreMeta>>) {
  NodeList(() => {
    const $list = $stores.map((map) =>
      Object.entries(map).map(([name, meta]) => ({ name, ...meta })),
    );

    list({
      source: $list,
      key: 'name',
      fields: ['name', 'value'],
      fn({ fields: [$name, $value] }) {
        Node(() => {
          NodeTitle({ text: [$name, ': '] });
          NodeContent(() => {
            ObjectView({ value: $value });
          });
        });
      },
    });
  });
}
