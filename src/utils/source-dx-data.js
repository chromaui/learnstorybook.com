// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require('node-fetch');

const apiURL = 'https://storybook-dx.netlify.app/.netlify/functions/dx-data';

const DefaultDXData = {
  subscriberCount: 6197,
  latestPost: {
    title: 'Community Showcase #5',
    url: 'https://storybook.js.org/blog/community-showcase-5',
  },
  npmDownloads: 19889108,
  githubStars: 78998,
  latestVersion: '7.0',
  twitterFollowerCount: 18350,
  discordMemberCount: 18596,
  githubContributorCount: 1999,
  contributors: [
    {
      name: 'arunoda',
      avatar: 'https://avatars.githubusercontent.com/u/50838?v=4',
      url: 'https://github.com/arunoda',
    },
    {
      name: 'jonniebigodes',
      avatar: 'https://avatars.githubusercontent.com/u/22988955?v=4',
      url: 'https://github.com/jonniebigodes',
    },
    {
      name: 'yannbf',
      avatar: 'https://avatars.githubusercontent.com/u/1671563?v=4',
      url: 'https://github.com/yannbf',
    },
  ],
  youTubeSubscriberCount: 5070,
  sponsors: [
    {
      name: 'Airbnb',
      image: 'https://images.opencollective.com/airbnb/d327d66/logo.png',
      url: 'https://opencollective.com/airbnb',
    },
    {
      name: 'Indeed',
      image: 'https://images.opencollective.com/indeed/4b8725e/logo.png',
      url: 'https://opencollective.com/indeed',
    },
  ],
};

async function fetchDXData(skipDxData) {
  if (skipDxData) {
    return DefaultDXData;
  }
  const response = await fetch(apiURL);
  const data = await response.json();
  return data;
}

module.exports = async function sourceDXData({
  actions,
  createNodeId,
  createContentDigest,
  isDxDataEnabled,
}) {
  const { createNode } = actions;
  const response = await fetchDXData(isDxDataEnabled);
  const nodeMeta = {
    id: createNodeId(`storybook-dx-data`),
    parent: null,
    children: [],
    internal: {
      type: `DXData`,
      contentDigest: createContentDigest(response),
    },
  };

  const node = { ...response, ...nodeMeta };
  createNode(node);
};
