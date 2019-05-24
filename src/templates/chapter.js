import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import { darken } from 'polished';
import Helmet from 'react-helmet';
import { Button, Icon, Link, Subheading, styles } from '@storybook/design-system';

import GatsbyLink from '../components/GatsbyLink';
import Highlight from '../components/Highlight';
import CTA from '../components/CTA';
import tocEntries from '../lib/tocEntries';

import formatting from '../components/shared/formatting';

const { background, color, pageMargins, breakpoint, typography } = styles;

const Heading = styled(Subheading)`
  display: block;
  font-size: ${typography.size.s1}px;
  line-height: 1rem;
  color: ${color.medium};

  margin-bottom: 0.5rem;
  @media (min-width: ${breakpoint * 1}px) {
    margin-bottom: 1rem;
  }
`;

const DocsItem = styled.li`
  a {
    line-height: 1rem;
    padding: 8px 0;
    line-height: 1.5;
    position: relative;
    z-index: 1;
    ${props => props.isActive && `font-weight: ${typography.weight.black};`}

    @media screen and (min-width: ${breakpoint}px) {
      &:after {
        position: absolute;
        top: 15px;
        right: auto;
        bottom: auto;
        left: -23px;
        width: auto;
        height: auto;
        background: ${color.mediumlight};
        box-shadow: white 0 0 0 4px;
        height: 8px;
        width: 8px;
        border-radius: 1em;
        text-decoration: none !important;
        content: '';
        ${props => props.isActive && `background: ${color.primary};`}
      }
    }
  }
`;

const DocsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
`;

const Sidebar = styled.div`
  flex: 0 1 240px;
  padding-right: 20px;

  @media (max-width: ${breakpoint - 1}px) {
    flex: none;
    margin: 1rem 0 2rem;
    width: 100%;
    border-bottom: 1px solid ${color.mediumlight};
  }

  ${DocsList} {
    list-style: none;
    padding: 0;
    margin: 0 0 0 0;
    position: relative;

    @media screen and (min-width: ${breakpoint}px) {
      margin: 0 0 2rem 24px;
      &:after {
        position: absolute;
        top: 12px;
        right: auto;
        bottom: 12px;
        left: -20px;
        width: auto;
        height: auto;
        border-left: 1px solid ${color.light};
        content: '';
        z-index: 0;
      }
    }

    @media (max-width: ${breakpoint - 1}px) {
      margin-bottom: 1rem;

      li {
        display: inline-block;
        margin-right: 15px;
      }
    }
  }
`;

const Markdown = styled.div`
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

const NextChapterSubtitle = styled.div`
  display: block;
  margin-top: 0.5rem;
  font-size: 18px;
  line-height: 1.65;
  font-weight: ${typography.weight.regular};
`;

const GithubLink = styled(Link)`
  font-weight: ${typography.weight.bold};
`;

const GithubLinkWrapper = styled.div`
  margin-top: 3rem;
  text-align: center;
`;

const CTAMessage = styled.div`
  overflow: hidden;
`;

const CTAWrapper = styled.a`
  font-weight: ${typography.weight.black};
  font-size: ${typography.size.s3}px;
  @media screen and (min-width: ${breakpoint}px) {
    font-size: ${typography.size.m1}px;
  }
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

  ${CTAMessage} {
    flex: 1;
  }

  svg {
    flex: 0 1 40px;
    height: 40px;
    margin-left: 10px;
    margin-right: 30px;
  }
`;

const Pagination = styled(CTA)`
  margin-top: 3rem;
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
        <Heading>Table of Contents</Heading>
        <DocsList>
          {entries.map(entry => {
            const isActive = slug === entry.slug;

            return (
              <DocsItem key={entry.slug} isActive={isActive}>
                <Link LinkWrapper={GatsbyLink} to={entry.slug} tertiary={!isActive}>
                  {entry.title}
                </Link>
              </DocsItem>
            );
          })}
        </DocsList>
      </Sidebar>
      <Content>
        <Markdown>
          <Highlight>{currentPage.html}</Highlight>
        </Markdown>

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
          <Pagination
            text={
              <div>
                {nextEntry.title}
                <NextChapterSubtitle>{nextEntry.description}</NextChapterSubtitle>
              </div>
            }
            action={
              <GatsbyLink to={nextEntry.slug}>
                <Button appearance="secondary">Next chapter</Button>
              </GatsbyLink>
            }
          />
        )}
        <GithubLinkWrapper>
          <GithubLink secondary href={githubFileUrl} target="_blank">
            <span role="img" aria-label="write">
              ✍️
            </span>{' '}
            Edit on GitHub
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
