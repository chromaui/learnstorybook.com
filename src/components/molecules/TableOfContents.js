import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styles, Subheading, Link } from '@storybook/design-system';
import GatsbyLink from '../atoms/GatsbyLink';

const { breakpoint, color, typography } = styles;

const Heading = styled(Subheading)`
  display: block;
  font-size: ${typography.size.s1}px;
  line-height: 1rem;
  color: ${color.medium};
  margin-bottom: 0.5rem;

  @media (min-width: ${breakpoint * 1}px) {
    margin-bottom: 1rem;
  }
`;

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
      border-left: 1px solid ${color.light};
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
    ${props => props.isActive && `font-weight: ${typography.weight.black};`}
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
      background: ${color.mediumlight};
      box-shadow: white 0 0 0 4px;
      height: 8px;
      width: 8px;
      border-radius: 1em;
      text-decoration: none !important;
      content: '';
      ${props => props.isActive && `background: ${color.primary};`}
    }
  }
`;

const TableOfContents = ({ currentPageSlug, entries }) => (
  <>
    <Heading>Table of Contents</Heading>

    <List>
      {entries.map(entry => {
        const isActive = currentPageSlug === entry.slug;

        return (
          <ListItem key={entry.slug} isActive={isActive}>
            <Link LinkWrapper={GatsbyLink} to={entry.slug} tertiary={!isActive}>
              {entry.title}
            </Link>
          </ListItem>
        );
      })}
    </List>
  </>
);

TableOfContents.propTypes = {
  currentPageSlug: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
};

export default TableOfContents;
