import React from 'react';
import PropTypes from 'prop-types';
import { Footer as MarketingFooter } from '@storybook/components-marketing';

function Footer({ subscriberCount }) {
  return <MarketingFooter subscriberCount={subscriberCount} />;
}

Footer.propTypes = {
  subscriberCount: PropTypes.number.isRequired,
};

export default Footer;
