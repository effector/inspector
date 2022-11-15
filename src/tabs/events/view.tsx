import {useUnit} from 'effector-solid';
import {For} from 'solid-js';

import {EventView} from '../../entities/events';
import {$events} from '../../entities/events/model';

const $eventsNames = $events.map((events) => Object.keys(events));

export function Events() {
  const eventsNames = useUnit($eventsNames);

  return (
    <>
      <For each={eventsNames()}>{(name) => <EventView name={name}></EventView>}</For>
    </>
  );
}
