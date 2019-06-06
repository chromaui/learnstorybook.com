import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import { darken } from 'polished';
import Helmet from 'react-helmet';
import { Button, Icon, Link, styles, Subheading } from '@storybook/design-system';

import Highlight from '../components/atoms/Highlight';
import GatsbyLink from '../components/atoms/GatsbyLink';
import CTA from '../components/molecules/CTA';
import ShadowBoxCTA from '../components/molecules/ShadowBoxCTA';
import TableOfContents from '../components/molecules/TableOfContents';
import tocEntries from '../lib/tocEntries';

import formatting from '../styles/formatting';

const { background, color, pageMargins, breakpoint, typography } = styles;

const Sidebar = styled.div`
  flex: 0 1 240px;
  padding-right: 20px;

  @media (max-width: ${breakpoint - 1}px) {
    flex: none;
    margin: 1rem 0 2rem;
    width: 100%;
    border-bottom: 1px solid ${color.mediumlight};
  }
`;

const HighlightWrapper = styled(Highlight)`
  margin-bottom: 3rem;
`;

const Content = styled.div`
  ${formatting};
  flex: 1;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  ${'' /* Allows Flexbox to overflow  */};
  min-width: 0;
`;

const DocsWrapper = styled.div`
  ${pageMargins};
  display: flex;
  flex-direction: column;

  @media screen and (min-width: ${breakpoint}px) {
    flex-direction: row;
    padding-top: 4rem;
    padding-bottom: 3rem;
  }
`;

const GithubLinkWrapper = styled.div`
  margin-top: 3rem;
  text-align: center;
`;

const GithubLink = styled(Link)`
  font-weight: ${typography.weight.bold};
  font-size: ${typography.size.s2}px;
`;

const CTAMessage = styled.div`
  overflow: hidden;
  flex: 1;
`;

const CTAWrapper = styled.a`
  font-weight: ${typography.weight.black};
  font-size: ${typography.size.s3}px;
  line-height: 1.2;
  background: ${color.app};
  color: ${color.dark};
  border-radius: 4px;
  padding: 30px 20px;
  margin-bottom: 1rem;
  display: block;
  transition: all 150ms ease-out;
  text-decoration: none;
  overflow: hidden;
  display: flex;
  align-items: center;

  &:hover {
    background: ${darken(0.02, background.app)};
  }

  @media screen and (min-width: ${breakpoint}px) {
    font-size: ${typography.size.m1}px;
  }

  svg {
    flex: 0 1 40px;
    height: 40px;
    margin-left: 10px;
    margin-right: 30px;
  }
`;

const Pagination = styled.div`
  margin-top: 48px;
`;

const PaginationSubheading = styled(Subheading)`
  color: ${color.mediumdark};
  font-size: ${typography.size.s2}px;
  letter-spacing: 6px;
  line-height: 20px;
`;

const PaginationShadowBoxCTA = styled(ShadowBoxCTA)`
  margin-top: 17px;
`;

const Chapter = ({
  data: {
    currentPage,
    pages,
    site: {
      siteMetadata: { title: siteTitle, toc, languages, githubUrl, codeGithubUrl, siteUrl },
    },
  },
}) => {
  const entries = tocEntries(toc, pages);
  const {
    frontmatter: { commit, title, description },
    fields: { slug, chapter, framework, language },
  } = currentPage;
  const githubFileUrl = `${githubUrl}/blob/master/content${slug.replace(/\/$/, '')}.md`;

  const nextEntry = entries[toc.indexOf(chapter) + 1];

  const otherLanguages = languages.filter(l => l !== language);

  return (
    <DocsWrapper>
      <Helmet
        title={`${title} | ${siteTitle}`}
        meta={[{ name: 'description', content: description }]}
      >
        {otherLanguages.map(otherLanguage => (
          <link
            key={otherLanguage}
            rel="alternate"
            hrefLang={otherLanguage}
            href={`${siteUrl}/${framework}/${otherLanguage}/${chapter}`}
          />
        ))}
      </Helmet>

      <Sidebar>
        <TableOfContents entries={entries} currentPageSlug={slug} />
      </Sidebar>

      <Content>
        <HighlightWrapper>{currentPage.html}</HighlightWrapper>

        {commit && (
          <CTAWrapper target="_blank" href={`${codeGithubUrl}/commit/${commit}`}>
            <Icon icon="document" />
            <CTAMessage>
              Keep your code in sync with this chapter. View {commit} on GitHub.
            </CTAMessage>
          </CTAWrapper>
        )}

        <CTAWrapper
          target="_blank"
          href="https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Flearnstorybook.com%2F&ref_src=twsrc%5Etfw&text=I%E2%80%99m%20learning%20Storybook!%20It%E2%80%99s%20a%20great%20dev%20tool%20for%20UI%20components.%20&tw_p=tweetbutton&url=https%3A%2F%2Flearnstorybook.com&via=chromaui"
        >
          <Icon icon="twitter" />
          <CTAMessage>
            Tweet {'"I’m learning Storybook! It’s a great dev tool for UI components."'}
          </CTAMessage>
        </CTAWrapper>

        {nextEntry && (
          <Pagination>
            <PaginationSubheading>Next Chapter</PaginationSubheading>

            <PaginationShadowBoxCTA
              action={
                <GatsbyLink to={nextEntry.slug}>
                  <Button appearance="secondary">Next chapter</Button>
                </GatsbyLink>
              }
              headingText={nextEntry.title}
              messageText={nextEntry.description}
            />
          </Pagination>
        )}

        <GithubLinkWrapper>
          <GithubLink tertiary href={githubFileUrl} target="_blank">
            <span role="img" aria-label="write">
              ✍️
            </span>{' '}
            Edit on GitHub – PRs welcome!
          </GithubLink>
        </GithubLinkWrapper>
      </Content>
    </DocsWrapper>
  );
};

Chapter.propTypes = {
  data: PropTypes.shape({
    currentPage: PropTypes.shape({
      fields: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        chapter: PropTypes.string.isRequired,
        framework: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired,
      }).isRequired,
      frontmatter: PropTypes.shape({
        commit: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
      }).isRequired,
    }).isRequired,
    pages: PropTypes.shape({
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
        title: PropTypes.string.isRequired,
        permalink: PropTypes.string,
        description: PropTypes.string,
        githubUrl: PropTypes.string.isRequired,
        toc: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Chapter;

export const query = graphql`
  query PageQuery($framework: String!, $language: String!, $slug: String!) {
    currentPage: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        description
        commit
      }
      fields {
        slug
        chapter
        framework
        language
      }
    }
    site {
      siteMetadata {
        title
        toc
        languages
        githubUrl
        codeGithubUrl
        siteUrl
      }
    }
    pages: allMarkdownRemark(
      filter: { fields: { framework: { eq: $framework }, language: { eq: $language } } }
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
            chapter
          }
        }
      }
    }
  }
`;
