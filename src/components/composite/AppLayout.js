import React from 'react';
import PropTypes from 'prop-types';
import { graphql, useStaticQuery } from 'gatsby';
import { LinksContextProvider, defaultLinks } from '@storybook/components-marketing';
import { global, styles } from '@storybook/design-system';
import { css, styled } from '@storybook/theming';
import Helmet from 'react-helmet';

import { GatsbyLinkWrapper } from '../basics/GatsbyLink';
import Header from './Header';
import Footer from './Footer';

import '@docsearch/css';

const { GlobalStyle } = global;

const navLinks = {
  ...defaultLinks,
  tutorials: {
    url: '/',
    linkWrapper: GatsbyLinkWrapper,
  },
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled('main', {
  shouldForwardProp: (prop) => !['includePaddingTop', 'includePageMargins'].includes(prop),
})`
  flex: 1 1 auto;
  ${(props) => props.includePageMargins && styles.pageMargins};
  ${(props) =>
    props.includePaddingTop &&
    css`
      padding-top: ${4 + 9.5}rem;
    `};
  padding-bottom: 4rem;
`;

export function PureAppLayout({
  children,
  data,
  includePaddingTop,
  includePageMargins,
  inverseHeader,
  subNav,
}) {
  const {
    dxData,
    site: {
      siteMetadata: { title, permalink, description },
    },
  } = data;

  return (
    <>
      <GlobalStyle />

      <Helmet>
        <link
          rel="shortcut icon"
          type="image/png"
          href={`${permalink}/icon-storybook.png`}
          sizes="16x16 32x32 64x64"
        />
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${permalink}/opengraph-cover.jpg`} />
        <meta property="og:url" content={permalink} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${permalink}/opengraph-cover.jpg`} />

        <meta
          name="google-site-verification"
          content="YjriYM9U-aWxhu_dv3PWfCFQ3JNkb7ndk7r_mUlCKAY"
        />
      </Helmet>

      <LinksContextProvider value={navLinks}>
        <Wrapper>
          <Header
            githubStars={dxData.githubStars}
            inverse={inverseHeader}
            latestPost={dxData.latestPost}
            subNav={subNav}
            versionString={dxData.latestVersion}
          />
          <Main includePaddingTop={includePaddingTop} includePageMargins={includePageMargins}>
            {children}
          </Main>
          <Footer subscriberCount={dxData.subscriberCount} />
        </Wrapper>
      </LinksContextProvider>
    </>
  );
}

function AppLayout(props) {
  const data = useStaticQuery(graphql`
    query TemplateWrapper {
      site {
        siteMetadata {
          title
          description
          githubUrl
          permalink
        }
      }
      guides: allMarkdownRemark(
        filter: { fields: { pageType: { eq: "guide" } } }
        sort: { order: ASC, fields: [frontmatter___order] }
      ) {
        edges {
          node {
            frontmatter {
              title
              description
            }
            fields {
              slug
            }
          }
        }
      }
      dxData {
        githubStars
        latestPost {
          title
          url
        }
        latestVersion
        subscriberCount
      }
    }
  `);

  return <PureAppLayout data={data} {...props} />;
}

const appLayoutPropTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any.isRequired,
  includePaddingTop: PropTypes.bool,
  includePageMargins: PropTypes.bool,
  inverseHeader: PropTypes.bool,
};

AppLayout.propTypes = appLayoutPropTypes;

const appLayoutDefaultProps = {
  includePaddingTop: true,
  includePageMargins: true,
  inverseHeader: false,
};

AppLayout.defaultProps = appLayoutDefaultProps;

PureAppLayout.propTypes = {
  ...appLayoutPropTypes,
  data: PropTypes.shape({
    dxData: PropTypes.shape({
      githubStars: PropTypes.number.isRequired,
      latestPost: PropTypes.shape({
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }).isRequired,
      latestVersion: PropTypes.string.isRequired,
      subscriberCount: PropTypes.number.isRequired,
    }).isRequired,
    guides: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }).isRequired,
            frontmatter: PropTypes.shape({
              description: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        })
      ).isRequired,
    }).isRequired,
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        description: PropTypes.string.isRequired,
        githubUrl: PropTypes.string.isRequired,
        permalink: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

PureAppLayout.defaultProps = {
  ...appLayoutDefaultProps,
};

export default AppLayout;
