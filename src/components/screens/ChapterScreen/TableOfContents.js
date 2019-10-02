import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';
import GatsbyLink from '../../basics/GatsbyLink';

const { breakpoint, color, typography } = styles;

const List = styled.ul`
  list-style: none;
  padding: 0;
  list-style: none;
  padding: 0;
  margin: 0 0 0 0;
  margin-bottom: 1rem;
  position: relative;

  @media screen and (min-width: ${breakpoint}px) {
    margin: 0 0 2rem 24px;

    &:after {
      position: absolute;
      top: 12px;
      right: auto;
      bottom: 12px;
      left: -20px;
      width: auto;
      height: auto;
      border-left: 1px solid ${color.mediumlight};
      content: '';
      z-index: 0;
    }
  }
`;

const ListItem = styled.li`
  display: inline-block;
  margin-right: 15px;

  a {
    display: inline-block;
    padding: 8px 0;
    line-height: 1.5;
    position: relative;
    z-index: 1;
    ${props => props.isActive && `font-weight: ${typography.weight.bold};`}
  }

  @media screen and (min-width: ${breakpoint}px) {
    margin-right: 0;
    display: block;

    a:after {
      position: absolute;
      top: 15px;
      right: auto;
      bottom: auto;
      left: -23px;
      width: auto;
      height: auto;
      background: ${color.medium};
      box-shadow: white 0 0 0 4px;
      height: 8px;
      width: 8px;
      border-radius: 1em;
      text-decoration: none !important;
      content: '';
      ${props => props.isActive && `background: ${color.secondary};`}
    }
  }
`;

const TableOfContents = ({ currentPageSlug, entries, ...rest }) => (
  <List {...rest}>
    {entries.map(entry => {
      const isActive = currentPageSlug === entry.slug;

      return (
        <ListItem key={entry.slug} isActive={isActive}>
          <GatsbyLink to={entry.slug} tertiary={!isActive}>
            {entry.title}
          </GatsbyLink>
        </ListItem>
      );
    })}
  </List>
);

TableOfContents.propTypes = {
  currentPageSlug: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export default TableOfContents;
