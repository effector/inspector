import { Store } from 'effector';
import { list } from 'forest';
import { styled } from 'foliage';

import { EventMeta, Options } from './types.h';
import { Node, NodeContent, NodeList, NodeTitle } from './components';
import { ObjectView } from './object-view';
import { trimDomain } from './trim-domain';

export function Events($events: Store<Record<string, EventMeta>>, options: Options) {
  NodeList(() => {
    const $list = $events.map((map) =>
      Object.entries(map).map(([name, meta]) => ({ name, ...meta })),
    );

    list({
      source: $list,
      key: 'name',
      fields: ['name', 'history'],
      fn({ fields: [$name, $history] }) {
        Node(() => {
          NodeTitle({ text: [trimDomain($name, options), ' '] });

          // HistoryLine(() => {
          //   list($history, ({ store }) => {
          //     NodeContent(() => {
          //       ObjectView({ value: store });
          //     });
          //   });
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

const HistoryLine = styled.div`
  display: flex;
  flex-flow: row nowrap;

  :nth-child(2),
  :nth-child(3),
  :nth-child(4),
  :nth-child(5) {
    opacity: 0.8;
  }

  > :nth-child(n + 6) {
    opacity: 0.5;
  }

  > :not(:first-child) {
    margin-left: 0.5rem;
  }
`;
