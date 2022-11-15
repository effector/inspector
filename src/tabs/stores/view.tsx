import {combine, createEvent, createStore} from 'effector';
import {useUnit} from 'effector-solid';
import {For} from 'solid-js';
import {styled} from 'solid-styled-components';

import {StoreView} from '../../entities/stores';
import {$stores} from '../../entities/stores/model';
import {Search} from '../../shared/ui/forms';

const $list = $stores.map((map) => Object.entries(map).map(([name, meta]) => ({name, ...meta})));

const filterChanged = createEvent<string>();
const $filter = createStore('', {serialize: 'ignore'});
$filter.on(filterChanged, (_, filter) => filter);

const $filteredList = combine($list, $filter, (list, searchWord) =>
  list.filter((item) => item.name.includes(searchWord)),
);

const searchChanged = filterChanged.prepend(
  (e: Event | KeyboardEvent) => (e.currentTarget as HTMLInputElement)?.value,
);

const $filteredName = $filteredList.map((list) => list.map((item) => item.name));

export function Stores() {
  const [stores, filter] = useUnit([$filteredName, $filter]);
  return (
    <>
      <Header>
        <Search value={filter()} onInput={searchChanged} placeholder="Type a part of store name" />
      </Header>
      <For each={stores()}>{(store) => <StoreView name={store} />}</For>
    </>
  );
}

const Header = styled.div`
  padding: 6px;

  ${Search.class} {
    width: 100%;
    box-sizing: border-box;
    margin: 0;
  }
`;
