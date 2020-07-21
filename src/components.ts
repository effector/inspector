import { styled } from 'foliage';

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
`;

export const SectionHead = styled.div`
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 2rem;
  padding: 0.5rem 1rem;
  position: sticky;
  left: 0;
  right: 0;
  top: 0;
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
  &::after {
    content: ': ';
    color: black;
  }
`;

export const NodeContent = styled.pre`
  margin: 0 0;
`;

export const ListItem = styled.span`
  display: inline-block;

  [data-opened='true'] > & {
    display: block;
    padding-left: 8px;
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

export const Content = {
  boolean,
  date,
  null: nullable,
  number,
  string,
  symbol,
};
