import React from "react";

import styled, { css } from "styled-components";

import Link from "./Link";
import { color, typography, pageMargins, breakpoint } from "./shared/styles";

const FooterWrapper = styled.footer`
  ${pageMargins};
  text-align: center;
  padding: 3rem 0;
  color: ${color.dark};
`;

const FooterLink = styled(Link)`
  font-weight: ${typography.weight.bold};
`;

const Footer = ({ ...props }) => (
  <FooterWrapper {...props}>
    Made by{" "}
    <FooterLink href="https://blog.hichroma.com" target="_blank">
      Chroma
    </FooterLink>{" "}
    and the Storybook community
  </FooterWrapper>
);

export default Footer;
