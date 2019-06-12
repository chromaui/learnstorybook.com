import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import startCase from 'lodash/startCase';
import { graphql } from 'gatsby';
import { Button, Highlight, Icon, Link, styles, Subheading } from '@storybook/design-system';
import BoxLink from '../components/atoms/BoxLink';
import GatsbyLink from '../components/atoms/GatsbyLink';
import ShadowBoxCTA from '../components/molecules/ShadowBoxCTA';
import TableOfContents from '../components/molecules/TableOfContents';
import tocEntries from '../lib/tocEntries';
import { chapterFormatting } from '../styles/formatting';

const { color, pageMargins, breakpoint, spacing, typography } = styles;

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

const SidebarBackIcon = styled(Icon).attrs({ icon: 'arrowleft' })`
  && {
    width: 14px;
  }
`;

const GuideLink = styled(Link)`
  && {
    color: ${color.darkest};
    font-size: ${typography.size.s3};
    font-weight: ${typography.weight.bold};
    letter-spacing: -0.14px;
    line-height: 20px;
    margin-bottom: 12px;
  }
`;

const TableOfContentsWrapper = styled(TableOfContents)`
  margin-top: ${spacing.padding.medium}px;
`;

const HighlightWrapper = styled(Highlight)`
  margin-bottom: 3rem;
`;

const boxLinkBreakpoint = breakpoint * 1.5;

const BoxLinksWrapper = styled.div`
  a:nth-child(n + 2) {
    margin-top: ${styles.spacing.padding.medium}px;
  }

  @media screen and (min-width: ${boxLinkBreakpoint}px) {
    display: flex;

    a {
      flex: 1;

      &:nth-child(n + 2) {
        margin-top: 0;
        margin-left: ${styles.spacing.padding.medium}px;
      }
    }
  }
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

const BoxLinkIcon = styled(Icon)`
  && {
    color: ${color.secondary};
    width: 24px;
    height: 24px;
    margin-right: ${styles.spacing.padding.medium}px;
    bottom: 0;
  }
`;

const BoxLinkContent = styled.div`
  display: flex;
  padding: ${spacing.padding.medium}px;
`;

const BoxLinkMessage = styled.div`
  color: ${color.darkest};
  font-size: 14px;
  line-height: 20px;
  flex: 1;
  max-width: 410px;
  align-self: center;

  @media screen and (min-width: ${boxLinkBreakpoint}px) {
    max-width: none;
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

const GithubLinkWrapper = styled.div`
  margin-top: 3rem;
  text-align: center;
`;

const GithubLink = styled(Link)`
  font-weight: ${typography.weight.bold};
  font-size: ${typography.size.s2}px;
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
      fields: { guide, slug, chapter },
    },
    currentGuide: {
      frontmatter: { toc },
    },
    site: {
      siteMetadata: { githubUrl, codeGithubUrl },
    },
    pages,
  },
  languageMenu,
}) => {
  const entries = tocEntries(toc, pages);
  const nextEntry = entries[toc.indexOf(chapter) + 1];
  const githubFileUrl = `${githubUrl}/blob/master/content${slug.replace(/\/$/, '')}.md`;

  return (
    <ChapterWrapper>
      <Sidebar>
        <GuideLink LinkWrapper={GatsbyLink} tertiary to={`/${guide}`}>
          <SidebarBackIcon icon="arrowleft" />
          {startCase(guide)}
        </GuideLink>

        {languageMenu}

        <TableOfContentsWrapper entries={entries} currentPageSlug={slug} />
      </Sidebar>

      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <HighlightWrapper>{html}</HighlightWrapper>

        <BoxLinksWrapper withMultiple={!!commit}>
          {commit && (
            <BoxLink to={`${codeGithubUrl}/commit/${commit}`}>
              <BoxLinkContent>
                <BoxLinkIcon icon="repository" />

                <BoxLinkMessage>
                  Keep your code in sync with this chapter. View {commit} on GitHub.
                </BoxLinkMessage>
              </BoxLinkContent>
            </BoxLink>
          )}

          <BoxLink to="https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Flearnstorybook.com%2F&ref_src=twsrc%5Etfw&text=I%E2%80%99m%20learning%20Storybook!%20It%E2%80%99s%20a%20great%20dev%20tool%20for%20UI%20components.%20&tw_p=tweetbutton&url=https%3A%2F%2Flearnstorybook.com&via=chromaui">
            <BoxLinkContent>
              <BoxLinkIcon icon="twitter" />

              <BoxLinkMessage>
                Is this free guide helping you? Tweet to give kudos and help other devs find it.
              </BoxLinkMessage>
            </BoxLinkContent>
          </BoxLink>
        </BoxLinksWrapper>

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
    </ChapterWrapper>
  );
};

export const chapterDataPropTypes = {
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
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

Chapter.propTypes = {
  ...chapterDataPropTypes,
  languageMenu: PropTypes.node,
};

Chapter.defaultProps = {
  languageMenu: null,
};

export const chapterCurrentPageFragment = graphql`
  fragment ChapterCurrentPageFragment on MarkdownRemark {
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
`;

export const chapterGuidePageFragment = graphql`
  fragment ChapterGuidePageFragment on MarkdownRemark {
    frontmatter {
      toc
      languages
    }
  }
`;

export const chapterSiteMetadataFragment = graphql`
  fragment ChapterSiteMetadataFragment on Site {
    siteMetadata {
      title
      githubUrl
      codeGithubUrl
      siteUrl
    }
  }
`;

export const chapterOtherPagesFragment = graphql`
  fragment ChapterOtherPagesFragment on MarkdownRemark {
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
`;

export default Chapter;
