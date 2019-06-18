import React from 'react';
import PropTypes from 'prop-types';
import FrameworkMenu from './FrameworkMenu';

const LanguageMenu = props => {
  if (props.framework) {
    return <FrameworkMenu {...props} />;
  }

  return <div>Not a framework</div>;
};

LanguageMenu.propTypes = {
  framework: PropTypes.string,
};

LanguageMenu.defaultProps = {
  framework: null,
};

export default LanguageMenu;
