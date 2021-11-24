import React from 'react';
import PropTypes from 'prop-types';
import { styled, css } from '@storybook/theming';

import { styles } from '@storybook/design-system';

const { pageMargin, pageMargins, breakpoint } = styles;

const Layout = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;

  > * {
    padding-bottom: 2rem;
  }

  @media (min-width: ${breakpoint * 1}px) {
    padding-bottom: 3rem;

    > * {
      padding-bottom: 1.5rem;
    }
  }

  ${(props) =>
    props.columns === 2 &&
    css`
      ${pageMargins};
      @media (min-width: ${breakpoint * 1}px) {
        margin: 0 ${pageMargin * 3}%;
        > * {
          flex: 0 1 33.33%;
        }
      }
      @media (min-width: ${breakpoint * 2}px) {
        margin: 0 ${pageMargin * 4}%;
      }
    `};

  ${(props) =>
    props.columns === 3 &&
    css`
      ${pageMargins};
      @media (min-width: ${breakpoint * 1}px) {
        > * {
          flex: 0 1 25%;
        }
      }
    `};
`;

export default function FeaturesLayout({ columns, children, ...props }) {
  return (
    <Layout columns={columns} {...props}>
      {children}
    </Layout>
  );
}

FeaturesLayout.propTypes = {
  columns: PropTypes.number,
  children: PropTypes.node,
};

FeaturesLayout.defaultProps = {
  columns: 2,
  children: null,
};
