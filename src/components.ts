import { styled, Spec } from 'foliage';
import { spec } from 'forest';

export const Container = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 14.5px 5.2px -10px rgba(0, 0, 0, 0.038),
    0 23.9px 16.6px -10px rgba(0, 0, 0, 0.057),
    0 64px 118px -10px rgba(0, 0, 0, 0.08), 0 0 10px -3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: row;
  bottom: 3rem;
  right: 3rem;
  top: 3rem;
  position: fixed;
  z-index: 1000;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'PT Sans', Helvetica, Arial, sans-serif;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  line-height: 1.5;
  width: 100%;
  max-width: 46rem;

  & > * + * {
    border-left: 1px solid rgba(0, 0, 0, 0.08);
  }

  @media screen and (max-width: 700px) {
    max-width: 30rem;
  }
`;

export const Section = styled.section`
  display: flex;
  flex-flow: column;
  position: relative;
  width: 100%;
  border-radius: inherit;
`;

export const SectionHead = styled.div`
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: inherit;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  display: flex;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 2rem;
  position: sticky;
  left: 0;
  right: 0;
  top: 0;
`;

export const SectionTab = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: inherit;
  border-top-right-radius: 0;

  &:hover {
    box-shadow: inset 0 -2px 0 0 mediumvioletred;
  }

  &:not(:first-child) {
    border-top-left-radius: 0;
  }

  &[data-active='true'] {
    background: linear-gradient(rgba(199, 21, 133, 0), rgba(199, 21, 133, 0.1));
  }
`;

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
`;

export const NodeList = styled.ul`
  list-style-type: none;
  margin: 0 0;
  padding: 0 0;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const Node = styled.li`
  display: flex;
  padding: 0.5rem 1rem;
  margin: 0 0;
`;

export const NodeTitle = styled.pre`
  display: flex;
  margin: 0 0;
  color: darkred;
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
`;

export const NodeContent = styled.pre`
  margin: 0 0;
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
`;

export const NodeButton = styled.button`
  background-color: transparent;
  border: 1px solid rgba(0, 0, 0, 0.4);
  padding: 0.2rem 0.4rem;
  margin: 0;
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
  border-radius: 6px;
  margin-left: 1rem;
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

const boolean = styled.span`
  color: mediumvioletred;
  font-style: italic;
`;

const number = styled.span`
  color: blue;
`;

const string = styled.span`
  color: green;
`;

const nullable = styled.span`
  color: blue;
  font-weight: bold;
`;

const date = styled.span`
  color: olive;
`;

const symbol = styled.span``;

const regexp = styled.span`
  color: orangered;
`;

export const Content = {
  boolean,
  date,
  keyword: nullable,
  number,
  string,
  symbol,
  regexp,
};

export const Panel = styled.div`
  display: flex;
  padding: 1rem;
`;

const Check = styled.input``;

const Label = styled.label`
  padding: 0 0.5rem;
`;

export const Input = styled.input`
  padding: 0 0.5rem;
  margin: 0 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 0.2rem;
`;

type Cb = () => void;

export const Checkbox = (arg: Spec & { title: string }) => {
  const { title, ...config } = arg;

  Label(() => {
    Check(() => {
      spec({ attr: { type: 'checkbox' } });
      spec(config);
    });
    spec({ text: title });
  });
};
