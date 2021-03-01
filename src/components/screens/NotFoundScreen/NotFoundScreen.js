import React from 'react';
import styled from 'styled-components';
import { Link, styles } from '@storybook/design-system';
import Feature from './Feature';
import FeaturesLayout from './FeaturesLayout';
import PageTitle from './PageTitle';
import GitHubSVG from '../../../../static/github.svg';
import DiscordSVG from '../../../../static/discord.svg';
// eslint-disable-next-line
import siteMetadata from '../../../../site-metadata';

const { breakpoint } = styles;

const Wrapper = styled.div`
  margin-top: 86px;
`;

const Features = styled(FeaturesLayout)`
  @media (min-width: ${breakpoint * 1}px) {
    margin-bottom: 5rem;
  }
`;

const NotFoundScreen = () => (
  <Wrapper>
    <PageTitle
      heading="404"
      title="Yikes, this is embarassing"
      desc="Try double-checking the link or going back."
      color="purple"
    />
    <Features columns={2}>
      <Feature
        image={<img src={GitHubSVG} alt="GitHub" />}
        title="Report an issue on GitHub"
        desc="If you encounter an issue with this site, do us a favor and report it."
      >
        <Link withArrow href={siteMetadata.urls.gitHub.frontpage}>
          Report an issue
        </Link>
      </Feature>
      <Feature
        image={<img src={DiscordSVG} alt="Discord" />}
        title="Not finding something?"
        desc="Ask community members in chat. A maintainer is usually online."
      >
        <Link withArrow href={siteMetadata.urls.chat}>
          Chat now
        </Link>
      </Feature>
    </Features>
  </Wrapper>
);

export default NotFoundScreen;
