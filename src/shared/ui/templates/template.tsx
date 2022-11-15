import {JSX} from 'solid-js';
import {styled} from 'solid-styled-components';

export function TabTemplate(props: {header: JSX.Element; content: JSX.Element}) {
  return (
    <TabTemplateRoot>
      <Header>{props.header}</Header>
      <Content>{props.content}</Content>
    </TabTemplateRoot>
  );
}

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  width: fit-content;
  min-width: 100%;
  box-sizing: border-box;

  background-color: var(--content-bg);

  position: sticky;
  top: 0;
`;

export const Content = styled.section`
  flex: 1;
  width: max-content;
`;

export const TabTemplateRoot = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
