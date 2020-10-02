import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, styles } from '@storybook/design-system';

const { typography } = styles;

const GithubLinkWrapper = styled.div`
  margin-top: 3rem;
  text-align: center;
`;

const LinkWrapper = styled(Link)`
  font-weight: ${typography.weight.bold};
  font-size: ${typography.size.s2}px;
`;

const GithubLink = ({ githubFileUrl }) => (
  <GithubLinkWrapper>
    <LinkWrapper tertiary href={githubFileUrl} target="_blank" rel="noopener">
      <span role="img" aria-label="write">
        ✍️
      </span>{' '}
      Edit on GitHub – PRs welcome!
    </LinkWrapper>
  </GithubLinkWrapper>
);

GithubLink.propTypes = {
  githubFileUrl: PropTypes.string.isRequired,
};

export default GithubLink;
