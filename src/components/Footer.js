import React from 'react'
import Link from 'gatsby-link'
import styled, { css } from 'styled-components'

import { typography, spacing, pageMargins, breakpoint } from './shared/styles'

const FooterWrapper = styled.footer`
  ${pageMargins};
  padding-top: 12px;
  @media (min-width: ${breakpoint}px) {
    padding-top: 36px;
  }
`

const Footer = ({ ...props }) => (
  <FooterWrapper {...props}>
    Made by Chroma and the Storybook community
  </FooterWrapper>
)

export default Footer
