import {createSignal, For, Show} from 'solid-js';
import {styled} from 'solid-styled-components';

const typeRegexp = /\[object ([\w\s]+)\]/;

export function getType(value: unknown): 'unknown' | string {
  const typeString = Object.prototype.toString.call(value);
  const match = typeRegexp.exec(typeString);
  return match ? match[1] : 'unknown';
}

export const Boolean = styled.span`
  color: var(--code-bool);
  font-style: italic;
`;

export const Number = styled.span`
  color: var(--code-number);
`;

export const String = styled.span`
  color: var(--code-string);
`;

export const Keyword = styled.span`
  color: var(--code-number);
  font-weight: bold;
`;

export const Date = styled.span`
  color: var(--code-date);
`;

export const Symbol = styled.span`
  /* nothing here */
`;

export const Regexp = styled.span`
  color: var(--code-regexp);
`;

export const ListItem = styled.span`
  display: inline-block;

  [data-opened='true'] > & {
    display: block;
    padding-left: 8px;
  }

  &[data-hidden='folded'] {
    display: none;

    [data-opened='true'] > & {
      display: block;
    }
  }

  &[data-hidden='expanded'] {
    display: inline-block;

    [data-opened='true'] > & {
      display: none;
    }
  }

  &:not(:last-child)::after {
    content: ', ';
  }
`;

export function ValueView(props: {value: unknown; opened?: boolean; level?: number}) {
  const type = getType(props.value);
  const level = props.level ?? 0;

  const [opened, setOpened] = createSignal(false);

  const localOpened = () =>
    props.opened === undefined || props.opened === true ? opened() : false;
  const openable = () => props.opened === undefined || props.opened === true;

  function toggleOpened() {
    setOpened(!opened());
  }

  const renderArrayLikeObject = (title: string) => (value: []) => {
    return (
      <>
        <span data-opened={localOpened()}>
          <Openedable data-active={openable()} onClick={toggleOpened}>
            {title}
          </Openedable>
          {' ['}
          <For each={[...value]}>
            {(item) => (
              <ListItem>
                <ValueView value={item} opened={localOpened()} level={level + 1} />
              </ListItem>
            )}
          </For>
          ]
        </span>
      </>
    );
  };

  const mapByTypes = {
    String: (value: string) => <String>"{value}"</String>,
    Number: (value: number) => <Number>{value}</Number>,
    Boolean: () => <Boolean>{JSON.stringify(props.value)}</Boolean>,
    Null: () => <Keyword>null</Keyword>,
    Undefined: () => <Keyword>undefined</Keyword>,
    Symbol: (value: number) => <Number>{value.toString()}</Number>,
    BigInt: (value: BigInt) => <Number>{value.toString()}n</Number>,
    RegExp: (value: RegExp) => <Regexp>{`/${value.source}/${value.flags}`}</Regexp>,
    Function: (value: Function) => (
      <>
        <span>function</span>
        <Keyword>{`${value.name ? ` ${value.name} ` : ''}`}</Keyword>
        <span>()</span>
      </>
    ),
    AsyncFunction: (value: Function) => (
      <>
        <span>async function</span>
        <Keyword>{`${value.name ? ` ${value.name} ` : ''}`}</Keyword>
        <span>()</span>
      </>
    ),
    Date: (value: Date) => <Date>{value.toISOString?.()}</Date>,
    Array: renderArrayLikeObject('Array'),
    Arguments: renderArrayLikeObject('Arguments'),
    Set: renderArrayLikeObject('Set'),
    Map: (value: Map<unknown, unknown>) => {
      return (
        <>
          <span data-opened={localOpened()}>
            <Openedable data-active={openable()} onClick={toggleOpened}>
              Map
            </Openedable>
            {' {'}
            <For each={[...Object(value)]}>
              {([key, mapValue]) => (
                <ListItem>
                  <String>"{key}"</String>
                  <span>{` => `}</span>
                  <ValueView value={mapValue} opened={localOpened()} level={level + 1} />
                </ListItem>
              )}
            </For>
            {'}'}
          </span>
        </>
      );
    },
    Error: (error: Error) => (
      <span data-opened={localOpened()}>
        <Openedable data-active={openable()} onClick={toggleOpened}>
          {error.name}
        </Openedable>
        {' {'}
        <ListItem data-hidden="expanded">
          <String>"message" :</String>
          "<ValueView value={error.message} level={level + 1} />"
        </ListItem>
        <ListItem data-hidden="folded">
          <String>"stack" :</String>
          <ValueView value={error.stack} level={level + 1} />
        </ListItem>
        <For each={Object.entries(error)}>
          {([key, objValue], index) => (
            <ListItem>
              <String>"{key}"</String>:{' '}
              <ValueView value={objValue} opened={localOpened()} level={level + 1} />
            </ListItem>
          )}
        </For>
        {'}'}
      </span>
    ),
    Window: () => <span>Window {'{...}'}</span>,
    __default: (value: object) => (
      <>
        <span data-opened={localOpened()}>
          <Openedable
            data-active={openable() && Object.entries(value).length > 0}
            onClick={toggleOpened}
          >
            {type}
          </Openedable>
          {' {'}
          <Show
            when={level < 10 || opened()}
            fallback={
              <Openedable data-active={openable()} onClick={toggleOpened}>
                ...
              </Openedable>
            }
          >
            <For each={Object.entries(value)}>
              {([key, objValue]) => (
                <ListItem>
                  <String>"{key}"</String>:{' '}
                  <ValueView value={objValue} opened={localOpened()} level={level + 1} />
                </ListItem>
              )}
            </For>
          </Show>
          {'}'}
        </span>
      </>
    ),
  };

  // @ts-ignore
  if (mapByTypes[type]) {
    // @ts-ignore
    return <>{mapByTypes[type](props.value)}</>;
  }

  return <>{mapByTypes['__default'](props.value as object)}</>;
}

const Openedable = styled.span`
  &[data-active='true'] {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;
