// Our wrapper around react-popper that does common stuff.

import React from 'react';
import PropTypes from 'prop-types';
import { Manager, Target, Popper, Arrow } from 'react-popper';
import styled, { css } from 'styled-components';
import { typography } from './shared/styles';

// We need to ensure these are inline block so they get the sizing from their
// children. An alternate approach if this is annoying is to make the children
// themselves the target/popper but this means we'd need a ref to them, which
// makes this a bit clunkier to use.
const StyledTarget = styled(Target)`
  display: inline-block;
  cursor: ${props => (props.mode === 'hover' ? 'default' : 'pointer')};
`;

const ifPlacementEquals = (placement, value, fallback = 0) => props =>
  props['data-placement'].split('-')[0] === placement ? value : fallback;

const ArrowSpacing = 8;

const StyledArrow = styled.div`
  position: absolute;
  border-style: solid;

  margin-bottom: ${ifPlacementEquals('top', '0', ArrowSpacing)}px;
  margin-top: ${ifPlacementEquals('bottom', '0', ArrowSpacing)}px;
  margin-right: ${ifPlacementEquals('left', '0', ArrowSpacing)}px;
  margin-left: ${ifPlacementEquals('right', '0', ArrowSpacing)}px;

  bottom: ${ifPlacementEquals('top', ArrowSpacing * -1, 'auto')}px;
  top: ${ifPlacementEquals('bottom', ArrowSpacing * -1, 'auto')}px;
  right: ${ifPlacementEquals('left', ArrowSpacing * -1, 'auto')}px;
  left: ${ifPlacementEquals('right', ArrowSpacing * -1, 'auto')}px;

  border-bottom-width: ${ifPlacementEquals('top', '0', ArrowSpacing)}px;
  border-top-width: ${ifPlacementEquals('bottom', '0', ArrowSpacing)}px;
  border-right-width: ${ifPlacementEquals('left', '0', ArrowSpacing)}px;
  border-left-width: ${ifPlacementEquals('right', '0', ArrowSpacing)}px;

  border-top-color: ${ifPlacementEquals('top', 'white', 'transparent')};
  border-bottom-color: ${ifPlacementEquals('bottom', 'white', 'transparent')};
  border-left-color: ${ifPlacementEquals('left', 'white', 'transparent')};
  border-right-color: ${ifPlacementEquals('right', 'white', 'transparent')};
`;

const WrapperArrow = props => <Arrow {...props} component={StyledArrow} />;

// prettier-ignore
const StyledPopper = styled.div`
  display: ${props => (props.hidden ? 'none' : 'inline-block')};
  z-index: 2147483647;

  ${props => !props.hasChrome && css`
    margin-bottom: ${ifPlacementEquals('top', 8)}px;
    margin-bottom: ${ifPlacementEquals('top-start', 8)}px;
    margin-top: ${ifPlacementEquals('bottom', 8)}px;
    margin-top: ${ifPlacementEquals('bottom-start', 8)}px;
    margin-left: ${ifPlacementEquals('right', 8)}px;
    margin-right: ${ifPlacementEquals('left', 8)}px;
  `}

  ${props => props.hasChrome && css`
    margin-bottom: ${ifPlacementEquals('top', ArrowSpacing + 2)}px;
    margin-top: ${ifPlacementEquals('bottom', ArrowSpacing + 2)}px;
    margin-left: ${ifPlacementEquals('right', ArrowSpacing + 2)}px;
    margin-right: ${ifPlacementEquals('left', ArrowSpacing + 2)}px;

    background-image: linear-gradient(-1deg, rgba(248,248,248,0.97) 0%, rgba(255,255,255,0.97) 100%);
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.05), 0 5px 15px 0 rgba(0,0,0,0.10);
    border-radius: 4px;
    font-size: ${typography.size.s1}px;
  `}
`;

const RawPopperWithArrow = ({ children, hasChrome, ...props }) => (
  <StyledPopper hasChrome={hasChrome} {...props}>
    {children}
    {hasChrome && <WrapperArrow data-placement={props['data-placement']} />}
  </StyledPopper>
);

RawPopperWithArrow.propTypes = {
  children: PropTypes.node.isRequired,
  hasChrome: PropTypes.bool,
  'data-placement': PropTypes.string,
};

RawPopperWithArrow.defaultProps = {
  hasChrome: false,
  'data-placement': 'top',
};

const PopperWithArrow = props => <Popper {...props} component={RawPopperWithArrow} />;

export { Manager, StyledTarget as Target, PopperWithArrow };
