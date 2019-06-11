import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';
import { graphql } from 'gatsby';
import GuideHero from '../components/organisms/GuideHero';
import { guideFormatting } from '../styles/formatting';

const { pageMargins } = styles;

const Content = styled.div`
  ${guideFormatting}
  ${pageMargins}
`;

const Guide = ({ data }) => {
  const {
    currentPage,
    site: { siteMetadata },
  } = data;

  return (
    <>
      <Helmet
        title={`${currentPage.frontmatter.title} | ${siteMetadata.title}`}
        meta={[{ name: 'description', content: currentPage.frontmatter.description }]}
      />

      <GuideHero
        description={currentPage.frontmatter.description}
        imagePath={currentPage.frontmatter.imagePath}
        languages={currentPage.frontmatter.languages.split(', ')}
        title={currentPage.frontmatter.title}
        themeColor={currentPage.frontmatter.themeColor}
      />

      <Content dangerouslySetInnerHTML={{ __html: currentPage.html }} />
    </>
  );
};

Guide.propTypes = {
  data: PropTypes.shape({
    currentPage: PropTypes.shape({
      html: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        description: PropTypes.string.isRequired,
        imagePath: PropTypes.string.isRequired,
        languages: PropTypes.string.isRequired,
        themeColor: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Guide;

export const query = graphql`
  query GuideQuery($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    currentPage: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        description
        languages
        title
        themeColor
        imagePath
      }
    }
  }
`;
