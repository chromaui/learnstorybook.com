import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, styles, Subheading } from '@storybook/design-system';
import GatsbyLink from '../../basics/GatsbyLink';
import ShadowBoxCTA from '../../composite/ShadowBoxCTA';

const { color, typography } = styles;

const PaginationWrapper = styled.div`
  margin-top: 48px;
`;

const PaginationSubheading = styled(Subheading)`
  color: ${color.mediumdark};
  font-size: ${typography.size.s2}px;
  letter-spacing: 6px;
  line-height: 20px;
`;

const PaginationShadowBoxCTA = styled(ShadowBoxCTA)`
  margin-top: 17px;
`;

const Pagination = ({ nextEntry }) =>
  nextEntry ? (
    <PaginationWrapper>
      <PaginationSubheading>Next Chapter</PaginationSubheading>

      <PaginationShadowBoxCTA
        action={
          <GatsbyLink to={nextEntry.slug}>
            <Button appearance="secondary">Next chapter</Button>
          </GatsbyLink>
        }
        headingText={nextEntry.title}
        messageText={nextEntry.description}
      />
    </PaginationWrapper>
  ) : null;

Pagination.propTypes = {
  nextEntry: PropTypes.shape({
    description: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
};

Pagination.defaultProps = {
  nextEntry: null,
};

export default Pagination;
