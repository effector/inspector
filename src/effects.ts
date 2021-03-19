import { Store } from 'effector';
import { list, h, text } from 'forest';

import { EffectMeta } from './types.h';
import { NodeList, Node, NodeTitle, NodeContent, Content, ListItem } from './components';

export function Effects($effects: Store<Record<string, EffectMeta>>) {
  NodeList(() => {
    const $list = $effects.map((map) =>
      Object.entries(map).map(([sid, meta]) => ({ sid, ...meta })),
    );

    list({
      source: $list,
      key: 'sid',
      fields: ['name', 'inFlight'],
      fn({ fields: [$name, $inFlight] }) {
        Node(() => {
          NodeTitle({ text: [$name, ' '] });
          NodeContent(() => {
            h('span', () => {
              h('span', { text: [' {'] });
              ListItem(() => {
                Content.string({ text: `"inFlight": ` });
                Content.number({ text: $inFlight });
              });
              text`}`;
            });
          });
        });
      },
    });
  });
}
