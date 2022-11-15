import {useStoreMap} from 'effector-solid';

import {useTrimDomain} from '../../shared/lib/domains';
import {ValueView} from '../../shared/ui/values';
import {Unit, UnitContent, UnitName} from '../units';

import {$stores} from './model';

export function StoreView(props: {name: string}) {
  const store = useStoreMap($stores, (stores) => stores[props.name]);
  const displayName = useTrimDomain(props.name);

  return (
    <Unit>
      <UnitName>{displayName}: </UnitName>
      <UnitContent>
        <ValueView value={store().value} />
      </UnitContent>
    </Unit>
  );
}
