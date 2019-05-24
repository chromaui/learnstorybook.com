import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';

const { color, spacing, typography, breakpoint } = styles;

const Text = styled.div`
  font-weight: ${typography.weight.black};

  font-size: ${typography.size.m3}px;
  line-height: ${typography.size.m3}px;
  margin-bottom: 1.5rem;

  @media (min-width: ${breakpoint * 1}px) {
    font-size: ${typography.size.l1}px;
    line-height: ${typography.size.l1}px;
    margin-bottom: 0;
  }
`;
const Action = styled.div``;

const Inner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;

  padding: 3rem ${spacing.padding.medium}px;
  @media (min-width: ${breakpoint * 1}px) {
    text-align: left;
  }

  ${Text} {
    flex: 0 1 100%;
    @media (min-width: ${breakpoint * 1}px) {
      flex: 1;
      padding-right: 60px;
    }
  }
  ${Action} {
    flex: 0 0 100%;
    @media (min-width: ${breakpoint * 1}px) {
      flex: 0 0 auto;
    }
  }
`;

const Wrapper = styled.div`
  border-top: 1px solid ${color.mediumlight};
  border-bottom: 1px solid ${color.mediumlight};
`;

export default function CTA({ text, action, ...props }) {
  return (
    <Wrapper {...props}>
      <Inner>
        <Text>{text}</Text>
        <Action>{action}</Action>
      </Inner>
    </Wrapper>
  );
}

CTA.propTypes = {
  text: PropTypes.node,
  action: PropTypes.node,
};

CTA.defaultProps = {
  text: null,
  action: null,
};
