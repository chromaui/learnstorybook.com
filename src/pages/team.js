import React from 'react';
import styled from 'styled-components';
import { Avatar, Link, styles, Subheading } from '@storybook/design-system';
import BoxLink from '../components/atoms/BoxLink';
import ShadowBox from '../components/atoms/ShadowBox';
import User from '../components/molecules/User';

const { breakpoint, color, spacing, typography } = styles;

const TeamWrapper = styled.div`
  max-width: 608px;
  margin: 0 auto;
  padding: 156px 20px 90px;
`;

const Content = styled.div`
  font-size: ${typography.size.s3}px;
  letter-spacing: -0.36px;
  line-height: 24px;
`;

const Heading = styled.div`
  font-size: 36px;
  font-weight: ${typography.weight.black};
  letter-spacing: -0.36px;
  line-height: 40px;
  text-align: center;
`;

const SubheadingWrapper = styled(Subheading)`
  color: ${color.dark};
  font-size: 15px;
`;

const SubheadingMessage = styled.div`
  margin-top: 16px;
`;

const Section = styled.div`
  margin-top: ${props => (props.isFirst ? 48 : 80)}px;
`;

const Editor = styled.div`
  display: flex;
  margin-top: ${props => (props.isFirst ? 24 : 46)}px;
`;

const EditorAvatar = styled(Avatar)`
  height: 80px;
  width: 80px;
  line-height: 80px;
  min-width: 80px;
  margin-right: ${spacing.padding.large}px;
`;

const EditorName = styled.span`
  font-size: ${typography.size.s3}px;
  font-weight: ${typography.weight.black};
  letter-spacing: -0.28px;
  line-height: 36px;
  margin-right: 4px;
`;

const EditorDescription = styled.div`
  flex: 1;
`;

const ContributorsList = styled.div`
  margin-top: ${spacing.padding.large}px;
  display: flex;
  flex-wrap: wrap;
`;

const Contributor = styled.div`
  flex: 0 0 100%;

  &:nth-child(n + 2) {
    margin-top: ${spacing.padding.medium}px;
  }

  @media (min-width: 440px) {
    flex: 0 0 50%;

    &:nth-child(n + 3) {
      margin-top: ${spacing.padding.medium}px;
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

const ChromaShadowBox = styled(ShadowBox)`
  margin-top: 24px;
  padding: 20px;
  display: flex;

  a {
    margin-right: 16px;
  }

  img {
    width: 50px;
    height: 50px;
  }

  @media (min-width: ${breakpoint}px) {
    padding: 40px;

    a {
      margin-right: 24px;
    }

    img {
      width: 60px;
      height: 60px;
    }
  }
`;

const Bold = styled.span`
  font-weight: ${typography.weight.bold};
`;

const Sponsors = styled.div`
  margin-top: 26px;
  display: flex;
`;

const SponsorBoxLink = styled(BoxLink)`
  && {
    height: 120px;
    width: calc(33% - 10px);
    margin-right: ${spacing.padding.medium}px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${typography.weight.bold};
    font-size: ${typography.size.s2}px;

    &:last-of-type {
      margin-right: 0;
    }

    img {
      max-width: 76%;
    }

    @media (min-width: ${breakpoint}px) {
      height: 180px;
      max-width: none;

      img {
        max-width: initial;
      }
    }
  }

  span {
    display: flex;
    justify-content: center;
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

const Team = () => (
  <TeamWrapper>
    <Content>
      <Heading>Meet the team</Heading>

      <Section>
        <SubheadingWrapper>Editors</SubheadingWrapper>

        <Editor isFirst>
          <EditorAvatar src="https://avatars2.githubusercontent.com/u/263385" size="large" />

          <EditorDescription>
            <div>
              <EditorName>Dominic Nguyen</EditorName>

              <Link secondary target="_blank" href="https://twitter.com/domyen">
                @domyen
              </Link>
            </div>

            <div>
              Dominic is the designer of Storybook. He focuses on dev workflow and community. He
              helped launch Apollo GraphQL and maintain Meteor. Find him writing about
              Component-Driven Development and frontend infrastructure.
            </div>
          </EditorDescription>
        </Editor>

        <Editor>
          <EditorAvatar src="https://avatars2.githubusercontent.com/u/132554" size="large" />

          <EditorDescription>
            <div>
              <EditorName>Tom Coleman</EditorName>

              <Link secondary target="_blank" href="https://twitter.com/tmeasday">
                @tmeasday
              </Link>
            </div>

            <div>
              Tom is a Storybook Steering Committee member focusing on frontend architecture.
              Previously, he launched Apollo GraphQL, maintained Meteor, and published the
              top-selling Discover Meteor book. He writes about frontend best practices,
              performance, and process.
            </div>
          </EditorDescription>
        </Editor>
      </Section>

      <Section>
        <SubheadingWrapper>Contributors</SubheadingWrapper>

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
      </Section>

      <Section>
        <SubheadingWrapper>Made by</SubheadingWrapper>

        <ChromaShadowBox>
          <Link target="_blank" href="https://hichroma.com/">
            <img alt="Chroma, the Storybook company" src="/icon-chroma.svg" />
          </Link>

          <div>
            <Bold>Chroma is the Storybook company</Bold> run by core maintainers. We help devs learn
            Component-Driven Development and create frontend tools like Chromatic and Storybook
            Loop.{' '}
          </div>
        </ChromaShadowBox>
      </Section>

      <Section>
        <SubheadingWrapper>Sponsors</SubheadingWrapper>

        <SubheadingMessage>
          Website updates and new guides are made possible with the help of sponsors.
        </SubheadingMessage>

        <Sponsors>
          <SponsorBoxLink to="https://www.invisionapp.com/design-system-manager">
            <img alt="InVision" src="/logo-invision.svg" />
          </SponsorBoxLink>

          <SponsorBoxLink to="#">
            <Link as="span" href="#">
              Sponsor us
            </Link>
          </SponsorBoxLink>
        </Sponsors>
      </Section>
    </Content>
  </TeamWrapper>
);

export default Team;
