/* eslint-disable import/prefer-default-export */
import { css, keyframes } from 'styled-components';

const floatKeyframes = keyframes`
  from { transform: translate(0,  0px); }
  65%  { transform: translate(0, 4px); }
  to   { transform: translate(0, -0px); }
`;

export const float = css`
  animation: ${floatKeyframes} 2s ease-in-out infinite;
`;
