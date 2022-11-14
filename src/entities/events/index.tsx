import { Unit, UnitName } from '../units';
import { useTrimDomain } from '../../shared/lib/domains';

export function EventView(props: { name: string }) {
  const displayName = useTrimDomain(props.name);
  return (
    <Unit>
      <UnitName>{displayName}</UnitName>
    </Unit>
  );
}
