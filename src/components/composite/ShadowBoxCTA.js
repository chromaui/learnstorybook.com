import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';
import ShadowBox from '../basics/ShadowBox';

const { breakpoint, spacing, typography } = styles;

const ShadowBoxCTAWrapper = styled(ShadowBox)`
  padding: ${spacing.padding.large}px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;

  @media (min-width: ${breakpoint}px) {
    text-align: left;
  }
`;

const TextWrapper = styled.div`
  line-height: 20px;
  flex: 0 1 100%;

  @media (min-width: ${breakpoint}px) {
    flex: 1;
  }
`;

const HeadingText = styled.div`
  font-size: ${typography.size.s3}px;
  font-weight: ${typography.weight.black};
`;

const MessageText = styled.div`
  font-size: ${typography.size.s2}px;
  margin-top: 4px;
`;

const Action = styled.div`
  flex: 0 0 100%;
  margin-top: 1.5rem;

  button {
    padding: 13px 28px;
  }

  @media (min-width: ${breakpoint}px) {
    flex: 0 0 auto;
    margin-top: 0;
    padding-left: 60px;
  }
`;

const ShadowBoxCTA = ({ action, headingText, messageText, ...rest }) => (
  <ShadowBoxCTAWrapper {...rest}>
    <TextWrapper>
      <HeadingText>{headingText}</HeadingText>
      <MessageText>{messageText}</MessageText>
    </TextWrapper>

    <Action>{action}</Action>
  </ShadowBoxCTAWrapper>
);

ShadowBoxCTA.propTypes = {
  headingText: PropTypes.node.isRequired,
  messageText: PropTypes.node.isRequired,
  action: PropTypes.node.isRequired,
};

export default ShadowBoxCTA;
