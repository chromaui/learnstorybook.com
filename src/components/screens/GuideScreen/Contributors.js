import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import pluralize from 'pluralize';
import { styles } from '@storybook/design-system';
import Subheading from './SubHeading';
import User from '../../composite/User';

const { breakpoint } = styles;

const ContributorsWrapper = styled.div`
  @media (min-width: ${breakpoint}px) {
    display: flex;
  }
`;

const CommunityDetailItem = styled.div`
  @media (min-width: ${breakpoint}px) {
    flex: 0 0 50%;

    &:first-of-type {
      margin-right: 40px;
    }
  }
`;

const UserWrapper = styled(User)`
  margin-top: 20px;

  &:first-of-type {
    margin-top: 0;
  }
`;

const Contributors = ({ authors, contributors }) => (
  <ContributorsWrapper>
    {authors && (
      <CommunityDetailItem>
        <Subheading>{pluralize('Author', authors.length)}</Subheading>

        {authors.map(author => (
          <UserWrapper {...author} key={author.name} />
        ))}
      </CommunityDetailItem>
    )}

    {contributors && (
      <CommunityDetailItem>
        <Subheading>{pluralize('Contributor', contributors.length)}</Subheading>

        {contributors.map(contributor => (
          <UserWrapper {...contributor} key={contributor.name} />
        ))}
      </CommunityDetailItem>
    )}
  </ContributorsWrapper>
);

Contributors.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired
  ),
  contributors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired
  ),
};

Contributors.defaultProps = {
  authors: null,
  contributors: null,
};

Contributors.defaultProps = {};

export default Contributors;
