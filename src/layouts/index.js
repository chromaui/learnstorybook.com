import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled, { css } from 'styled-components';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { injectGlobalStyles } from '../components/shared/global';

injectGlobalStyles();

const HeaderWrapper = styled(Header)`
  ${props =>
    props.isHome &&
    css`
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
    `};
`;

const TemplateWrapper = ({
  data: { site: { siteMetadata: { title, permalink, description, githubUrl, toc } } },
  location: { pathname },
  children,
}) => (
  <Fragment>
    <Helmet title={title} meta={[{ name: 'description', content: description }]}>
      <link
        rel="shortcut icon"
        type="image/png"
        href="/icon-learnstorybook.png"
        sizes="16x16 32x32 64x64"
      />

      <meta property="og:image" content="/opengraph-cover.jpg" />
      <meta name="twitter:image" content="/opengraph-cover.jpg" />
      <meta property="og:url" content={permalink} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      <meta name="google-site-verification" content="YjriYM9U-aWxhu_dv3PWfCFQ3JNkb7ndk7r_mUlCKAY" />
    </Helmet>

    <HeaderWrapper
      title={title}
      githubUrl={githubUrl}
      inverse={pathname === '/'}
      isHome={pathname === '/'}
      firstChapter={toc[0]}
    />

    {children()}
    <Footer />
  </Fragment>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func.isRequired,
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
        toc
      }
    }
  }
`;
