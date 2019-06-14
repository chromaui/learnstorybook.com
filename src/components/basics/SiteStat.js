import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';

const { color, typography } = styles;

const Heading = styled.div`
  font-size: ${typography.size.m3}px;
  font-weight: ${typography.weight.black};
  color: ${color.primary};
  letter-spacing: -0.28px;
  line-height: 36px;
`;

const Message = styled.div`
  font-size: ${typography.size.s3}px;
  color: ${color.dark};
  letter-spacing: -0.33px;
  line-height: 26px;
  margin-top: 6px;
`;

const SiteStat = ({ heading, message }) => (
  <>
    <Heading>{heading}</Heading>
    <Message>{message}</Message>
  </>
);

SiteStat.propTypes = {
  heading: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default SiteStat;
