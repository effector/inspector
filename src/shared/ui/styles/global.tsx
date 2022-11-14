import { styled } from "solid-styled-components";
import { ParentProps } from 'solid-js';

export function ThemeProvider(props: ParentProps<{}>) {
  return <Styles>{props.children}</Styles>
}

const Styles = styled("div")`
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
`;
