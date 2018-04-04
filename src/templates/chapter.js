import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import Helmet from 'react-helmet'

import Highlight from '../components/Highlight'
import Link from '../components/Link'
import CTA from '../components/CTA'
import Button from '../components/Button'

import Subheading from '../components/Subheading'

import {
  color,
  formatting,
  spacing,
  typography,
  pageMargins,
  breakpoint,
} from '../components/shared/styles'

const Heading = styled(Subheading)`
  display: block;
  font-size: ${typography.size.s1}px;
  line-height: 1rem;
  color: ${color.medium};

  margin-bottom: 0.5rem;
  @media (min-width: ${breakpoint * 1}px) {
    margin-bottom: 1rem;
  }
`

const DocsItem = styled.li`
  a.selected {
    font-weight: ${typography.weight.extrabold};
  }
`

const DocsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
`

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

    a {
      line-height: 1rem;
      padding: 8px 0;
      line-height: 1.5;
      position: relative;
      z-index: 1;

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
        }

        &.selected:after {
          background: ${color.primary};
        }
      }
    }
  }
`

const Markdown = styled.div`
  margin-bottom: 3rem;
`

const Content = styled.div`
  ${formatting};
  flex: 1;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`

const DocsWrapper = styled.div`
  ${pageMargins};
  display: flex;
  flex-direction: column;

  @media screen and (min-width: ${breakpoint}px) {
    flex-direction: row;
    padding-top: 4rem;
    padding-bottom: 3rem;
  }
`

const NextChapterSubtitle = styled.div`
  display: block;
  margin-top: 0.25rem;
  font-size: 18px;
  font-weight: ${typography.weight.regular};
`

const GithubLink = styled(Link)`
  font-weight: ${typography.weight.bold};
`
const GithubLinkWrapper = styled.div`
  margin-top: 3rem;
  text-align: center;
`

const Tweet = styled.div`
  overflow: hidden;
`

const TweetMessage = styled.div`
  font-weight: ${typography.weight.extrabold};
  font-size: ${typography.size.s3}px;
  @media screen and (min-width: ${breakpoint}px) {
    font-size: ${typography.size.m1}px;
  }
  line-height: 1.2;
  color: ${color.mediumdark};
`

const TweetWrapper = styled.a`
  background: ${color.app};
  border-radius: 4px;
  padding: 30px 20px;
  margin-bottom: 3rem;
  display: block;
  transition: all 150ms ease-out;
  text-decoration: none;

  &:hover {
    background: ${darken(0.02, color.app)};
  }

  svg {
    float: left;
    width: 40px;
    height: 40px;
    margin-left: 10px;
    margin-right: 30px;
    margin-top: 4px;

    path {
      fill: ${color.primary};
    }
  }
`

export default ({ data, location }) => {
  const post = data.markdownRemark
  const { commit, title, description } = post.frontmatter

  const { toc } = data.site.siteMetadata
  const tocEntries = toc.map(slug => {
    const node = data.allMarkdownRemark.edges
      .map(e => e.node)
      .find(({ fields }) => fields.slug === slug)

    if (!node) {
      throw new Error(
        `Didn't find chapter for slug:"${slug}" -- is the config's TOC in sync with the chapters?`
      )
    }
    const { tocTitle, title, description } = node.frontmatter

    return { slug, title: tocTitle || title, description }
  })

  const { slug } = post.fields
  const { githubUrl, codeGithubUrl } = data.site.siteMetadata
  const githubFileUrl = `${githubUrl}/blob/master/content/${slug.replace(
    /\//g,
    ''
  )}.md`

  const nextEntry = tocEntries[toc.indexOf(slug) + 1]

  return (
    <DocsWrapper>
      <Helmet
        title={title + ` | ` + data.site.siteMetadata.title}
        meta={[{ name: 'description', content: description }]}
      />
      <Sidebar>
        <Heading>Table of Contents</Heading>
        <DocsList>
          {tocEntries.map(({ slug, title }) => (
            <DocsItem key={slug}>
              <Link
                isGatsby
                strict
                className={location.pathname !== slug ? 'tertiary' : 'selected'}
                to={slug}
              >
                {title}
              </Link>
            </DocsItem>
          ))}
        </DocsList>
      </Sidebar>
      <Content>
        <Markdown>
          <Highlight>{post.html}</Highlight>
        </Markdown>

        {commit && (
          <div>
            <h2>Code</h2>
            <p>
              Want to see a working version of this chapter? Checkout out{' '}
              <a href={`${codeGithubUrl}/commit/${commit}`}>{commit}</a> on
              GitHub.
            </p>
          </div>
        )}

        <TweetWrapper
          target="_blank"
          href="https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Flearnstorybook.com%2F&ref_src=twsrc%5Etfw&text=I%E2%80%99m%20learning%20Storybook!%20It%E2%80%99s%20an%20awesome%20dev%20tool%20for%20UI%20components.%20&tw_p=tweetbutton&url=https%3A%2F%2Flearnstorybook.com&via=hi_chroma"
        >
          <TweetMessage>
            <svg viewBox="0 0 16 16">
              <path
                fill="#828282"
                d="M15.969,3.058c-0.586,0.26-1.217,0.436-1.878,0.515c0.675-0.405,1.194-1.045,1.438-1.809c-0.632,0.375-1.332,0.647-2.076,0.793c-0.596-0.636-1.446-1.033-2.387-1.033c-1.806,0-3.27,1.464-3.27,3.27 c0,0.256,0.029,0.506,0.085,0.745C5.163,5.404,2.753,4.102,1.14,2.124C0.859,2.607,0.698,3.168,0.698,3.767 c0,1.134,0.577,2.135,1.455,2.722C1.616,6.472,1.112,6.325,0.671,6.08c0,0.014,0,0.027,0,0.041c0,1.584,1.127,2.906,2.623,3.206 C3.02,9.402,2.731,9.442,2.433,9.442c-0.211,0-0.416-0.021-0.615-0.059c0.416,1.299,1.624,2.245,3.055,2.271 c-1.119,0.877-2.529,1.4-4.061,1.4c-0.264,0-0.524-0.015-0.78-0.046c1.447,0.928,3.166,1.469,5.013,1.469 c6.015,0,9.304-4.983,9.304-9.304c0-0.142-0.003-0.283-0.009-0.423C14.976,4.29,15.531,3.714,15.969,3.058z"
              />
            </svg>
            <Tweet>
              Tweet "I’m learning Storybook! It’s an awesome dev tool for UI
              components."
            </Tweet>
          </TweetMessage>
        </TweetWrapper>

        {nextEntry && (
          <CTA
            text={
              <div>
                {nextEntry.title}
                <NextChapterSubtitle>
                  {nextEntry.description}
                </NextChapterSubtitle>
              </div>
            }
            action={
              <Link isGatsby to={nextEntry.slug}>
                <Button small tertiary>
                  Read chapter
                </Button>
              </Link>
            }
          />
        )}
        <GithubLinkWrapper>
          <GithubLink
            className="secondary"
            href={githubFileUrl}
            target="_blank"
          >
            ✍️ Edit on GitHub
          </GithubLink>
        </GithubLinkWrapper>
      </Content>
    </DocsWrapper>
  )
}

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        description
        commit
      }
      fields {
        slug
      }
    }
    site {
      siteMetadata {
        title
        toc
        githubUrl
        codeGithubUrl
      }
    }
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            tocTitle
            title
            description
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
