import React from 'react';
import PropTypes from 'prop-types';
import FrameworkMenu from './FrameworkMenu';
import NonFrameworkMenu from './NonFrameworkMenu';

const LanguageMenu = props => {
  if (props.framework) {
    return <FrameworkMenu {...props} />;
  }

  return <NonFrameworkMenu {...props} />;
};

LanguageMenu.propTypes = {
  framework: PropTypes.string,
};

LanguageMenu.defaultProps = {
  framework: null,
};

export default LanguageMenu;
