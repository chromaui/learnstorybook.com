import React from 'react';
import { styles as marketingStyles } from '@storybook/components-marketing';
import { styles } from '@storybook/design-system';
import { styled } from '@storybook/theming';

import User from '../../composite/User';

const { breakpoint } = styles;

const Heading = styled.div`
  ${marketingStyles.marketing.subheading};
  margin-bottom: 24px;
`;

const Testimonials = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (min-width: ${breakpoint * 1.25}px) {
    flex-direction: row;
    gap: 80px;
    justify-content: space-between;
  }
`;

const Testimonial = styled.div`
  ${marketingStyles.marketing.textLarge}

  @media (min-width: ${breakpoint * 1.25}px) {
    flex: 0 1 300px;
  }
`;

const UserWrapper = styled(User)`
  margin-top: 20px;
`;

function SocialValidation() {
  return (
    <>
      <Heading>200,000+ readers so far</Heading>
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
          I was amazed at how easy it was to build a Design System with Storybook! The guide
          provided here is just perfect. Everything is explained step by step, from the setup of the
          repository to the deployment, including the tests and the generation of the documentation.
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
            detail="Engineer at Vercel"
          />
        </Testimonial>
      </Testimonials>
    </>
  );
}

export default SocialValidation;
