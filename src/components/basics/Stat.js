import React from 'react';
import PropTypes from 'prop-types';
import { styled, css } from '@storybook/theming';
import { styles } from '@storybook/design-system';

const { color, typography } = styles;

const StatWrapper = styled.div`
  color: ${color.lightest};

  ${(props) =>
    props.inline &&
    css`
      display: flex;
      align-items: baseline;
      gap: 4px;
    `}
`;

const Value = styled.div`
  font-size: ${typography.size.s2}px;
  font-weight: ${typography.weight.bold};
  line-height: 14px;
`;

const Label = styled.div`
  font-size: ${typography.size.s1}px;
  line-height: 12px;
  margin-top: ${(props) => (props.inline ? 0 : 5)}px;
`;

function Stat({ inline, label, value, ...rest }) {
  return (
    <StatWrapper inline={inline} {...rest}>
      <Value>{value}</Value>
      <Label inline={inline}>{label}</Label>
    </StatWrapper>
  );
}

Stat.propTypes = {
  inline: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

Stat.defaultProps = {
  inline: false,
};

export default Stat;
