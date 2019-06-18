import React from 'react';
import PropTypes from 'prop-types';
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

const Title = styled.div`
  font-size: ${typography.size.l1}px;
  font-weight: ${typography.weight.black};
  margin-bottom: 8px;
  letter-spacing: -0.33px;
  line-height: 40px;
`;

const Description = styled.div`
  font-size: ${typography.size.m2}px;
  letter-spacing: -0.37px;
  line-height: 26px;
  margin-bottom: 28px;
`;

const Chapter = ({
  data: {
    currentPage: {
      html,
      frontmatter: { commit, title, description },
      fields: { framework, guide, language, slug, chapter },
    },
    currentGuide: {
      frontmatter: { toc },
    },
    site: {
      siteMetadata: { githubUrl, codeGithubUrl },
    },
    tocPages,
    translationPages,
  },
}) => {
  const entries = tocEntries(toc, tocPages);
  const nextEntry = entries[toc.indexOf(chapter) + 1];
  const firstChapter = toc[0];
  const githubFileUrl = `${githubUrl}/blob/master/content${slug.replace(/\/$/, '')}.md`;

  return (
    <ChapterWrapper>
      <Sidebar
        chapter={chapter}
        entries={entries}
        firstChapter={firstChapter}
        framework={framework}
        guide={guide}
        language={language}
        slug={slug}
        translationPages={translationPages}
      />

      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <HighlightWrapper>{html}</HighlightWrapper>
        <ChapterLinks codeGithubUrl={codeGithubUrl} commit={commit} />
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
      }).isRequired,
      frontmatter: PropTypes.shape({
        commit: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
      }).isRequired,
    }).isRequired,
    currentGuide: PropTypes.shape({
      frontmatter: PropTypes.shape({
        toc: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        languages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
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
              framework: PropTypes.string,
              chapter: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired
      ).isRequired,
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
        permalink: PropTypes.string,
        description: PropTypes.string,
        githubUrl: PropTypes.string.isRequired,
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
      }
    }
    currentGuide: markdownRemark(fields: { guide: { eq: $guide }, pageType: { eq: "guide" } }) {
      frontmatter {
        toc
        languages
      }
    }
    site {
      siteMetadata {
        title
        githubUrl
        codeGithubUrl
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
