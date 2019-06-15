/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { graphql } from 'gatsby';
import pluralize from 'pluralize';
import { Button, styles } from '@storybook/design-system';
import SiteStats from './SiteStats';
import IconLearnStorybook from '../../basics/IconLearnStorybook';
import GatsbyLink from '../../basics/GatsbyLink';
import SiteStat from '../../basics/SiteStat';
import CTA from '../../molecules/CTA';
import Guide from '../../molecules/Guide';
import SocialValidation from '../../organisms/SocialValidation';
import Community from '../../organisms/Community';
import Guides from './Guides';
import Pitch from './Pitch';
import WhatIsLSB from './WhatIsLSB';

const { background, color, typography, spacing, pageMargin, breakpoint } = styles;

// The background image only loads on the first render. Passing the time forces it to update.
const DotBackground = styled.div`
  background: url('bg-dots.svg?t=${props => props.time}');
  background-repeat: repeat-x;
  background-position-y: 80px;
`;

const WhatIsLSBWrapper = styled(WhatIsLSB)`
  margin-top: 80px;
`;

const SocialValidationWrapper = styled(SocialValidation)`
  margin-top: 80px;
`;

const BottomSection = styled.div`
  padding: 84px ${spacing.padding.medium}px 1rem;

  @media (min-width: ${breakpoint * 1}px) {
    margin: 0 ${pageMargin * 3}%;
  }

  @media (min-width: ${breakpoint * 2}px) {
    margin: 0 ${pageMargin * 4}%;
  }
`;

const SocialValidationLineBreak = styled.div`
  height: 1px;
  background: ${color.mediumlight};
  margin-top: 84px;
`;

const CTALineBreak = styled.div`
  margin-top: 64px;
  height: 1px;
  background: ${color.mediumlight};

  @media (min-width: ${breakpoint}px) {
    margin-left: -56px;
    margin-right: -56px;
  }
`;

const IndexScreen = ({ data }) => (
  <>
    <DotBackground time={Date.now()}>
      <Pitch />
      <Guides chaptersEdges={data.chapters.edges} guidesEdges={data.guides.edges} />
      <SiteStats chapterCount={data.chapters.edges.length} guidesEdges={data.guides.edges} />
    </DotBackground>

    <WhatIsLSBWrapper />
    <SocialValidationWrapper />
    <SocialValidationLineBreak />

    <BottomSection>
      <Community />

      <CTALineBreak />

      <CTA
        text="Learn to build UIs with components and libraries now"
        action={
          <GatsbyLink to="/intro-to-storybook">
            <Button appearance="secondary">Get started</Button>
          </GatsbyLink>
        }
      />
    </BottomSection>
  </>
);

IndexScreen.propTypes = {
  data: PropTypes.shape({
    guides: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
    }).isRequired,
    chapters: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
    }).isRequired,
  }).isRequired,
};

export default IndexScreen;
