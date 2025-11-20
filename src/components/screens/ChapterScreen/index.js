import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import {
  SubNavBreadcrumb,
  SubNavDivider,
  SubNavMenus,
  styles as marketingStyles,
} from '@storybook/components-marketing';
import { Highlight, Icon, Link, styles } from '@storybook/design-system';
import { styled } from '@storybook/theming';

import fetchTutorialNotUpdatedText from '../../../lib/getTranslationMessages';
import tocEntries from '../../../lib/tocEntries';
import { chapterFormatting } from '../../../styles/formatting';
import { GatsbyLinkWrapper } from '../../basics/GatsbyLink';
import AppLayout from '../../composite/AppLayout';
import ChapterLinks from './ChapterLinks';
import FrameworkSelector from './FrameworkSelector';
import GithubLink from './GithubLink';
import Pagination from './Pagination';
import Sidebar from './Sidebar';
import LanguageSelector from './LanguageSelector';

const { breakpoint, typography } = styles;

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
  display: flex;
  flex-direction: column;

  @media screen and (min-width: ${breakpoint}px) {
    flex-direction: row;
  }
`;

const Title = styled.h1`
  ${marketingStyles.marketing.heading}
  margin-bottom: 8px;
`;

const Description = styled.div`
  font-size: ${typography.size.m1}px;
  line-height: 32px !important;
  margin-bottom: ${styles.spacing.padding.large}px;
`;

function Chapter({
  data: {
    currentPage: {
      html,
      frontmatter: { commit, title, description },
      fields: { framework, guide, language, slug, chapter, permalink, tutorialUpToDate },
    },
    currentGuide: {
      frontmatter: { codeGithubUrl, title: currentGuideTitle, toc, twitterShareText },
    },
    site: { siteMetadata },
    tocPages,
    translationPages,
  },
}) {
  const entries = tocEntries(toc, tocPages);
  const tocWithMatchingEntries = toc.filter((tocItem) =>
    entries.find((entry) => entry.chapter === tocItem)
  );
  const nextEntry = entries[tocWithMatchingEntries.indexOf(chapter) + 1];
  const firstChapter = tocWithMatchingEntries[0];
  const githubFileUrl = `${siteMetadata.githubUrl}/blob/master/content${slug.replace(
    /\/$/,
    ''
  )}.md`;
  const fetchStatusUpdate = fetchTutorialNotUpdatedText(language);
  return (
    <>
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
      <AppLayout
        subNav={
          <>
            <SubNavBreadcrumb tertiary to={`/${guide}/`} LinkWrapper={GatsbyLinkWrapper}>
              <Icon icon="arrowleft" />
              Back to {currentGuideTitle}
            </SubNavBreadcrumb>
            <SubNavDivider />
            <SubNavMenus>
              {framework && (
                <FrameworkSelector
                  chapter={chapter}
                  firstChapter={firstChapter}
                  framework={framework}
                  guide={guide}
                  language={language}
                  translationPages={translationPages}
                />
              )}
              <LanguageSelector
                chapter={chapter}
                contributeUrl={siteMetadata.contributeUrl}
                firstChapter={firstChapter}
                framework={framework}
                guide={guide}
                language={language}
                translationPages={translationPages}
              />
            </SubNavMenus>
          </>
        }
      >
        <ChapterWrapper>
          <Sidebar entries={entries} slug={slug} />

          <Content>
            <Title>{title}</Title>
            <Description>{description}</Description>
            {!tutorialUpToDate && (
              <div className="translation-aside">
                {fetchStatusUpdate.guidenotupdated}{' '}
                <Link tertiary href={githubFileUrl} target="_blank" rel="noopener">
                  {fetchStatusUpdate.pullrequestmessage}
                </Link>
                .
              </div>
            )}
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
      </AppLayout>
    </>
  );
}

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
        tutorialUpToDate: PropTypes.bool,
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
        tutorialUpToDate
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
