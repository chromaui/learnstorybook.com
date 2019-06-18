import styled from 'styled-components';
import { styles, Subheading } from '@storybook/design-system';

const { color } = styles;

const SubheadingWrapper = styled(Subheading)`
  color: ${color.mediumdark};
  letter-spacing: 6px;
  line-height: 20px;
  display: block;
  margin-top: 48px;
  margin-bottom: 20px;
`;

export default SubheadingWrapper;
