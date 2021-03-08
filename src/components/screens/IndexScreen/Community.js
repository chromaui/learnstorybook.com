import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Avatar, styles } from '@storybook/design-system';

const { typography } = styles;

const Section = styled.div`
  ${props =>
    !props.isFirst &&
    `
    margin-top: 64px;
  `}
`;

const Heading = styled.div`
  font-size: ${typography.size.m2}px;
  font-weight: ${typography.weight.extrabold};
  line-height: 28px;
`;

const Text = styled.div`
  font-size: ${typography.size.s3}px;
  line-height: 28px;
  margin-top: 12px;
`;

const CommunityAvatars = styled.div`
  margin-top: 24px;
  margin-left: -10px;
  margin-right: -10px;
  display: flex;
  flex-wrap: wrap;
`;

const AvatarWrapper = styled(Avatar).attrs({ size: 'large' })`
  min-width: 40px;
  margin: 10px;
`;

const PureCommunity = ({ contributors }) => (
  <div>
    <Section isFirst>
      <Heading>Peer reviewed and updated all the time</Heading>

      <Text>
        Our guides are peer reviewed by leading folks at Shopify, Auth0, and New York Times. Our
        amazing community of learners keep the guides up to date with industry best practices.
      </Text>

      <CommunityAvatars className="chromatic-ignore">
        {contributors.map(contributor => (
          <AvatarWrapper key={contributor.id} src={contributor.avatar_url} />
        ))}
      </CommunityAvatars>
    </Section>
  </div>
);

PureCommunity.propTypes = {
  contributors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar_url: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    })
  ),
};

PureCommunity.defaultProps = {
  contributors: [],
};

const contributorsUrl = 'https://api.github.com/repos/chromaui/learnstorybook.com/contributors';
const sessionStorageKey = 'lsbGithubContributors';

const Community = () => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    async function fetchGithubContributors() {
      const response = await fetch(contributorsUrl).then(res => res.json());
      if (response.message) {
        return; // Likely an error
      }
      sessionStorage.setItem(sessionStorageKey, JSON.stringify(response));
      setContributors(response);
    }

    if (sessionStorage.getItem(sessionStorageKey)) {
      // Use the cached version of contributors
      setContributors(JSON.parse(sessionStorage.getItem(sessionStorageKey)));
      return;
    }

    fetchGithubContributors();
  }, []);

  return <PureCommunity contributors={contributors} />;
};

export { PureCommunity };

export default Community;
