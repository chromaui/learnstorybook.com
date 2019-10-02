import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { graphql } from 'gatsby';
import { Highlight, styles } from '@storybook/design-system';
import ChapterLinks from './ChapterLinks';
import GithubLink from './GithubLink';
import Pagination from './Pagination';
import Sidebar from './Sidebar';
import tocEntries from '../../../lib/tocEntries';
import { chapterFormatting } from '../../../styles/formatting';

const { pageMargins, breakpoint, typography } = styles;

const HighlightWrapper = styled(Highlight)`
  margin-bottom: 3rem;
`;

const Content = styled.div`
  ${chapterFormatting};
  flex: 1;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  ${'' /* Allows Flexbox to overflow  */};
  min-width: 0;
`;

const ChapterWrapper = styled.div`
  ${pageMargins};
  display: flex;
  flex-direction: column;
  padding-bottom: 3rem;
  padding-top: 4rem;

  @media screen and (min-width: ${breakpoint}px) {
    flex-direction: row;
    padding-top: 165px;
  }
`;

const Title = styled.h1`
  font-size: ${typography.size.l1}px;
  font-weight: ${typography.weight.black};
  margin-bottom: 8px;
  line-height: 40px !important;
`;

const Description = styled.div`
  font-size: ${typography.size.m1}px;
  line-height: 32px !important;
  margin-bottom: 24px;
`;

const Chapter = ({
  data: {
    currentPage: {
      html,
      frontmatter: { commit, title, description },
      fields: { framework, guide, language, slug, chapter, permalink },
    },
    currentGuide: {
      frontmatter: { codeGithubUrl, title: currentGuideTitle, toc, twitterShareText },
    },
    site: { siteMetadata },
    tocPages,
    translationPages,
  },
}) => {
  const entries = tocEntries(toc, tocPages);
  const nextEntry = entries[toc.indexOf(chapter) + 1];
  const firstChapter = toc[0];
  const githubFileUrl = `${siteMetadata.githubUrl}/blob/master/content${slug.replace(
    /\/$/,
    ''
  )}.md`;

  return (
    <ChapterWrapper>
      <Helmet>
        <title>{`${title} | ${siteMetadata.title}`}</title>
        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={permalink} />
        <meta
          property="og:image"
          content={`${siteMetadata.permalink}/${guide}/opengraph-cover.jpg`}
        />

        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content={`${siteMetadata.permalink}/${guide}/opengraph-cover.jpg`}
        />
      </Helmet>

      <Sidebar
        chapter={chapter}
        contributeUrl={siteMetadata.contributeUrl}
        entries={entries}
        firstChapter={firstChapter}
        framework={framework}
        guide={guide}
        guideTitle={currentGuideTitle}
        language={language}
        slug={slug}
        translationPages={translationPages}
      />

      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <HighlightWrapper>{html}</HighlightWrapper>
        <ChapterLinks
          codeGithubUrl={codeGithubUrl}
          commit={commit}
          guide={guide}
          twitterShareText={twitterShareText}
        />
        <Pagination nextEntry={nextEntry} />
        <GithubLink githubFileUrl={githubFileUrl} />
      </Content>
    </ChapterWrapper>
  );
};

Chapter.propTypes = {
  data: PropTypes.shape({
    currentPage: PropTypes.shape({
      fields: PropTypes.shape({
        guide: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        chapter: PropTypes.string.isRequired,
        framework: PropTypes.string,
        language: PropTypes.string.isRequired,
        permalink: PropTypes.string.isRequired,
      }).isRequired,
      frontmatter: PropTypes.shape({
        commit: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
      }).isRequired,
      html: PropTypes.string.isRequired,
    }).isRequired,
    currentGuide: PropTypes.shape({
      frontmatter: PropTypes.shape({
        codeGithubUrl: PropTypes.string,
        title: PropTypes.string.isRequired,
        toc: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        twitterShareText: PropTypes.string,
      }).isRequired,
    }).isRequired,
    tocPages: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              tocTitle: PropTypes.string,
              title: PropTypes.string,
              description: PropTypes.string,
            }).isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              framework: PropTypes.string,
              chapter: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired
      ).isRequired,
    }),
    translationPages: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              tocTitle: PropTypes.string,
              title: PropTypes.string,
              description: PropTypes.string,
            }).isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              chapter: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired
      ).isRequired,
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        contributeUrl: PropTypes.string.isRequired,
        githubUrl: PropTypes.string.isRequired,
        permalink: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Chapter;

export const query = graphql`
  query ChapterQuery($framework: String, $language: String, $slug: String!, $guide: String!) {
    currentPage: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        description
        commit
      }
      fields {
        guide
        slug
        chapter
        framework
        language
        permalink
      }
    }
    currentGuide: markdownRemark(fields: { guide: { eq: $guide }, pageType: { eq: "guide" } }) {
      frontmatter {
        codeGithubUrl
        toc
        title
        twitterShareText
      }
    }
    site {
      siteMetadata {
        title
        githubUrl
        contributeUrl
        permalink
        siteUrl
      }
    }
    tocPages: allMarkdownRemark(
      filter: {
        fields: {
          framework: { eq: $framework }
          language: { eq: $language }
          guide: { eq: $guide }
          pageType: { eq: "chapter" }
        }
      }
    ) {
      edges {
        node {
          frontmatter {
            tocTitle
            title
            description
          }
          fields {
            slug
            framework
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
          frontmatter {
            tocTitle
            title
            description
          }
          fields {
            slug
            framework
            chapter
            language
          }
        }
      }
    }
  }
`;
