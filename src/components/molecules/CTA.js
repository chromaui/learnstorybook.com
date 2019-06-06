import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';

const { color, typography, breakpoint } = styles;

const Wrapper = styled.div`
  border-top: 1px solid ${color.mediumlight};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  padding: 58px;

  @media (min-width: ${breakpoint * 1}px) {
    text-align: left;
  }
`;

const Text = styled.div`
  font-weight: ${typography.weight.black};
  font-size: ${typography.size.m2}px;
  line-height: 28px;
  flex: 0 1 100%;
  @media (min-width: ${breakpoint * 1}px) {
    flex: 1;
  }
`;

const Action = styled.div`
  flex: 0 0 100%;
  margin-top: 1.5rem;

  button {
    padding: 13px 60px;
  }

  @media (min-width: ${breakpoint * 1}px) {
    flex: 0 0 auto;
    margin-top: 0;
    padding-left: 60px;
  }
`;

const CTA = ({ text, action, ...rest }) => (
  <Wrapper {...rest}>
    <Text>{text}</Text>
    <Action>{action}</Action>
  </Wrapper>
);

CTA.propTypes = {
  text: PropTypes.node.isRequired,
  action: PropTypes.node.isRequired,
};

export default CTA;
