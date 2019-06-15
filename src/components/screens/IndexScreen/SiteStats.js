import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import pluralize from 'pluralize';
import { styles } from '@storybook/design-system';
import SiteStat from '../../basics/SiteStat';

const { breakpoint, pageMargins } = styles;

const SiteStatsWrapper = styled.div`
  ${pageMargins}

  && {
    margin-top: 66px;
  }

  @media (min-width: ${breakpoint * 1.25}px) {
    display: flex;
  }
`;

const SiteStatWrapper = styled.div`
  position: relative;
  margin-top: 30px;

  @media (min-width: ${breakpoint * 1.25}px) {
    margin-right: 66px;
    margin-top: 0;
  }

  @media (min-width: ${breakpoint * 1.75}px) {
    margin-right: 97px;
  }

  &:last-of-type {
    margin-right: 0;
  }
`;

const AndCountingImage = styled.img.attrs({ src: '/lsb-andcounting.svg' })`
  position: absolute;
  top: 0;
  left: ${props => (props.withMultipleGuides ? 120 : 108)}px;

  @media (min-width: ${breakpoint * 1.25}px) {
    width: 90px;
    top: 5px;
  }

  @media (min-width: ${breakpoint * 1.75}px) {
    width: auto;
    top: 0;
  }
`;

const getGuideEditionCount = guidesEdges =>
  guidesEdges.reduce((acc, guideEdge) => acc + guideEdge.node.frontmatter.editionCount, 0);

const SiteStats = ({ chapterCount, guidesEdges }) => (
  <SiteStatsWrapper>
    <SiteStatWrapper>
      <SiteStat
        heading={pluralize('guide', guidesEdges.length, true)}
        message="Professional walkthroughs made for frontend devs. Updated all the time."
      />

      <AndCountingImage withMultipleGuides={guidesEdges.length > 1} />
    </SiteStatWrapper>

    <SiteStatWrapper>
      <SiteStat
        heading={pluralize('chapter', chapterCount, true)}
        message="With code snippets, sample repos, icons, and production assets."
      />
    </SiteStatWrapper>

    <SiteStatWrapper>
      <SiteStat
        heading={pluralize('edition', getGuideEditionCount(guidesEdges), true)}
        message="Support for React, Vue, and Angular. Translated into Spanish, Chinese, and more."
      />
    </SiteStatWrapper>
  </SiteStatsWrapper>
);

SiteStats.propTypes = {
  chapterCount: PropTypes.number.isRequired,
  guidesEdges: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        frontmatter: PropTypes.shape({
          editionCount: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
};

export default SiteStats;
