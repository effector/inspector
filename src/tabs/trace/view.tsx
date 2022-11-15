import {useUnit} from 'effector-solid';
import {For, Match, Show, Switch} from 'solid-js';
import {styled} from 'solid-styled-components';

import {UnitContent} from '../../entities/units';
import {Button, PauseButton, RunButton} from '../../shared/ui/button';
import {ValueView} from '../../shared/ui/values';
import {TraceEffectRun, TraceEventTrigger, TraceStoreChange} from '../../types.h';

import {$isTraceEnabled, $traces, traceCleared, traceEnableToggled} from './model';

export function Trace() {
  const [isTraceEnabled, traces] = useUnit([$isTraceEnabled, $traces]);

  return (
    <>
      <Actions>
        <Button onClick={() => traceCleared()}>Clear</Button>
        <Show
          when={!isTraceEnabled()}
          fallback={<PauseButton onClick={() => traceEnableToggled()} />}
        >
          <RunButton onClick={() => traceEnableToggled()} />
        </Show>
      </Actions>
      <TraceList>
        <For each={traces()}>
          {(trace) => (
            <>
              <TraceTitle>
                <ValueView value={new Date(trace.time)} />
              </TraceTitle>
              <For each={trace.traces}>
                {(line) => (
                  <Node>
                    <Switch>
                      <Match when={line.type === 'event'}>
                        <TraceEvent trace={line as TraceEventTrigger} />
                      </Match>
                      <Match when={line.type === 'store'}>
                        <TraceStore trace={line as TraceStoreChange} />
                      </Match>
                      <Match when={line.type === 'effect'}>
                        <TraceEffect trace={line as TraceEffectRun} />
                      </Match>
                    </Switch>
                  </Node>
                )}
              </For>
            </>
          )}
        </For>
      </TraceList>
    </>
  );
}

function TraceEvent(props: {trace: TraceEventTrigger}) {
  return (
    <>
      <TraceLine>
        <span>
          Event<span class="event"> {props.trace.name} </span>triggered with
        </span>
      </TraceLine>

      <UnitContent>
        <ValueView value={props.trace.argument}></ValueView>
      </UnitContent>
    </>
  );
}

function TraceStore(props: {trace: TraceStoreChange}) {
  return (
    <>
      <TraceLine>
        <span>
          Store <span class="store"> {props.trace.name} </span> changed from
        </span>
      </TraceLine>

      <UnitContent>
        <ValueView value={props.trace.before}></ValueView>
      </UnitContent>
      <TraceLine>to</TraceLine>
      <UnitContent>
        <ValueView value={props.trace.current}></ValueView>
      </UnitContent>
    </>
  );
}

function TraceEffect(props: {trace: TraceEffectRun}) {
  return (
    <>
      <TraceLine>
        <span>
          Effect <span class="effect"> {props.trace.name} </span> triggered with
        </span>
      </TraceLine>
      <UnitContent>
        <ValueView value={props.trace.argument}></ValueView>
      </UnitContent>
    </>
  );
}

const Actions = styled.div`
  display: flex;
  flex-shrink: 0;
  padding: 1rem;
`;

const TraceList = styled.ul`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 0;
  padding: 0 0;
  overflow-x: auto;

  list-style-type: none;
`;

const TraceTitle = styled.div`
  font-size: 0.8rem;
  margin-top: 1rem;
  margin-left: 0.5rem;
`;

const TraceLine = styled.div`
  display: flex;
  flex-shrink: 0;
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
  margin: 0 0.5rem;

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

const Node = styled.li`
  display: flex;
  margin: 0 0;
  padding: 6px 10px;

  font-size: 12px;
  line-height: 1.3;
`;
