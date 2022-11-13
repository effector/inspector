import { styled } from 'solid-styled-components';

export { Checkbox } from './checkbox';

export const Input = styled.input`
  display: flex;
  flex-shrink: 0;
  padding: 0 0.5rem;

  border: 1px solid var(--border);
  border-radius: 0.2rem;

  &:focus {
    border-color: var(--primary);
    outline: 0;
    box-shadow: 0 0 0 1px var(--primary);
  }
`;

export const Search = styled(Input)`
  line-height: 2rem;
`;

export const Select = styled.select``;
