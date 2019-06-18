import React from 'react';
import styled from 'styled-components';
import { Link } from '@storybook/design-system';
import User from '../../composite/User';
import Subheading from './Subheading';

const SubheadingMessage = styled.div`
  margin-top: 16px;
`;

const ContributorsList = styled.div`
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
`;

const Contributor = styled.div`
  flex: 0 0 100%;

  &:nth-child(n + 2) {
    margin-top: 20px;
  }

  @media (min-width: 440px) {
    flex: 0 0 50%;

    &:nth-child(n + 2) {
      margin-top: 0;
    }

    &:nth-child(n + 3) {
      margin-top: 20px;
    }
  }
`;

const ContributorUser = styled(User)`
  align-items: center;

  > :first-child {
    height: 48px;
    width: 48px;
    line-height: 48px;
    min-width: 48px;
    align-self: flex-start;
  }
`;

const TwitterLink = props => <Link target="_blank" rel="noopener" tertiary {...props} />;

const contributors = [
  {
    src: 'https://avatars2.githubusercontent.com/u/14339707',
    name: 'Calaway',
    detail: <TwitterLink href="https://github.com/calaway">@calaway</TwitterLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/5649014',
    name: 'Carlos Sz',
    detail: <TwitterLink href="https://github.com/icarlossz">@icarlossz</TwitterLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/9523719',
    name: 'Kyle Holmberg',
    detail: <TwitterLink href="https://github.com/kylemh">@kylemh</TwitterLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/1593752',
    name: 'Carlos Vega',
    detail: <TwitterLink href="https://github.com/alterx">@alterx</TwitterLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/1475656',
    name: 'Luciano Guasco',
    detail: <TwitterLink href="https://github.com/luchux">@luchux</TwitterLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/480640',
    name: 'Alejandro Iglesias',
    detail: (
      <TwitterLink href="https://github.com/alejandroiglesias">@alejandroiglesias</TwitterLink>
    ),
  },
];

const Contributors = () => (
  <>
    <Subheading>Contributors</Subheading>

    <SubheadingMessage>
      Amazing contributors from around the world help draft, edit, and localize our free guides.
      They ensure Learn Storybook provides a quality learning experience for every developer.
    </SubheadingMessage>

    <ContributorsList>
      {contributors.map(contributor => (
        <Contributor key={contributor.src}>
          <ContributorUser {...contributor} />
        </Contributor>
      ))}
    </ContributorsList>
  </>
);

export default Contributors;
