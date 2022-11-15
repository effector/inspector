import {useTrimDomain} from '../../shared/lib/domains';
import {Unit, UnitName} from '../units';

export function EventView(props: {name: string}) {
  const displayName = useTrimDomain(props.name);
  return (
    <Unit>
      <UnitName>{displayName}</UnitName>
    </Unit>
  );
}
