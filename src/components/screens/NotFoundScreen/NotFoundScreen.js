import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { NotFoundScreen as MarketingNotFound } from '@storybook/components-marketing';

import AppLayout from '../../composite/AppLayout';

const ALGOLIA_API_KEY = process.env.GATSBY_ALGOLIA_API_KEY;

function NotFoundScreen() {
  const {
    site: {
      siteMetadata: { githubUrl },
    },
    dxData: { latestVersion },
  } = useStaticQuery(graphql`
    query NotFoundScreenQuery {
      site {
        siteMetadata {
          githubUrl
        }
      }
      dxData {
        latestVersion
      }
    }
  `);

  return (
    <AppLayout>
      <MarketingNotFound
        includeSpacing={false}
        apiKey={ALGOLIA_API_KEY}
        repoUrl={`${githubUrl}/issues`}
        latestVersionString={latestVersion}
      />
    </AppLayout>
  );
}

export default NotFoundScreen;
