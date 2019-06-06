import React from 'react';
import PropTypes from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';

import { GlobalStyle } from '../styles/global';

const HeaderWrapper = styled(Header)`
  ${props =>
    !props.withNav &&
    `
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
    `};
`;

const query = graphql`
  query TemplateWrapper {
    site {
      siteMetadata {
        title
        description
        githubUrl
        permalink
        toc
      }
    }
  }
`;

const TemplateWrapper = ({ location: { pathname }, children }) => (
  <StaticQuery
    query={query}
    render={({
      site: {
        siteMetadata: { title, permalink, description, githubUrl, toc },
      },
    }) => (
      <>
        <GlobalStyle />

        <Helmet>
          <link
            rel="shortcut icon"
            type="image/png"
            href="/icon-learnstorybook.png"
            sizes="16x16 32x32 64x64"
          />
          <title>{title}</title>
          <meta name="description" content={description} />

          <meta property="og:image" content="https://www.learnstorybook.com/opengraph-cover.jpg" />
          <meta name="twitter:image" content="https://www.learnstorybook.com/opengraph-cover.jpg" />
          <meta property="og:url" content={permalink} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />

          <meta
            name="google-site-verification"
            content="YjriYM9U-aWxhu_dv3PWfCFQ3JNkb7ndk7r_mUlCKAY"
          />
        </Helmet>

        {/* Would love to get framework from graphql variables but they are not set for the homepage */}
        <HeaderWrapper
          title={title}
          githubUrl={githubUrl}
          isInverted={pathname === '/'}
          withNav={pathname !== '/' && pathname !== '/404.html'}
          framework={pathname.split('/')[1]}
          firstChapter={toc[0]}
        />

        {children}
        <Footer />
      </>
    )}
  />
);

TemplateWrapper.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default TemplateWrapper;
