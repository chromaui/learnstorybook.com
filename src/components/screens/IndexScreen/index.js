import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import { Button, styles } from '@storybook/design-system';
import SiteStats from './SiteStats';
import GatsbyLink from '../../basics/GatsbyLink';
import CTA from '../../composite/CTA';
import Community from './Community';
import Guides from './Guides';
import Pitch from './Pitch';
import SocialValidation from './SocialValidation';
import WhatIsLSB from './WhatIsLSB';

const { breakpoint, color, pageMargin } = styles;

const BottomSection = styled.div`
  padding: 84px 20px 1rem;

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

const PureIndexScreen = ({ data }) => (
  <>
    <Pitch />
    <Guides chaptersEdges={data.chapters.edges} guidesEdges={data.guides.edges} />
    <SiteStats
      allEditionsChaptersEdges={data.allEditionsChapters.edges}
      chapterCount={data.chapters.edges.length}
      guideCount={data.guides.edges.length}
    />

    <WhatIsLSB />
    <SocialValidation />
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

PureIndexScreen.propTypes = {
  data: PropTypes.shape({
    allEditionsChapters: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
    }).isRequired,
    chapters: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
    }).isRequired,
    guides: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
    }).isRequired,
  }).isRequired,
};

const IndexScreen = props => (
  <StaticQuery
    query={graphql`
      query IndexQuery {
        guides: allMarkdownRemark(
          filter: { fields: { pageType: { eq: "guide" } } }
          sort: { order: ASC, fields: [frontmatter___order] }
        ) {
          edges {
            node {
              frontmatter {
                description
                order
                title
                themeColor
                thumbImagePath
              }
              fields {
                guide
                slug
              }
            }
          }
        }
        chapters: allMarkdownRemark(
          filter: { fields: { pageType: { eq: "chapter" }, isDefaultTranslation: { eq: true } } }
        ) {
          edges {
            node {
              fields {
                guide
              }
            }
          }
        }
        allEditionsChapters: allMarkdownRemark(
          filter: { fields: { pageType: { eq: "chapter" } } }
        ) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `}
    render={data => <PureIndexScreen data={data} {...props} />}
  />
);

export default IndexScreen;
