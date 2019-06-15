import React from 'react';
import IndexScreen from '../components/screens/IndexScreen';

const Index = props => <IndexScreen {...props} />;

export default Index;

export const query = graphql`
  query IndexGuidesQuery {
    guides: allMarkdownRemark(filter: { fields: { pageType: { eq: "guide" } } }) {
      edges {
        node {
          frontmatter {
            description
            imagePath
            themeColor
            title
          }
          fields {
            guide
            slug
          }
        }
      }
    }
    chapters: allMarkdownRemark(
      filter: { fields: { pageType: { eq: "chapter" }, isDefaultTranslation: { eq: true } } }
    ) {
      edges {
        node {
          fields {
            guide
          }
        }
      }
    }
    allEditionsChapters: allMarkdownRemark(filter: { fields: { pageType: { eq: "chapter" } } }) {
      edges {
        node {
          fields {
            slug
          }
        }
      }
    }
  }
`;
