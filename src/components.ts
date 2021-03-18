import { styled, Spec } from 'foliage';
import { spec } from 'forest';

export const Container = styled.div`
  --primary: #ff8c00;
  --primary-light: #ffb152;
  --primary-dark: #c86e00;
  --primary-text: #fff;

  --text: #404040;
  --border: #dadada;
  --shadow: 0 4px 20px 4px rgba(0, 0, 0, 0.1);

  --scrollbar: var(--primary-light);

  --tabs-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);

  --tab-bg: #fff;
  --tab-text: #606060;
  --tab-text-active: var(--primary);
  --tab-shadow-active: var(--primary);

  --content-bg: #f9f9f9;

  --code-var: #ff8c00;
  --code-func: #249ec6;
  --code-string: #00a153;
  --code-bool: #ff62d3;
  --code-number: #7a70f3;
  --code-date: #333;
  --code-regexp: #95b70e;

  @media (prefers-color-scheme: dark) {
    --text: #ddd;
    --border: #111;
    --shadow: 0 4px 20px 4px rgba(0, 0, 0, 0.1);

    --scrollbar: var(--primary);

    --tabs-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    --tab-bg: #444;
    --tab-text: #ddd;
    --tab-text-active: var(--primary);
    --tab-shadow-active: var(--primary);

    --content-bg: #333;

    --code-var: #ff8c00;
    --code-func: #a5d4e2;
    --code-string: #2cb472;
    --code-bool: #ff62d3;
    --code-number: #9990ff;
    --code-date: #fff;
    --code-regexp: #e5ff7e;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar:horizontal {
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar);
  }

  background-color: var(--bg);
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  color: var(--text);
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
    border-left: 1px solid var(--border);
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
  background-color: var(--tab-bg);
  border-bottom: 1px solid var(--border);
  border-radius: inherit;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow: var(--tabs-shadow);
  display: flex;
  font-size: 1.03rem;
  font-weight: 500;
  line-height: 2rem;
  position: sticky;
  left: 0;
  right: 0;
  top: 0;
`;

export const SectionTab = styled.div`
  color: var(--tab-text);
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: inherit;
  border-top-right-radius: 0;

  &:hover {
    box-shadow: inset 0 -2px 0 0 var(--tab-shadow-active);
  }

  &:not(:first-child) {
    border-top-left-radius: 0;
  }

  &[data-active='true'] {
    color: var(--tab-text-active);
    box-shadow: inset 0 -2px 0 0 var(--tab-shadow-active);
  }
`;

export const SectionContent = styled.div`
  background-color: var(--content-bg);
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
  font-size: 0.95rem;
  line-height: 1.3;
  padding: 0.5rem 1rem;
  margin: 0 0;
`;

export const NodeTitle = styled.pre`
  display: flex;
  margin: 0 0;
  color: var(--code-var);
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
`;

export const NodeContent = styled.pre`
  color: var(--code-func);
  margin: 0 0;
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
`;

export const NodeButton = styled.button`
  background-color: var(--primary);
  color: var(--primary-text);
  border: var(--primary);
  padding: 0.2rem 0.4rem;
  margin: 0;
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
  border-radius: 4px;
  margin-left: 1rem;

  &:focus {
    box-shadow: 0 0 0 1px var(--primary-dark), 0 0 3px 0 var(--primary-dark);
    outline: 0;
  }
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
  color: var(--code-bool);
  font-style: italic;
`;

const number = styled.span`
  color: var(--code-number);
`;

const string = styled.span`
  color: var(--code-string);
`;

const nullable = styled.span`
  color: var(--code-number);
  font-weight: bold;
`;

const date = styled.span`
  color: var(--code-date);
`;

const symbol = styled.span``;

const regexp = styled.span`
  color: var(--code-regexp);
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
  border: 1px solid var(--border);
  border-radius: 0.2rem;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 1px var(--primary);
    outline: 0;
  }
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
