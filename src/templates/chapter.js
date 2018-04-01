import React from 'react'
import styled from 'styled-components'
import Highlight from '../components/Highlight'

export default ({ data }) => {
  const post = data.markdownRemark
  return (
    <div>
      catsdocs
      <h1>{post.frontmatter.title}</h1>
      <Highlight>{post.html}</Highlight>
    </div>
  )
}

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
