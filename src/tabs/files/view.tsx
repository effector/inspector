import { useUnit } from 'effector-solid';
import { For, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import {
  $EffectFromFile,
  $EventsFromFile,
  $filesList,
  $filter,
  $filteredFiles,
  $selectedFile,
  $storesFromFile,
  fileCleanup,
  fileSelected,
  filterChanged,
} from './model';
import { StoreView } from '../../entities/stores';
import { EventView } from '../../entities/events';
import { Button } from '../../shared/ui/button';
import { Select, Search } from '../../shared/ui/forms';
import { EffectView } from '../../entities/effects';

export function Files() {
  const [selectedFile, storesFromFile, eventsFromFile, effectFromFile, filter] = useUnit([
    $selectedFile,
    $storesFromFile,
    $EventsFromFile,
    $EffectFromFile,
    $filter,
  ]);

  return (
    <Panel>
      <Show when={!selectedFile()}>
        <Column>
          <Title>Please, select file from the list or type the name</Title>
          <Search
            value={filter()}
            onInput={(e) => filterChanged(e.currentTarget.value)}
            placeholder="Type a part of the file name"
          ></Search>
          <FileList />
        </Column>
      </Show>

      <Show when={selectedFile()}>
        <div>
          <FileHeader>
            <Button onClick={() => fileCleanup()}>◀</Button>
            File: <FileSelector />
          </FileHeader>

          <NodeList>
            <For each={eventsFromFile()}>
              {(eventName) => <EventView name={eventName}></EventView>}
            </For>
          </NodeList>
          <NodeList>
            <For each={storesFromFile()}>
              {(storeName) => <StoreView name={storeName}></StoreView>}
            </For>
          </NodeList>

          <NodeList>
            <For each={effectFromFile()}>{(storeName) => <EffectView id={storeName} />}</For>
          </NodeList>
        </div>
      </Show>
    </Panel>
  );
}

function FileList() {
  const [filesList] = useUnit([$filteredFiles]);
  return (
    <>
      <List>
        <For each={filesList()}>
          {(fileName) => <FileItem onClick={() => fileSelected(fileName)}>{fileName}</FileItem>}
        </For>
      </List>
    </>
  );
}

function FileSelector() {
  const [filesList, selectedFile] = useUnit([$filesList, $selectedFile]);
  return (
    <Select value={selectedFile()} onChange={(e) => fileSelected(e.currentTarget.value)}>
      <For each={filesList()}>{(fileName) => <option value={fileName}>{fileName}</option>}</For>
    </Select>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.h4`
  margin-top: 0;
`;

const FileHeader = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FileItem = styled.button`
  color: var(--text);
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
  font-size: 14px;
  text-align: left;

  border: var(--primary);
  padding: 0.2rem 0.4rem;

  cursor: pointer;

  &:hover {
    background-color: var(--primary-dark) !important;
  }

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--primary-dark);
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 0;
  padding: 0 0;
  overflow-x: auto;
  align-items: stretch;

  list-style-type: none;

  :nth-child(2n) {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const Panel = styled.div`
  display: flex;
  flex-shrink: 0;
  padding: 1rem;
`;

const NodeList = styled.ul`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 0;
  padding: 0 0;
  overflow-x: auto;

  list-style-type: none;
`;
