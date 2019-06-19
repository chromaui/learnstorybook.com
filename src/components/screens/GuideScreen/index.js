/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';
import get from 'lodash/get';
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

const getTranslationLanguages = translationPages =>
  translationPages.edges.reduce(
    (uniqueLanguages, pageEdge) => uniqueLanguages.add(pageEdge.node.fields.language),
    new Set()
  );

const Guide = ({ data }) => {
  const {
    currentPage: {
      html,
      frontmatter: {
        authors,
        contributorCount,
        contributors,
        coverImagePath,
        description,
        heroAnimationName,
        heroDescription,
        themeColor,
        title,
        toc,
        overview,
      },
    },
    pages,
    site: { siteMetadata },
    translationPages,
  } = data;
  const entries = toc && toc.length > 0 ? tocEntries(toc, pages) : [];
  const languages = Array.from(getTranslationLanguages(translationPages));

  return (
    <>
      <Helmet
        title={`${title} | ${siteMetadata.title}`}
        meta={[{ name: 'description', content: description }]}
      />

      <Hero
        contributorCount={contributorCount}
        ctaHref={get(entries, '[0].slug')}
        description={heroDescription}
        heroAnimationName={heroAnimationName}
        imagePath={coverImagePath}
        languages={languages}
        title={title}
        themeColor={themeColor}
      />

      <Content>
        <Overview>
          {overview && (
            <>
              <h1>Overview</h1>
              <p>{overview}</p>
            </>
          )}

          {entries.length > 0 && <TableOfContents entries={entries} />}
        </Overview>

        <Detail>
          <div dangerouslySetInnerHTML={{ __html: html }} />

          <Contributors authors={authors} contributors={contributors} />
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
        heroDescription: PropTypes.string,
        themeColor: PropTypes.string.isRequired,
        toc: PropTypes.arrayOf(PropTypes.string.isRequired),
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
    translationPages: allMarkdownRemark(
      filter: { fields: { guide: { eq: $guide }, pageType: { eq: "chapter" } } }
    ) {
      edges {
        node {
          fields {
            language
          }
        }
      }
    }
  }
`;
