import React from 'react';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';
import User from '../molecules/User';

const { breakpoint, pageMargins, typography } = styles;

const SocialValidationWrapper = styled.div`
  ${pageMargins}
`;

const Heading = styled.div`
  font-size: 36px;
  font-weight: ${typography.weight.black};
  letter-spacing: -0.33px;
  line-height: 36px;
  text-align: center;
`;

const Logos = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 25px;

  img {
    margin: 20px;
  }
`;

const Testimonials = styled.div`
  margin-top: 40px;

  @media (min-width: ${breakpoint * 1.25}px) {
    display: flex;
  }
`;

const Testimonial = styled.div`
  font-size: ${typography.size.s3}px;
  line-height: 26px;
  max-width: 300px;
  text-align: center;
  margin: 60px auto 0;

  &:first-of-type {
    margin-top: 0;
  }

  @media (min-width: ${breakpoint * 1.25}px) {
    margin-top: 0;
    margin-right: 83px;
    text-align: left;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const UserWrapper = styled(User)`
  margin-top: 20px;
  justify-content: center;

  @media (min-width: ${breakpoint * 1.25}px) {
    justify-content: flex-start;
  }
`;

const logos = [
  {
    src: '/logo-meteor.svg',
    alt: 'Meteor',
  },
  {
    src: '/logo-apollo.svg',
    alt: 'Apollo',
  },
  {
    src: '/logo-invision.svg',
    alt: 'Invision',
  },
];

const SocialValidation = props => (
  <SocialValidationWrapper {...props}>
    <Heading>+70,000 readers so far</Heading>

    <Logos>
      {logos.map(logo => (
        <img key={logo.src} src={logo.src} alt={logo.alt} />
      ))}
    </Logos>

    <Testimonials>
      <Testimonial>
        Just deleted all component snapshot tests from our React component library—in favour of
        Chromatic[@chromaui] screenshot tests.
        <UserWrapper
          src="https://avatars2.githubusercontent.com/u/263385"
          name="Dominic Nguyen"
          detail="Professional rapper"
        />
      </Testimonial>

      <Testimonial>
        Just deleted all component snapshot tests from our React component library—in favour of
        Chromatic[@chromaui] screenshot tests.
        <UserWrapper
          src="https://avatars2.githubusercontent.com/u/263385"
          name="Dominic Nguyen"
          detail="Professional rapper"
        />
      </Testimonial>

      <Testimonial>
        Just deleted all component snapshot tests from our React component library—in favour of
        Chromatic[@chromaui] screenshot tests.
        <UserWrapper
          src="https://avatars2.githubusercontent.com/u/263385"
          name="Dominic Nguyen"
          detail="Professional rapper"
        />
      </Testimonial>
    </Testimonials>
  </SocialValidationWrapper>
);

export default SocialValidation;
