import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { darken } from 'polished';
import { color, typography } from './shared/styles';

const Text = styled.span`
  display: inline-block;
  vertical-align: top;
`;

// prettier-ignore
const ButtonWrapper = styled.button`
  border: 0;
  border-radius: 3em;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;

  position: relative;
  text-align: center;
  text-decoration: none;
  transition: all 150ms ease-out;
  transform: translate3d(0,0,0);
  vertical-align: top;
  white-space: nowrap;
  user-select: none;
  opacity: 1;
  margin: 0;
  background: transparent;


  padding: ${props => props.small ? '8px 16px' : '13px 20px'};
  font-size: ${props => props.small ? typography.size.s2 : typography.size.s3}px;

  font-weight: ${typography.weight.extrabold};
  line-height: 1;

  &:hover {
    transform: translate3d(0,-1px,0);
  }

  &:active {
    transform: translate3d(0,0,0);
  }

  ${Text} {
    transform: scale3d(1,1,1) translate3d(0,0,0);
    transition: transform 700ms ease-out;
    opacity: 1;
  }



  svg {
    height: ${props => props.small ? '14' : '16'}px;
    width: ${props => props.small ? '14' : '16'}px;
    vertical-align: top;
    margin-right: ${props => props.small ? '4' : '6'}px;
    margin-top: ${props => props.small ? '-1' : '-2'}px;
    margin-bottom: ${props => props.small ? '-1' : '-2'}px;

    /* Necessary for js mouse events to not glitch out when hovering on svgs */
    pointer-events: none;
  }

  ${props => props.disabled && css`
    cursor: not-allowed !important;
		opacity: .5;
    &:hover {
      transform: none;
    }
	`}


  ${props => props.primary && css`
    background: ${color.primary};
    color: ${color.lightest};
    svg path { fill: ${color.lightest}; }


      &:hover { background: ${darken(0.05, color.primary)};}
      &:active { box-shadow: rgba(0,0,0,.1) 0 0 0 3em inset; }

	`}

  ${props => props.primary && props.active && css`
    background: transparent;
    box-shadow: ${color.primary} 0 0 0 1px inset;
    color: ${color.primary};
    svg path { fill: ${color.primary}; }


      &:hover { background: transparent;}
      &:active {
        box-shadow: ${color.primary} 0 0 0 3em inset;
        color: ${color.lightest};
      }


	`}

  ${props => props.secondary && css`
    background: ${color.secondary};
    color: ${color.lightest};
    svg path { fill: ${color.lightest}; }


      &:hover { background: ${darken(0.05, color.secondary)}; }
      &:active { box-shadow: rgba(0,0,0,.1) 0 0 0 3em inset; }

	`}

  ${props => props.secondary && props.active && css`
    background: transparent;
    box-shadow: ${color.secondary} 0 0 0 1px inset;
    color: ${color.secondary};
    svg path { fill: ${color.secondary}; }


      &:hover { background: transparent;}
      &:active {
        box-shadow: ${color.secondary} 0 0 0 3em inset;
        color: ${color.lightest};
      }

	`}

  ${props => props.tertiary && css`
    background: ${color.tertiary};
    color: ${color.darkest};
    svg path { fill: ${color.darkest}; }


      &:hover { background: ${darken(0.05, color.tertiary)}; }
      &:active { box-shadow: rgba(0,0,0,.1) 0 0 0 3em inset; }


	`}

  ${props => props.tertiary && props.active && css`
    background: transparent;
    box-shadow: ${color.medium} 0 0 0 1px inset;
    color: ${color.darkest};
    svg path { fill: ${color.tertiary}; }


      &:hover { background: transparent;}


	`}

  ${props => props.outline && css`
    box-shadow: ${color.lightest} 0 0 0 1px inset;
		color: ${color.lightest};
    background: transparent;

    svg path { fill: ${color.lightest}; }

    &:hover { box-shadow: ${color.light} 0 0 0 1px inset; }

    &:active {
      box-shadow: ${color.lightest} 0 0 0 1px inset;
    }

	`}

  ${props => props.inverse && css`

		color: ${color.primary};
    background: ${color.lightest};

    svg path { fill: ${color.primary}; }

    &:hover { box-shadow: rgba(0,0,0,.1) 0 3px 10px 0; }

    &:active {
      color: ${darken(0.05, color.primary)};
    }

	`}

`;

const ButtonLink = ButtonWrapper.withComponent('a');

function Button({ isLink, children, ...props }) {
  if (isLink) {
    return (
      <ButtonLink {...props}>
        <Text>{children}</Text>
      </ButtonLink>
    );
  }
  return (
    <ButtonWrapper {...props}>
      <Text>{children}</Text>
    </ButtonWrapper>
  );
}

Button.propTypes = {
  isLink: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  isLink: false,
};

export default Button;
