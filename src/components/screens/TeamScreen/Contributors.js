import React from 'react';
import styled from 'styled-components';
import { Link } from '@storybook/design-system';
import User from '../../molecules/User';
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

const TwitterLink = props => <Link target="_blank" tertiary {...props} />;

const contributors = [
  {
    src: 'https://avatars2.githubusercontent.com/u/263385',
    name: 'Dominic Nguyen',
    detail: <TwitterLink href="https://twitter.com/domyen">@domyen</TwitterLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/263386',
    name: 'Dominic Nguyen',
    detail: <TwitterLink href="https://twitter.com/domyen">@domyen</TwitterLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/263387',
    name: 'Dominic Nguyen',
    detail: <TwitterLink href="https://twitter.com/domyen">@domyen</TwitterLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/263388',
    name: 'Dominic Nguyen',
    detail: <TwitterLink href="https://twitter.com/domyen">@domyen</TwitterLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/263389',
    name: 'Dominic Nguyen',
    detail: <TwitterLink href="https://twitter.com/domyen">@domyen</TwitterLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/263390',
    name: 'Dominic Nguyen',
    detail: <TwitterLink href="https://twitter.com/domyen">@domyen</TwitterLink>,
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
