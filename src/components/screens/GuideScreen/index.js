/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';
import { graphql } from 'gatsby';
import Contributors from './Contributors';
import Hero from './Hero';
import TableOfContents from './TableOfContents';
import { guideFormatting } from '../../../styles/formatting';
import tocEntries from '../../../lib/tocEntries';

const { breakpoint, pageMargins } = styles;

const Content = styled.div`
  ${guideFormatting}
  ${pageMargins}
  padding-top: 66px;
  padding-bottom: 66px;

  @media (min-width: ${breakpoint * 1.5}px) {
    display: flex;
  }
`;

const Overview = styled.div`
  @media (min-width: ${breakpoint * 1.5}px) {
    margin-right: 84px;
    width: 50%;
  }
`;

const Detail = styled.div`
  margin-top: 66px;

  @media (min-width: ${breakpoint * 1.5}px) {
    margin-top: 0;
    width: 50%;
  }
`;

const Guide = ({ data }) => {
  const {
    currentPage,
    pages,
    site: { siteMetadata },
  } = data;
  const entries = tocEntries(currentPage.frontmatter.toc, pages);

  return (
    <>
      <Helmet
        title={`${currentPage.frontmatter.title} | ${siteMetadata.title}`}
        meta={[{ name: 'description', content: currentPage.frontmatter.description }]}
      />

      <Hero
        contributorCount={currentPage.frontmatter.contributorCount}
        ctaHref={entries[0].slug}
        description={currentPage.frontmatter.heroDescription}
        heroAnimationName={currentPage.frontmatter.heroAnimationName}
        imagePath={currentPage.frontmatter.coverImagePath}
        languages={currentPage.frontmatter.languages}
        title={currentPage.frontmatter.title}
        themeColor={currentPage.frontmatter.themeColor}
      />

      <Content>
        <Overview>
          <h1>Overview</h1>
          <p>{currentPage.frontmatter.overview}</p>

          <TableOfContents entries={entries} />
        </Overview>

        <Detail>
          <div dangerouslySetInnerHTML={{ __html: currentPage.html }} />

          <Contributors
            authors={currentPage.frontmatter.authors}
            contributors={currentPage.frontmatter.contributors}
          />
        </Detail>
      </Content>
    </>
  );
};

Guide.propTypes = {
  data: PropTypes.shape({
    currentPage: PropTypes.shape({
      html: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        authors: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            detail: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
          }).isRequired
        ),
        contributorCount: PropTypes.string,
        coverImagePath: PropTypes.string,
        description: PropTypes.string.isRequired,
        heroAnimationName: PropTypes.string,
        heroDescription: PropTypes.string.isRequired,
        languages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        themeColor: PropTypes.string.isRequired,
        toc: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        title: PropTypes.string.isRequired,
        overview: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    pages: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              tocTitle: PropTypes.string,
              description: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Guide;

export const query = graphql`
  query GuideQuery($slug: String!, $guide: String!) {
    site {
      siteMetadata {
        title
      }
    }
    currentPage: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        authors {
          name
          src
          detail
        }
        contributors {
          name
          src
          detail
        }
        contributorCount
        coverImagePath
        description
        heroAnimationName
        heroDescription
        languages
        title
        themeColor
        toc
        overview
      }
    }
    pages: allMarkdownRemark(
      filter: {
        fields: {
          isDefaultTranslation: { eq: true }
          guide: { eq: $guide }
          pageType: { eq: "chapter" }
        }
      }
    ) {
      edges {
        node {
          frontmatter {
            title
            tocTitle
            description
          }
          fields {
            slug
            chapter
          }
        }
      }
    }
  }
`;
