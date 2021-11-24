import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

import { Subheading, styles } from '@storybook/design-system';

const { color, typography, pageMargins, breakpoint } = styles;

export const Heading = styled(Subheading)`
  display: block;
  margin-bottom: 1rem;
  color: ${color.mediumdark};
  opacity: 0.8;

  ${(props) =>
    props.color === 'green' &&
    `
      color: ${color.green};
    `};
  ${(props) =>
    props.color === 'seafoam' &&
    `
      color: ${color.seafoam};
    `};
  ${(props) =>
    props.color === 'purple' &&
    `
      color: ${color.purple};
    `};
  ${(props) =>
    props.color === 'gold' &&
    `
      color: ${color.gold};
    `};
`;

export const Title = styled.h1`
  font-size: ${typography.size.m3}px;
  font-weight: ${typography.weight.black};
  line-height: 24px;
  margin-bottom: 0.5rem;

  @media (min-width: ${breakpoint}px) {
    font-size: ${typography.size.l2}px;
    line-height: 1;
    margin-bottom: 1rem;
  }
`;

export const Desc = styled.div`
  font-size: ${typography.size.s3}px;
  line-height: 1.5;
  color: ${color.darker};

  @media (min-width: ${breakpoint}px) {
    font-size: ${typography.size.m1}px;
    line-height: 32px;
  }
`;

const Meta = styled.div`
  margin-left: auto;
  margin-right: auto;

  @media (min-width: ${breakpoint}px) {
    max-width: 600px;

    ${Desc} {
      margin: 0 auto;
    }
  }
`;

const Wrapper = styled.div`
  ${pageMargins};
  padding-top: 3rem !important;
  padding-bottom: 3rem !important;

  text-align: center;

  @media (min-width: ${breakpoint}px) {
    padding-top: 7rem !important;
    padding-bottom: 5rem !important;
  }
`;

export default function PageTitle({ heading, title, desc, color: headingColor, ...props }) {
  return (
    <Wrapper {...props}>
      <Meta>
        <Heading color={headingColor}>{heading}</Heading>
        <Title>{title}</Title>
        <Desc>{desc}</Desc>
      </Meta>
    </Wrapper>
  );
}

PageTitle.propTypes = {
  heading: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['green', 'seafoam', 'gold', 'purple', 'default']),
};

PageTitle.defaultProps = {
  color: 'default',
};
