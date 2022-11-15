import {useUnit} from 'effector-solid';

import {$options} from '../configs/options';

export function trimDomainFromName(name: string, domainName: string) {
  return name.replace(`${domainName}/`, '');
}

export function useTrimDomain(name: string): string {
  const options = useUnit($options);
  const trimDomain = options().trimDomain;
  return trimDomain ? trimDomainFromName(name, trimDomain) : name;
}
