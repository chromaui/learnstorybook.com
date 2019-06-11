import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';

const { color, typography } = styles;

const StatWrapper = styled.div`
  color: ${color.lightest};
`;

const Value = styled.div`
  font-size: ${typography.size.s2}px;
  font-weight: ${typography.weight.bold};
  line-height: 14px;
`;

const Label = styled.div`
  font-size: ${typography.size.s1}px;
  line-height: 12px;
  margin-top: 5px;
`;

const Stat = ({ label, value }) => (
  <StatWrapper>
    <Value>{value}</Value>
    <Label>{label}</Label>
  </StatWrapper>
);

Stat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Stat;
