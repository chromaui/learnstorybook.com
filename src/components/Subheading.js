import React from 'react';
import styled from 'styled-components';
import { typography } from './shared/styles';

// prettier-ignore
const Heading = styled.span`
  letter-spacing: .35em;
  text-transform: uppercase;
  font-weight: ${typography.weight.extrabold};
  font-size: ${typography.size.s2 - 1}px;
`;

const Subheading = props => <Heading {...props} />;

export default Subheading;
