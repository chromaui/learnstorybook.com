import React from 'react';
import styled from 'styled-components';
import { Link, styles } from '@storybook/design-system';
import Subheading from './Subheading';
import BoxLink from '../../basics/BoxLink';

const { breakpoint, typography } = styles;

const SubheadingMessage = styled.div`
  margin-top: 16px;
`;

const SponsorsList = styled.div`
  margin-top: 26px;
  display: flex;
`;

const SponsorBoxLink = styled(BoxLink)`
  && {
    height: 120px;
    width: calc(33% - 10px);
    margin-right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${typography.weight.bold};
    font-size: ${typography.size.s2}px;

    &:last-of-type {
      margin-right: 0;
    }

    img {
      max-width: 76%;
    }

    @media (min-width: ${breakpoint}px) {
      height: 180px;
      max-width: none;

      img {
        max-width: initial;
      }
    }
  }

  span {
    display: flex;
    justify-content: center;
  }
`;

const SponsorUsLink = styled(Link)`
  &,
  &:hover {
    transform: none;
  }
`;

const Sponsors = () => (
  <>
    <Subheading>Sponsors</Subheading>

    <SubheadingMessage>
      Website updates and new guides are made possible with the help of sponsors.
    </SubheadingMessage>

    <SponsorsList>
      <SponsorBoxLink to="https://www.invisionapp.com/design-forward-fund">
        <img alt="InVision" src="/logo-invision.svg" />
      </SponsorBoxLink>

      <SponsorBoxLink to="mailto:friends@hichroma.com">
        <SponsorUsLink as="span">Sponsor us</SponsorUsLink>
      </SponsorBoxLink>
    </SponsorsList>
  </>
);

export default Sponsors;
