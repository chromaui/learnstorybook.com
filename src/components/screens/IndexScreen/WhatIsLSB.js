/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';

const { background, breakpoint, color, pageMargins, typography } = styles;

const WhatIsLSBWrapper = styled.div`
  background: ${background.app};
  border-top: 1px solid ${color.medium};
  border-bottom: 1px solid ${color.medium};
  padding: 60px 0;
`;

const Content = styled.div`
  ${pageMargins};
  text-align: center;

  @media (min-width: ${breakpoint * 1.5}px) {
    text-align: left;
    display: flex;
    align-items: center;
  }

  video {
    width: 327px;
    max-width: 100%;
    margin-top: 30px;

    @media (min-width: ${breakpoint * 1.5}px) {
      width: 327px;
      margin-left: 160px;
    }
  }
`;

const BannerHeading = styled.div`
  font-size: ${typography.size.m2}px;
  font-weight: ${typography.weight.black};
  letter-spacing: -0.28px;
  line-height: 36px;
`;

const BannerText = styled.div`
  font-size: ${typography.size.s3}px;
  letter-spacing: -0.33px;
  line-height: 26px;
  margin-top: 8px;
`;

const WhatIsLSB = props => (
  <WhatIsLSBWrapper {...props}>
    <Content>
      <div>
        <BannerHeading>What is Learn Storybook?</BannerHeading>
        <BannerText>
          Learn Storybook teaches tried-and-true development techniques for UI components. The best
          practices here are sourced from professional teams, Storybook maintainers, and the awesome
          community. We value your time. Our guides cover essential learnings and timesaving tactics
          that make you more productive at Component-Driven Development immediately. No filler.
        </BannerText>
      </div>

      <video autoPlay muted playsInline loop>
        <source src="/learnstorybook-componentdrivendevelopment-optimized.mp4" type="video/mp4" />
      </video>
    </Content>
  </WhatIsLSBWrapper>
);

export default WhatIsLSB;
