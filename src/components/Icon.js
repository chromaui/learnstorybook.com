import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { color } from './shared/styles';
import icons from './shared/icons';

// prettier-ignore
const Svg = styled.svg`
  display: inline-block;
  vertical-align: middle;
`;

// prettier-ignore
const Path = styled.path`
  fill: ${color.darkest};
`;

function Icon({ icon, ...props }) {
  return (
    <Svg viewBox="0 0 1024 1024" width="20px" height="20px" {...props}>
      <Path d={icons[icon]} />
    </Svg>
  );
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default Icon;
