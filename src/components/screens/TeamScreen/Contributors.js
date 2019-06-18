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

const SocialLink = props => <Link target="_blank" rel="noopener" tertiary {...props} />;

const contributors = [
  {
    src: 'https://avatars2.githubusercontent.com/u/22988955',
    name: 'jonniebigodes',
    detail: <SocialLink href="https://github.com/jonniebigodes">@jonniebigodes</SocialLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/1593752',
    name: 'Carlos Vega',
    detail: <SocialLink href="https://twitter.com/__el_Negro">@__el_Negro</SocialLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/1474548',
    name: 'Daniel Duan',
    detail: <SocialLink href="https://twitter.com/danduan">@danduan</SocialLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/20272484',
    name: 'chinanf-boy',
    detail: <SocialLink href="https://github.com/chinanf-boy">@chinanf-boy</SocialLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/5649014',
    name: 'Carlos Iván Suarez',
    detail: <SocialLink href="https://twitter.com/icarlossz">@icarlossz</SocialLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/9523719',
    name: 'Kyle Holmberg',
    detail: <SocialLink href="https://twitter.com/kylemh_">@kylemh_</SocialLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/1475656',
    name: 'Luciano M. Guasco',
    detail: <SocialLink href="https://twitter.com/luchux">@luchux</SocialLink>,
  },
  {
    src: 'https://avatars2.githubusercontent.com/u/3035355',
    name: 'Kyle Suss',
    detail: <SocialLink href="https://github.com/kylesuss">@kylesuss</SocialLink>,
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
