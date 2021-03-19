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

  ::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar);
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar:horizontal {
    height: 6px;
  }

  position: fixed;
  top: 64px;
  right: 64px;
  bottom: 64px;
  z-index: 1000;

  display: flex;
  flex-direction: row;
  width: 736px;
  min-width: 400px;
  max-width: 90%;

  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'PT Sans', Helvetica, Arial, sans-serif;
  line-height: 1.5;

  background-color: var(--bg);
  border-radius: 8px;
  box-shadow: var(--shadow);

  user-select: none;

  color-scheme: light dark;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;

  @media screen and (max-width: 700px) {
    max-width: 480px;
  }
`;

export const DragHandler = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 8px;
  margin-top: 48px;
  margin-bottom: 48px;
  margin-left: -10px;

  color: var(--primary);
  font-size: 14px;
  font-family: monospace;
  line-height: 6px;
  word-break: break-all;

  background-color: var(--bg);
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  cursor: col-resize;

  &:hover,
  &[data-active='true'] {
    color: var(--bg);

    background-color: var(--primary);
  }
`;

export const Section = styled.section`
  position: relative;

  display: flex;
  flex-flow: column;
  width: 100%;

  border-radius: inherit;
`;

export const SectionHead = styled.div`
  position: sticky;
  top: 0;
  right: 0;
  left: 0;

  display: flex;

  font-weight: 500;
  font-size: 16px;
  line-height: 20px;

  background-color: var(--tab-bg);
  border-bottom: 1px solid var(--border);
  border-radius: inherit;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  box-shadow: var(--tabs-shadow);
`;

export const SectionTab = styled.div`
  padding: 8px 16px;

  color: var(--tab-text);

  border-radius: inherit;
  border-top-right-radius: 0;
  cursor: pointer;

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
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;

  background-color: var(--content-bg);
`;

export const NodeList = styled.ul`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 0;
  padding: 0 0;
  overflow-x: auto;

  list-style-type: none;
`;

export const Node = styled.li`
  display: flex;
  margin: 0 0;
  padding: 6px 10px;

  font-size: 12px;
  line-height: 1.3;
`;

export const NodeTitle = styled.pre`
  display: flex;
  margin: 0 0;

  color: var(--code-var);
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
`;

export const NodeContent = styled.pre`
  margin: 0 0;

  color: var(--code-func);
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
`;

export const NodeButton = styled.button`
  margin: 0;
  margin-left: 1rem;
  padding: 0.2rem 0.4rem;

  color: var(--primary-text);
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;

  background-color: var(--primary);
  border: var(--primary);
  border-radius: 4px;

  &:focus {
    outline: 0;
    box-shadow: 0 0 0 1px var(--primary-dark), 0 0 3px 0 var(--primary-dark);
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

const symbol = styled.span`
  /* nothing here */
`;

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
  flex-shrink: 0;
  padding: 1rem;
`;

const Check = styled.input`
  /* nothing here */
`;

const Label = styled.label`
  display: flex;
  flex-shrink: 0;
  padding: 0 0.5rem;
`;

export const Input = styled.input`
  display: flex;
  flex-shrink: 0;
  margin: 0 0.5rem;
  padding: 0 0.5rem;

  border: 1px solid var(--border);
  border-radius: 0.2rem;

  &:focus {
    border-color: var(--primary);
    outline: 0;
    box-shadow: 0 0 0 1px var(--primary);
  }
`;

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
