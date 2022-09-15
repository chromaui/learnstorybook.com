// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require('node-fetch');

const apiURL = 'https://storybook-dx.netlify.app/.netlify/functions/dx-data';

async function fetchDXData() {
  const response = await fetch(apiURL);
  const data = await response.json();
  return data;
}

module.exports = async function sourceDXData({ actions, createNodeId, createContentDigest }) {
  const { createNode } = actions;

  const response = await fetchDXData();

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
