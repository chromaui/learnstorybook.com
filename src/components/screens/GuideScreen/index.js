import React from 'react';
import PropTypes from 'prop-types';
import { SubNavBreadcrumb, styles as marketingStyles } from '@storybook/components-marketing';
import { styles, Icon } from '@storybook/design-system';
import { styled } from '@storybook/theming';
import get from 'lodash/get';
import { graphql, withPrefix } from 'gatsby';
import { darken } from 'polished';

import tocEntries from '../../../lib/tocEntries';
import getGuideLanguageLinks from '../../../lib/getGuideLanguageLinks';
import getLanguageName from '../../../lib/getLanguageName';
import { guideFormatting } from '../../../styles/formatting';
import { GatsbyLinkWrapper } from '../../basics/GatsbyLink';
import AppLayout from '../../composite/AppLayout';
import PageHead from '../../composite/PageHead';
import Contributors from './Contributors';
import Hero from './Hero';
import TableOfContents from './TableOfContents';

const { breakpoint, color, pageMargins, typography } = styles;

const Content = styled.div`
  ${guideFormatting}
  ${pageMargins}
  padding-top: 64px;
  padding-bottom: 64px;

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

const OverviewTitle = styled.h2`
  ${marketingStyles.marketing.subheading}
  margin-bottom: 12px;
`;

const OverviewDesc = styled.p`
  ${marketingStyles.marketing.textLarge}
  margin: 0;
`;

const Detail = styled.div`
  margin-top: 64px;

  @media (min-width: ${breakpoint * 1.5}px) {
    margin-top: 0;
    width: 50%;
  }

  h2 {
    ${marketingStyles.marketing.subheading}
    margin-bottom: 12px;
  }

  code {
    font-size: ${typography.size.s3 - 1}px;
  }

  a {
    &,
    &:hover,
    &:focus,
    &:hover:focus {
      color: ${darken(0.2, color.secondary)};
    }
  }
`;

function Guide({ data }) {
  const {
    currentPage: {
      html,
      frontmatter: {
        authors,
        contributorCount,
        contributors,
        coverImagePath,
        heroAnimationName,
        heroDescription,
        themeColor,
        themeGradientName,
        title,
        toc,
        overview,
      },
    },
    pages,
    translationPages,
  } = data;
  const entries = toc && toc.length > 0 ? tocEntries(toc, pages) : [];
  const languages = getGuideLanguageLinks({
    translationPages,
    firstChapter: toc && toc[0],
  }).map(({ language, tutorial }) => ({ name: getLanguageName(language), tutorial }));
  return (
    <AppLayout
      includePageMargins={false}
      includePaddingTop={false}
      inverseHeader
      subNav={
        <SubNavBreadcrumb inverse tertiary to="/" LinkWrapper={GatsbyLinkWrapper}>
          <Icon icon="arrowleft" />
          Back to tutorials
        </SubNavBreadcrumb>
      }
    >
      <Hero
        contributorCount={contributorCount}
        chapterCount={entries.length}
        ctaHref={get(entries, '[0].slug')}
        description={heroDescription}
        heroAnimationName={heroAnimationName}
        imagePath={withPrefix(coverImagePath)}
        languages={languages}
        title={title}
        themeColor={themeColor}
        themeGradientName={themeGradientName}
      />

      <Content>
        <Overview>
          {overview && (
            <>
              <OverviewTitle>Overview</OverviewTitle>
              <OverviewDesc>{overview}</OverviewDesc>
            </>
          )}

          {entries.length > 0 && <TableOfContents entries={entries} />}
        </Overview>

        <Detail>
          <div dangerouslySetInnerHTML={{ __html: html }} />

          <Contributors authors={authors} contributors={contributors} />
        </Detail>
      </Content>
    </AppLayout>
  );
}

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

        contributors: PropTypes.arrayOf(PropTypes.any),
        contributorCount: PropTypes.string,
        coverImagePath: PropTypes.string,
        description: PropTypes.string.isRequired,
        heroAnimationName: PropTypes.string,
        heroDescription: PropTypes.string,
        themeColor: PropTypes.string.isRequired,
        themeGradientName: PropTypes.string,
        toc: PropTypes.arrayOf(PropTypes.string.isRequired),
        title: PropTypes.string.isRequired,
        overview: PropTypes.string.isRequired,
      }).isRequired,
      fields: PropTypes.shape({
        guide: PropTypes.any,

        permalink: PropTypes.any,
      }),
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
        permalink: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    translationPages: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            fields: PropTypes.shape({
              chapter: PropTypes.string,
              framework: PropTypes.string,
              language: PropTypes.string,
              slug: PropTypes.string,
            }),
          }),
        })
      ),
    }),
  }).isRequired,
};

export default Guide;

function GuideHead({
  data: {
    currentPage: {
      frontmatter: { title, description },
      fields: { guide, permalink },
    },
    site: { siteMetadata },
  },
}) {
  return (
    <PageHead
      title={title}
      description={description}
      permalink={permalink}
      image={`${siteMetadata.permalink}/${guide}/opengraph-cover.jpg`}
    />
  );
}

GuideHead.propTypes = {
  data: Guide.propTypes.data,
};

// Gatsby compiles this file once more without the Head export for the page itself, so nothing
// else may refer to Head: its props are validated on GuideHead instead of on Head itself.
export function Head(props) {
  return <GuideHead {...props} />;
}

export const query = graphql`
  query GuideQuery($slug: String!, $guide: String!) {
    site {
      siteMetadata {
        permalink
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
        themeGradientName
        toc
        overview
      }
      fields {
        guide
        permalink
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
            chapter
            framework
            language
            slug
          }
        }
      }
    }
  }
`;
