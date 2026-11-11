import React from 'react';
import PropTypes from 'prop-types';
import { graphql, useStaticQuery } from 'gatsby';

/**
 * The document head for every page, rendered through each page's `Head` export. Gatsby's Head
 * API does not merge tags the way react-helmet did, so this renders the complete set once: the
 * site-wide values from siteMetadata, replaced by the page's own where it passes them.
 */
function PageHead({ title = null, description = null, permalink = null, image = null }) {
  const {
    site: { siteMetadata },
  } = useStaticQuery(graphql`
    query PageHead {
      site {
        siteMetadata {
          title
          description
          permalink
        }
      }
    }
  `);

  const documentTitle = title ? `${title} | ${siteMetadata.title}` : siteMetadata.title;
  const socialTitle = title || siteMetadata.title;
  const pageDescription = description || siteMetadata.description;
  const pageUrl = permalink || siteMetadata.permalink;
  const imageUrl = image || `${siteMetadata.permalink}/opengraph-cover.jpg`;

  return (
    <>
      <link
        rel="shortcut icon"
        type="image/png"
        href={`${siteMetadata.permalink}/icon-storybook.png`}
        sizes="16x16 32x32 64x64"
      />
      <title>{documentTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={pageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />

      <meta name="google-site-verification" content="YjriYM9U-aWxhu_dv3PWfCFQ3JNkb7ndk7r_mUlCKAY" />
    </>
  );
}

PageHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  permalink: PropTypes.string,
  image: PropTypes.string,
};

export default PageHead;
