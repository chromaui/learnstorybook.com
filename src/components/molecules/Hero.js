import React from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  from { transform: translate(0,  0px); }
  65%  { transform: translate(0, 4px); }
  to   { transform: translate(0, -0px); }
`;

const Svg = styled.svg`
  display: inline-block;
  vertical-align: middle;
  animation: ${float} 2s ease-in-out infinite;
`;

function Hero({ ...props }) {
  return (
    <Svg width="564" height="402" viewBox="0 0 564 402" {...props}>
      <path
        opacity=".1"
        fill="#FFF"
        d="M306.068 297.122l-180.128 104-126-218.232 180.128-104z"
        className="sheet"
      />
      <path
        opacity=".2"
        fill="#FFF"
        d="M307.394 296.096L105.57 346.411 44.613 101.896 246.435 51.58z"
        className="sheet"
      />
      <path opacity=".3" fill="#FFF" d="M100 44h208v252H100z" className="sheet" />
      <path
        opacity=".9"
        fill="#FFF"
        d="M175.998-.002c55.993 8.091 94.66 14.925 116 20.502S338.339 35.651 367 49.22L308.168 296c-39.927-15.651-70.984-26.484-93.17-32.5s-57.186-12.516-105-19.502l66-244z"
        className="sheet"
      />
      <path
        fill="#FFF"
        d="M366.329 49.771c20.516-2.361 47.699-2.361 81.55 0 33.851 2.36 72.559 6.956 116.121 13.785L500.811 316c-34.729-7.849-67.676-13.345-98.838-16.49A683.042 683.042 0 0 0 308 296.539l58.329-246.768z"
        className="sheet"
      />
    </Svg>
  );
}

export default Hero;
