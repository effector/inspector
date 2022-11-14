import { useUnit } from 'effector-solid';
import { For } from 'solid-js';

import { EffectView } from '../../entities/effects';
import { $effects } from '../../entities/effects/model';

const $effectsIds = $effects.map((effects) => Object.keys(effects));

export function Effect() {
  const effectsIds = useUnit($effectsIds);

  return (
    <>
      <For each={effectsIds()}>{(id) => <EffectView id={id} />}</For>
    </>
  );
}
