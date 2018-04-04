import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled, { css } from 'styled-components';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { injectGlobalStyles } from '../components/shared/global';

injectGlobalStyles();

const HeaderWrapper = styled(Header)`
  ${props =>
    props.home &&
    css`
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
    `};
`;

const TemplateWrapper = ({ data, children }) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        {
          name: 'description',
          content: data.site.siteMetadata.description,
        },
      ]}
    >
      <link
        rel="shortcut icon"
        type="image/png"
        href="/icon-learnstorybook.png"
        sizes="16x16 32x32 64x64"
      />

      <meta property="og:image" content="/opengraph-cover.png" />
      <meta name="twitter:image" content="/opengraph-cover.png" />
      <meta property="og:url" content={data.site.siteMetadata.permalink} />
      <meta property="og:title" content={data.site.siteMetadata.title} />
      <meta property="og:description" content={data.site.siteMetadata.description} />
      <meta name="twitter:title" content={data.site.siteMetadata.title} />
      <meta name="twitter:description" content={data.site.siteMetadata.description} />

      <meta name="google-site-verification" content="YjriYM9U-aWxhu_dv3PWfCFQ3JNkb7ndk7r_mUlCKAY" />
    </Helmet>

    <HeaderWrapper
      title={data.site.siteMetadata.title}
      githubUrl={data.site.siteMetadata.githubUrl}
      inverse={location.pathname === '/'}
      home={location.pathname === '/'}
    />

    <div>{children()}</div>
    <Footer />
  </div>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;

export const query = graphql`
  query TemplateWrapper {
    site {
      siteMetadata {
        title
        description
        githubUrl
        permalink
      }
    }
  }
`;
