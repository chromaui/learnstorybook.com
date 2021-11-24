import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { styles } from '@storybook/design-system';

const { color, typography } = styles;

const Heading = styled.div`
  font-size: ${typography.size.m3}px;
  font-weight: ${typography.weight.black};
  color: ${color.primary};
  line-height: 36px;
`;

const Message = styled.div`
  font-size: ${typography.size.s3}px;
  color: ${color.darker};
  line-height: 28px;
  margin-top: 8px;
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
