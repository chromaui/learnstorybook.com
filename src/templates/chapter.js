import React from 'react'
import styled from 'styled-components'
import Helmet from 'react-helmet'

import Highlight from '../components/Highlight'
import Link from '../components/Link'

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
  flex: 0 1 200px;

  ${DocsList} {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem;
    position: relative;

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

    @media screen and (max-width: (${breakpoint}px - 1px)) {
      margin-bottom: 1rem;

      li {
        display: inline-block;
        margin-right: 10px;
      }
    }

    a {
      line-height: 36px;
      position: relative;
      z-index: 1;

      &:after {
        position: absolute;
        top: 14px;
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
        content:'';
      }

      &.selected:after {
        background: ${color.primary};
      }
    }
  }
`
const Content = styled.div`
  ${formatting};
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
`

const DocsWrapper = styled.div`
  ${pageMargins};
  display: flex;
  flex-direction: row;

  @media screen and (min-width: ${breakpoint}px) {
    padding-top: 4rem;
    padding-bottom: 3rem;
  }
`

export default ({ data }) => {
  const post = data.markdownRemark

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
    const { tocTitle, title } = node.frontmatter

    return { slug, title: tocTitle || title }
  })

  const { slug } = post.fields
  const { githubUrl } = data.site.siteMetadata
  const githubFileUrl = `${githubUrl}/blob/master/content/${slug.replace(
    /\//g,
    ''
  )}.md`

  const nextEntry = tocEntries[toc.indexOf(slug) + 1]

  return (
    <DocsWrapper>
      <Helmet
        title={post.frontmatter.title}
        meta={[{ name: 'description', content: post.frontmatter.description }]}
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
        <a href={githubFileUrl}>Edit on GitHub</a>
        {nextEntry && (
          <Link isGatsby to={nextEntry.slug}>
            Next: {nextEntry.title}
          </Link>
        )}
        <Highlight>{post.html}</Highlight>
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
      }
      fields {
        slug
      }
    }
    site {
      siteMetadata {
        toc
        githubUrl
      }
    }
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            tocTitle
            title
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
