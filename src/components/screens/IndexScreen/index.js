import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { useStaticQuery, graphql, withPrefix } from 'gatsby';
import { SubNavTabs } from '@storybook/components-marketing';
import { styles } from '@storybook/design-system';
import { GatsbyLinkWrapper } from '../../basics/GatsbyLink';
import AppLayout from '../../composite/AppLayout';
import Community from './Community';
import Guides from './Guides';
import Pitch from './Pitch';
import SocialValidation from './SocialValidation';

const navItems = [
  {
    key: '0',
    label: 'Guides',
    href: 'https://storybook.js.org/docs',
  },
  {
    key: '1',
    label: 'Tutorials',
    href: '/',
    LinkWrapper: GatsbyLinkWrapper,
    isActive: true,
  },
];

// TODO: Replace these?
const logos = [
  {
    src: '/brands/logo-nike.svg',
    alt: 'Nike',
  },
  {
    src: '/brands/logo-shopify.svg',
    alt: 'Shopify',
  },
  {
    src: '/brands/logo-dazn.svg',
    alt: 'DAZN',
  },
  {
    src: '/brands/logo-invision.svg',
    alt: 'InVision',
  },
  {
    src: '/brands/logo-oreilly.svg',
    alt: `O'Reilly`,
  },
  {
    src: '/brands/logo-betterment.svg',
    alt: 'Betterment',
  },
  {
    src: '/brands/logo-hashicorp.svg',
    alt: 'Hashicorp',
  },
].map((logo) => ({
  ...logo,
  src: withPrefix(logo.src),
}));

const Logo = styled.div`
  img {
    display: block;
    width: 100%;
    max-width: 100px;
    height: auto;
    max-height: 50px;
  }
`;

const Logos = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 3rem;
  filter: grayscale(1);
  opacity: 0.5;

  @media (min-width: ${styles.breakpoint * 1.25}px) {
    display: flex;
  }

  ${Logo} {
    margin: 20px;
    flex: 0 0 20%;
    display: flex;
    justify-content: center;

    @media (min-width: ${styles.breakpoint * 1.25}px) {
      flex: 1;
    }
  }
`;

const LineBreak = styled.div`
  height: 1px;
  background: ${styles.color.mediumlight};
  margin: 48px 0;
`;

export function PureIndexScreen({ data }) {
  return (
    <AppLayout subNav={<SubNavTabs label="Docs nav" items={navItems} />}>
      <Pitch />
      <Guides chaptersEdges={data.chapters.edges} guidesEdges={data.guides.edges} />
      <Logos>
        {logos.map((logo) => (
          <Logo key={logo.src}>
            <img src={logo.src} alt={logo.alt} />
          </Logo>
        ))}
      </Logos>
      <LineBreak />
      <SocialValidation />
      <LineBreak />
      <Community />
    </AppLayout>
  );
}

PureIndexScreen.propTypes = {
  data: PropTypes.shape({
    allEditionsChapters: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
    }).isRequired,
    chapters: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
    }).isRequired,
    guides: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
    }).isRequired,
  }).isRequired,
};

function IndexScreen(props) {
  const data = useStaticQuery(graphql`
    query IndexQuery {
      guides: allMarkdownRemark(
        filter: { fields: { pageType: { eq: "guide" } } }
        sort: { order: ASC, fields: [frontmatter___order] }
      ) {
        edges {
          node {
            frontmatter {
              description
              order
              title
              themeColor
              thumbImagePath
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
  `);
  return <PureIndexScreen data={data} {...props} />;
}

export default IndexScreen;
