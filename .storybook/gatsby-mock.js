// Stand-in for the `gatsby` package inside Storybook. Vite cannot prebundle Gatsby's browser
// entry (it is JSX in .js files), and stories never navigate: Link renders an anchor that
// reports clicks through window.___navigate, and the static-query data is inlined at build
// time by babel-plugin-remove-graphql-queries, so the remaining stubs only need to resolve.
import React from 'react';
import PropTypes from 'prop-types';

export const withPrefix = (path) => path;

export const navigate = (to) => {
  window.___navigate(to);
};

export const graphql = () => {};

export const useStaticQuery = () => {
  throw new Error(
    'useStaticQuery ran at runtime in Storybook: babel-plugin-remove-graphql-queries did not inline this query.'
  );
};

export const Link = React.forwardRef(function Link(
  { to, children, onClick, activeClassName, activeStyle, partiallyActive, getProps, ...rest },
  ref
) {
  const handleClick = (event) => {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      event.preventDefault();
      navigate(to);
    }
  };
  return (
    <a href={withPrefix(to)} onClick={handleClick} ref={ref} {...rest}>
      {children}
    </a>
  );
});

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func,
  activeClassName: PropTypes.string,
  activeStyle: PropTypes.object,
  partiallyActive: PropTypes.bool,
  getProps: PropTypes.func,
};
