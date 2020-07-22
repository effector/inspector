import { Store } from 'effector';
import { list } from 'forest';

import { LogMeta } from './types.h';
import { NodeList, Node, NodeTitle, NodeContent } from './components';
import { ObjectView } from './object-view';

export function Logs($logs: Store<LogMeta[]>) {
  NodeList(() => {
    list({
      source: $logs,
      key: 'id',
      fields: ['kind', 'name', 'payload', 'datetime'],
      fn({ fields: [$kind, $name, $payload, $datetime] }) {
        Node(() => {
          const $iso = $datetime.map((date) => date.toISOString());
          const $time = $datetime.map((date) => date.toLocaleTimeString());

          NodeTitle({
            text: [$time, ' » ', $kind as Store<string>, ' "', $name, '" '],
            attr: { title: $iso },
          });
          NodeContent(() => {
            ObjectView({ value: $payload });
          });
        });
      },
    });
  });
}
