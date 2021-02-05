import React from 'react';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';
import { withPrefix } from 'gatsby';
import User from '../../composite/User';

const { breakpoint, pageMargins, typography } = styles;

const SocialValidationWrapper = styled.div`
  ${pageMargins}

  && {
    margin-top: 80px;
  }
`;

const Heading = styled.div`
  font-size: 36px;
  font-weight: ${typography.weight.black};
  line-height: 36px;
  text-align: center;
`;

const Logo = styled.div`
  img {
    display: block;
    width: 100%;
    max-width: 100px;
    height: auto;
    max-height: 50px;
  }
`;

const Logos = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 25px;

  @media (min-width: ${breakpoint * 1.25}px) {
    display: flex;
  }

  ${Logo} {
    margin: 20px;
    flex: 0 0 20%;
    display: flex;
    justify-content: center;

    @media (min-width: ${breakpoint * 1.25}px) {
      flex: 1;
    }
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
  line-height: 28px;
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
    src: '/brands/logo-nike.svg',
    alt: 'Nike',
  },
  {
    src: '/brands/logo-shopify.svg',
    alt: 'Shopify',
  },
  {
    src: '/brands/logo-dazn.svg',
    alt: 'DAZN',
  },
  {
    src: '/brands/logo-invision.svg',
    alt: 'InVision',
  },
  {
    src: '/brands/logo-oreilly.svg',
    alt: `O'Reilly`,
  },
  {
    src: '/brands/logo-betterment.svg',
    alt: 'Betterment',
  },
  {
    src: '/brands/logo-hashicorp.svg',
    alt: 'Hashicorp',
  },
].map(logo => ({
  ...logo,
  src: withPrefix(logo.src),
}));

const SocialValidation = () => (
  <SocialValidationWrapper>
    <Heading>+100,000 readers so far</Heading>

    <Logos>
      {logos.map(logo => (
        <Logo key={logo.src}>
          <img src={logo.src} alt={logo.alt} />
        </Logo>
      ))}
    </Logos>

    <Testimonials>
      <Testimonial>
        Storybook is such a pivotal tool not just for workbenching a component in isolation, but
        also to communicate your component&#39;s use cases and API to your whole team. You NEED to
        learn how to use Storybook, and this is the place to learn.
        <UserWrapper
          src="https://avatars2.githubusercontent.com/u/9523719"
          name="Kyle Holmberg"
          detail="Engineer at Air"
        />
      </Testimonial>

      <Testimonial>
        I was amazed at how easy it was to build a Design System with Storybook! The guide provided
        here is just perfect. Everything is explained step by step, from the setup of the repository
        to the deployment, including the tests and the generation of the documentation.
        <UserWrapper
          src="https://avatars2.githubusercontent.com/u/19664438"
          name="Michèle Legait"
          detail="Engineer at PROS"
        />
      </Testimonial>

      <Testimonial>
        Design systems are rapidly growing in popularity. It can be overwhelming for developers to
        understand where to start. This guide will kickstart your design system using industry
        standard best practices.
        <UserWrapper
          src="https://avatars2.githubusercontent.com/u/9113740"
          name="Lee Robinson"
          detail="Engineer at Hy-Vee"
        />
      </Testimonial>
    </Testimonials>
  </SocialValidationWrapper>
);

export default SocialValidation;
