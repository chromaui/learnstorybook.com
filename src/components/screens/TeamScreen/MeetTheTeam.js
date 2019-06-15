import React from 'react';
import styled from 'styled-components';
import { Avatar, Link, styles } from '@storybook/design-system';
import Subheading from './Subheading';

const { typography } = styles;

const Heading = styled.div`
  font-size: 36px;
  font-weight: ${typography.weight.black};
  letter-spacing: -0.36px;
  line-height: 40px;
  text-align: center;
  margin-bottom: 48px;
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
  margin-right: 30px;
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

const MeetTheTeam = () => (
  <>
    <Heading>Meet the team</Heading>

    <Subheading>Editors</Subheading>

    <Editor isFirst>
      <EditorAvatar src="https://avatars2.githubusercontent.com/u/263385" size="large" />

      <EditorDescription>
        <div>
          <EditorName>Dominic Nguyen</EditorName>

          <Link secondary target="_blank" rel="noopener" href="https://twitter.com/domyen">
            @domyen
          </Link>
        </div>

        <div>
          Dominic is the designer of Storybook. He focuses on dev workflow and community. He helped
          launch Apollo GraphQL and maintain Meteor. Find him writing about Component-Driven
          Development and frontend infrastructure.
        </div>
      </EditorDescription>
    </Editor>

    <Editor>
      <EditorAvatar src="https://avatars2.githubusercontent.com/u/132554" size="large" />

      <EditorDescription>
        <div>
          <EditorName>Tom Coleman</EditorName>

          <Link secondary target="_blank" rel="noopener" href="https://twitter.com/tmeasday">
            @tmeasday
          </Link>
        </div>

        <div>
          Tom is a Storybook Steering Committee member focusing on frontend architecture.
          Previously, he launched Apollo GraphQL, maintained Meteor, and published the top-selling
          Discover Meteor book. He writes about frontend best practices, performance, and process.
        </div>
      </EditorDescription>
    </Editor>
  </>
);

export default MeetTheTeam;
