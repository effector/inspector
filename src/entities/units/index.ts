import { styled } from 'solid-styled-components';

export const UnitName = styled.pre`
  display: flex;
  margin: 0 0;

  color: var(--code-var);
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
`;

export const UnitContent = styled.pre`
  margin: 0 0;
  color: var(--code-func);
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
`;

export const Unit = styled.li`
  display: flex;
  margin: 0 0;
  padding: 6px 10px;

  font-size: 12px;
  line-height: 1.3;
`;
