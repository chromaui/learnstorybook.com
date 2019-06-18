import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import pluralize from 'pluralize';
import { styles } from '@storybook/design-system';
import SiteStat from './SiteStat';

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

const getGuideEditions = allEditionsChaptersEdges =>
  allEditionsChaptersEdges.reduce((uniqueEditionsSet, chapterEdge) => {
    const slugParts = chapterEdge.node.fields.slug.split('/').filter(part => !!part);
    const slugPartsWithoutPage = slugParts.slice(0, -1);
    const editionId = slugPartsWithoutPage.join('/');

    return uniqueEditionsSet.add(editionId);
  }, new Set());

const SiteStats = ({ allEditionsChaptersEdges, chapterCount, guideCount }) => {
  const uniqueEditionsSet = useMemo(() => getGuideEditions(allEditionsChaptersEdges), [
    allEditionsChaptersEdges,
  ]);

  return (
    <SiteStatsWrapper>
      <SiteStatWrapper>
        <SiteStat
          heading={pluralize('guide', guideCount, true)}
          message="Professional walkthroughs made for frontend devs. Updated all the time."
        />

        <AndCountingImage withMultipleGuides={guideCount > 1} />
      </SiteStatWrapper>

      <SiteStatWrapper>
        <SiteStat
          heading={pluralize('chapter', chapterCount, true)}
          message="With code snippets, sample repos, icons, and production assets."
        />
      </SiteStatWrapper>

      <SiteStatWrapper>
        <SiteStat
          heading={pluralize('edition', uniqueEditionsSet.size, true)}
          message="Support for React, Vue, and Angular. Translated into Spanish, Chinese, and more."
        />
      </SiteStatWrapper>
    </SiteStatsWrapper>
  );
};

SiteStats.propTypes = {
  chapterCount: PropTypes.number.isRequired,
  guideCount: PropTypes.number.isRequired,
  allEditionsChaptersEdges: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        fields: PropTypes.shape({
          slug: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
};

export default SiteStats;
