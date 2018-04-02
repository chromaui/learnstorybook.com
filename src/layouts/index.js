import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'styled-components'

import Header from '../components/Header.js'
import Footer from '../components/Footer.js'

import { injectGlobalStyles } from '../components/shared/global'
injectGlobalStyles()

const TemplateWrapper = ({ data, children }) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
      ]}
    >
      <script async defer src="https://buttons.github.io/buttons.js" />
    </Helmet>
    {location.pathname !== '/' && (
      <Header title={data.site.siteMetadata.title} />
    )}

    <div>{children()}</div>
    <Footer />
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
  }
`
