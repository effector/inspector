import {styled} from 'solid-styled-components';

export function Checkbox(props: {value: boolean; onClick: () => void; label: string}) {
  return (
    <Label>
      <input type="checkbox" checked={props.value} onClick={() => props.onClick()} />
      {props.label}
    </Label>
  );
}

const Label = styled.label`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 0.5rem;
`;
