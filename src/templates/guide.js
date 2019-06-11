/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { styles, Subheading } from '@storybook/design-system';
import { graphql } from 'gatsby';
import BoxLink from '../components/atoms/BoxLink';
import GuideHero from '../components/organisms/GuideHero';
import { guideFormatting } from '../styles/formatting';
import tocEntries from '../lib/tocEntries';

const { breakpoint, color, pageMargins, typography } = styles;

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
  }
`;

const SubheadingWrapper = styled(Subheading)`
  color: ${color.mediumdark};
  letter-spacing: 6px;
  line-height: 20px;
  display: block;
`;

const TocSubheading = styled(SubheadingWrapper)`
  margin-top: 48px;
  margin-bottom: 20px;
`;

const Detail = styled.div`
  margin-top: 66px;

  @media (min-width: ${breakpoint * 1.5}px) {
    margin-top: 0;
  }
`;

const BoxLinkWrapper = styled(BoxLink).attrs({ isInternal: true })`
  padding: 20px 28px;
  margin-bottom: 10px;
  letter-spacing: -0.26px;
  line-height: 20px;

  &&,
  &&:hover,
  &&:focus {
    color: ${color.darkest};
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Chapter = styled.div`
  display: flex;
  align-items: center;
`;

const ChapterNumber = styled.div`
  font-weight: ${typography.weight.black};
  font-size: ${typography.size.m1}px;
  letter-spacing: -0.33px;
  line-height: 24px;
  color: ${color.mediumdark};
  margin-right: 26px;
`;

const ChapterTitle = styled.div`
  font-weight: ${typography.weight.bold};
`;

const ChapterDescription = styled.div`
  font-size: ${typography.size.s2}px;
`;

const Guide = ({ data }) => {
  const {
    currentPage,
    pages,
    site: { siteMetadata },
  } = data;
  const tocList = currentPage.frontmatter.toc.split(', ');
  const entries = tocEntries(tocList, pages);

  return (
    <>
      <Helmet
        title={`${currentPage.frontmatter.title} | ${siteMetadata.title}`}
        meta={[{ name: 'description', content: currentPage.frontmatter.description }]}
      />

      <GuideHero
        description={currentPage.frontmatter.description}
        contributorCount={34}
        imagePath={currentPage.frontmatter.imagePath}
        languages={currentPage.frontmatter.languages.split(', ')}
        title={currentPage.frontmatter.title}
        themeColor={currentPage.frontmatter.themeColor}
      />

      <Content>
        <Overview>
          <h1>Overview</h1>
          <p>{currentPage.frontmatter.overview}</p>

          <TocSubheading>Table of Contents</TocSubheading>

          {entries.map((entry, index) => (
            <BoxLinkWrapper to={entry.slug} key={entry.slug}>
              <Chapter>
                <ChapterNumber>{index + 1}</ChapterNumber>

                <div>
                  <ChapterTitle>{entry.tocTitle || entry.title}</ChapterTitle>
                  <ChapterDescription>{entry.description}</ChapterDescription>
                </div>
              </Chapter>
            </BoxLinkWrapper>
          ))}
        </Overview>

        <Detail>
          <div dangerouslySetInnerHTML={{ __html: currentPage.html }} />
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
        description: PropTypes.string.isRequired,
        imagePath: PropTypes.string.isRequired,
        languages: PropTypes.string.isRequired,
        themeColor: PropTypes.string.isRequired,
        toc: PropTypes.string.isRequired,
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
        description
        imagePath
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
