import React from 'react';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';
import Contributors from './Contributors';
import MadeByChroma from './MadeByChroma';
import MeetTheTeam from './MeetTheTeam';
import Sponsors from './Sponsors';

const { typography } = styles;

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

const Section = styled.div`
  margin-top: ${props => (props.isFirst ? 0 : 80)}px;
`;

const TeamScreen = () => (
  <TeamWrapper>
    <Content>
      <Section isFirst>
        <MeetTheTeam />
      </Section>

      <Section>
        <Contributors />
      </Section>

      <Section>
        <MadeByChroma />
      </Section>

      <Section>
        <Sponsors />
      </Section>
    </Content>
  </TeamWrapper>
);

export default TeamScreen;
