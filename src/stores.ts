import { Store } from 'effector';
import { list } from 'forest';

import { Options, StoreMeta } from './types.h';
import { Node, NodeContent, NodeList, NodeTitle } from './components';
import { ObjectView } from './object-view';
import { trimDomain } from './trim-domain';

export function Stores($stores: Store<Record<string, StoreMeta>>, options: Options) {
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
          NodeTitle({ text: [trimDomain($name, options), ': '] });
          NodeContent(() => {
            ObjectView({ value: $value });
          });
        });
      },
    });
  });
}
