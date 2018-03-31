import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'styled-components'

import Header from '../components/Header'

import { injectGlobalStyles } from '../components/shared/global'
import { color } from '../components/shared/styles'

injectGlobalStyles()

const Sidebar = styled.div`
  background: ${color.secondary};
`
const Content = styled.div`
  background: ${color.primary};
`

const TemplateWrapper = ({ data, children }) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
      ]}
    />
    <Header title={data.site.siteMetadata.title} />

    <Sidebar>Sidebar</Sidebar>
    <Content>Content</Content>
    {data.allMarkdownRemark.edges.map(({ node }) => (
      <Link key={node.id} to={node.fields.slug}>
        {node.frontmatter.title}
      </Link>
    ))}

    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '0px 1.0875rem 1.45rem',
        paddingTop: 0,
      }}
    >
      {children()}
    </div>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper

export const query = graphql`
  query TemplateWrapper {
    site {
      siteMetadata {
        title
      }
    }

    allMarkdownRemark(sort: { fields: [fileAbsolutePath] }) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
