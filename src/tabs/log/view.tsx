import { For, Show } from 'solid-js';
import { useUnit } from 'effector-solid';
import { styled } from 'solid-styled-components';

import { Button, PauseButton, RunButton } from '../../shared/ui/button';
import {
  $filteredLogs,
  $filterText,
  $isLogEnabled,
  $kinds,
  filterChanged,
  isLogEnabledToggle,
  logCleared,
  toggleKind,
} from './model';

import { ValueView } from '../../shared/ui/values';
import { UnitContent } from '../../entities/units';
import { Checkbox, Input } from '../../shared/ui/forms';

export function Logs() {
  const [isLogEnabled, logs, filterText, kinds] = useUnit([
    $isLogEnabled,
    $filteredLogs,
    $filterText,
    $kinds,
  ]);

  return (
    <>
      <Panel>
        Show:
        <Checkbox
          value={kinds().includes('event')}
          onClick={() => toggleKind('event')}
          label="Event"
        />
        <Checkbox
          value={kinds().includes('store')}
          onClick={() => toggleKind('store')}
          label="Store"
        />
        <Checkbox
          value={kinds().includes('effect')}
          onClick={() => toggleKind('effect')}
          label="Effect"
        />
        Filter:
        <Input value={filterText()} onInput={(e) => filterChanged(e.currentTarget.value)} />
        <Button onClick={() => logCleared()}>Clear</Button>
        <Show
          when={!isLogEnabled()}
          fallback={<PauseButton onClick={() => isLogEnabledToggle()} />}
        >
          <RunButton onClick={() => isLogEnabledToggle()} />
        </Show>
      </Panel>
      <LogList>
        <For each={logs()}>
          {(log) => {
            const textMatched = log.name.includes(filterText());

            if (!textMatched) {
              return null;
            }

            const time = log.datetime.toLocaleTimeString();
            return (
              <LogItem>
                <LogTitle>{time} ▸</LogTitle>
                <LogTitle>{log.kind}</LogTitle>
                <LogTitle> «{log.name}» </LogTitle>
                <UnitContent>
                  <ValueView value={log.payload} />
                </UnitContent>
              </LogItem>
            );
          }}
        </For>
      </LogList>
    </>
  );
}

const Panel = styled.div`
  display: flex;
  flex-shrink: 0;
  padding: 1rem;
`;

const LogTitle = styled.pre`
  display: flex;
  margin: 0 0;

  color: var(--code-var);
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
`;

const LogItem = styled.div`
  display: flex;
  margin: 0 0;
  padding: 6px 10px;

  font-size: 12px;
  line-height: 1.3;
`;

const LogList = styled.ul`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 0;
  padding: 0 0;
  overflow-x: auto;

  list-style-type: none;
`;
