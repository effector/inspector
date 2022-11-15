import {styled} from 'solid-styled-components';

export const Button = styled.button`
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

  &:hover {
    background-color: var(--primary-dark);
  }
`;
const playSymbol = String.fromCharCode(parseInt('25B6', 16));
const pauseSymbol = String.fromCharCode(parseInt('25A0', 16));

export function RunButton(props: {onClick: () => void}) {
  return <Button onClick={props.onClick}>{playSymbol} Run</Button>;
}

export function PauseButton(props: {onClick: () => void}) {
  return <Button onClick={props.onClick}>{pauseSymbol} Pause</Button>;
}
