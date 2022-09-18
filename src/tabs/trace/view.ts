import { h, list, remap, text, variant } from 'forest';

import { styled } from 'foliage';
import {
  Node,
  NodeButton,
  NodeContent,
  NodeList,
  Panel,
  PauseButton,
  RunButton
} from '../../components';
import { ObjectView } from '../../object-view';
import {
  $isTraceEnabled,
  $traces,
  traceCleared,
  traceEnableToggled
} from "./model";

export function Traces() {

  Panel(() => {
    NodeButton({
      text: 'Clear',
      handler: { click: traceCleared },
      attr: { title: 'Press CTRL+L to clear logs' },
    });


    RunButton({
      visible: $isTraceEnabled.map(value => !value),
      handler: { click: traceEnableToggled }
    })
    PauseButton({
      visible: $isTraceEnabled,
      handler: { click: traceEnableToggled },
    })
  });

  NodeList(() => {
    list({
      source: $traces,
      key: 'time',
      fn({ store: trace }) {
        TraceTitle(() => {
          ObjectView({ value: remap(trace, 'time').map((time) => new Date(time)) });
        });
        TraceList(() => {
          list(remap(trace, 'traces'), ({ store: line }) => {
            variant({
              source: line,
              key: 'type',
              cases: {
                event({ store }) {
                  Node({
                    fn() {
                      TraceLine(() => {
                        text`Event "`;
                        h('span', {
                          attr: { class: 'event' },
                          text: remap(store, 'name'),
                        });
                        text`" triggered with `;
                      });
                      NodeContent(() => ObjectView({ value: remap(store, 'argument') }));
                    },
                  });
                },
                store({ store }) {
                  Node({
                    fn() {
                      TraceLine(() => {
                        text`Store "`;
                        h('span', {
                          attr: { class: 'store' },
                          text: remap(store, 'name'),
                        });
                        text`" changed from `;
                      });
                      NodeContent(() => ObjectView({ value: remap(store, 'before') }));
                      TraceLine(() => text` to `);
                      NodeContent(() => ObjectView({ value: remap(store, 'current') }));
                    },
                  });
                },
                effect({ store }) {
                  Node({
                    fn() {
                      TraceLine(() => {
                        text`Effect "`;
                        h('span', {
                          attr: { class: 'effect' },
                          text: remap(store, 'name'),
                        });
                        text`" triggered with `;
                      });
                      NodeContent(() => ObjectView({ value: remap(store, 'argument') }));
                    },
                  });
                },
              },
            });
          });
        });
      },
    });
  });
}

const TraceList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.25rem 0.5rem;
`;

const TraceTitle = styled.div`
  font-size: 0.8rem;
  margin-top: 1rem;
  margin-left: 0.5rem;
`;

const TraceLine = styled.div`
  display: flex;
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
  margin: 0 0.5rem;
  flex-shrink: 0;

  .event {
    color: var(--code-var);
  }

  .store {
    color: var(--code-string);
  }

  .effect {
    color: var(--code-number);
  }
`;
