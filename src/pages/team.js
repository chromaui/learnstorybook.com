import React from 'react';
import styled from 'styled-components';
import { Avatar, Link, styles, Subheading } from '@storybook/design-system';
import User from '../components/molecules/User';

const { color, spacing, typography } = styles;

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

const Editors = styled.div`
  margin-top: 48px;
`;

const Editor = styled.div`
  display: flex;
  margin-top: ${props => (props.isFirst ? 24 : 46)}px;
`;

const EditorAvatar = styled(Avatar)`
  height: 80px;
  width: 80px;
  line-height: 80px;
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

const Contributors = styled.div`
  margin-top: 80px;
`;

const ContributorsList = styled.div`
  margin-top: ${spacing.padding.large}px;
  display: flex;
  flex-wrap: wrap;
`;

const Contributor = styled.div`
  flex: 0 0 50%;

  &:nth-child(n + 3) {
    margin-top: ${spacing.padding.medium}px;
  }
`;

const ContributorUser = styled(User)`
  align-items: center;

  > :first-child {
    height: 48px;
    width: 48px;
    line-height: 48px;
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

      <Editors>
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
      </Editors>

      <Contributors>
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
      </Contributors>
    </Content>
  </TeamWrapper>
);

export default Team;
