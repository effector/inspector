import { Store } from 'effector';
import { list } from 'forest';

import { EventMeta } from './types.h';
import { NodeList, Node, NodeTitle, NodeContent } from './components';
import { ObjectView } from './object-view';

export function Events($events: Store<Record<string, EventMeta>>) {
  NodeList(() => {
    const $list = $events.map((map) =>
      Object.entries(map).map(([name, meta]) => ({ name, ...meta })),
    );

    list({
      source: $list,
      key: 'name',
      fields: ['name', 'lastTriggeredWith'],
      fn({ fields: [$name] }) {
        Node(() => {
          NodeTitle({ text: [$name, ' '] });
          // NodeContent(() => {
          //   h('span', { text: 'with: ' });
          //   ObjectView({ value: $lastTriggeredParams });
          // });
          // NodeButton({
          //   text: 'Logs',
          //   handler: { click: changeTab.prepend(() => 'logs') },
          // });
        });
      },
    });
  });
}
