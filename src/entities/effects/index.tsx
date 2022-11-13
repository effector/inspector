import { useStoreMap } from 'effector-solid';

import { Unit, UnitContent, UnitName } from '../units';
import { Number, String } from '../../shared/ui/values';
import { useTrimDomain } from '../../shared/lib/domains';

import { $effects } from './model';

export function EffectView(props: { id: string }) {
  const effect = useStoreMap($effects, (effects) => effects[props.id]);
  const displayName = useTrimDomain(effect().name);

  return (
    <Unit>
      <UnitName>{displayName}: </UnitName>
      <UnitContent>
        <span>
          {'{'}
          <String>"inFlight": </String> <Number>{effect().inFlight}</Number>
          {'}'}
        </span>
      </UnitContent>
    </Unit>
  );
}
