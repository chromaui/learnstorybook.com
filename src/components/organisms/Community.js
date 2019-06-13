import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Avatar, styles } from '@storybook/design-system';
import User from '../molecules/User';

const { spacing, typography } = styles;

const smallBreakpoint = 440;

const Section = styled.div`
  ${props =>
    !props.isFirst &&
    `
    margin-top: 64px;
  `}
`;

const Heading = styled.div`
  font-size: ${typography.size.m2}px;
  font-weight: ${typography.weight.bold};
  letter-spacing: -0.23px;
  line-height: 28px;
`;

const Text = styled.div`
  font-size: ${typography.size.s3}px;
  letter-spacing: -0.33px;
  line-height: 26px;
  margin-top: 12px;
`;

const GuidanceUsers = styled.div`
  margin-top: 52px;
  display: flex;
  flex-wrap: wrap;
`;

const GuidanceUser = styled(User)`
  width: 100%;
  margin-top: ${spacing.padding.medium}px;

  &:first-of-type {
    margin-top: 0;
  }

  @media (min-width: ${smallBreakpoint}px) {
    width: auto;
    ${props =>
      !props.isLast &&
      `
      margin-right: 60px;
    `}
  }
`;

const Logos = styled.div`
  margin-top: 54px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-left: -10px;
  margin-bottom: -10px;

  @media (min-width: ${smallBreakpoint}px) {
    margin-left: 0;
    margin-bottom: 0;
  }
`;

const LogoImage = styled.img`
  height: ${props => props.height};
  margin: 10px;

  @media (min-width: ${smallBreakpoint}px) {
    margin: 0;
    margin-right: 28px;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const CommunityAvatars = styled.div`
  margin-top: 24px;
  margin-left: -10px;
  margin-right: -10px;
  display: flex;
  flex-wrap: wrap;
`;

const AvatarWrapper = styled(Avatar).attrs({ size: 'large' })`
  min-width: 40px;
  margin: 10px;
`;

const logos = [
  {
    src: '/logo-storybook.svg',
    alt: 'Storybook',
    height: '25px',
  },
  {
    src: '/logo-apollo.svg',
    alt: 'Apollo',
    height: '34px',
  },
  {
    src: '/logo-meteor.svg',
    alt: 'Meteor',
    height: '41px',
  },
];

const contributorsUrl = 'https://api.github.com/repos/chromaui/learnstorybook.com/contributors';

const Community = () => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    async function fetchGithubContributors() {
      const response = await fetch(contributorsUrl).then(res => res.json());
      setContributors(response);
    }

    fetchGithubContributors();
  }, []);

  return (
    <div>
      <Section isFirst>
        <Heading>Expert frontend guidance</Heading>

        <Text>
          Learn Storybook was created by active Storybook maintainers who also helped build Apollo
          and Meteor. Tens of thousands of frontend developers use their work to build apps for
          millions of people.
        </Text>

        <GuidanceUsers>
          <GuidanceUser
            src="https://avatars2.githubusercontent.com/u/263385"
            name="Dominic Nguyen"
            detail="Storybook Design"
          />
          <GuidanceUser
            isLast
            src="https://avatars2.githubusercontent.com/u/132554"
            name="Tom Coleman"
            detail="Storybook core"
          />
        </GuidanceUsers>

        <Logos>
          {logos.map(logo => (
            <LogoImage key={logo.src} src={logo.src} alt={logo.alt} height={logo.height} />
          ))}
        </Logos>
      </Section>

      <Section>
        <Heading>Updated all the time</Heading>

        <Text>
          Our amazing community of learners help update, localize, and suggest new guide topics.
          That means Learn Storybook stays up to date with industry best practices.
        </Text>

        <CommunityAvatars>
          {contributors.map(contributor => (
            <AvatarWrapper key={contributor.id} src={contributor.avatar_url} />
          ))}
        </CommunityAvatars>
      </Section>
    </div>
  );
};

export default Community;
