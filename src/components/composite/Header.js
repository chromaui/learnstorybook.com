import React from 'react';
import PropTypes from 'prop-types';
import { Nav, SubNav, SubNavRight, SubNavLinkList } from '@storybook/components-marketing';
import { styled } from '@storybook/theming';

const ALGOLIA_API_KEY = process.env.GATSBY_ALGOLIA_API_KEY;

const supportItems = [
  {
    icon: 'github',
    href: 'https://github.com/storybookjs',
    label: 'Github',
  },
  {
    icon: 'discord',
    href: 'https://discord.gg/storybook',
    label: 'Discord',
  },
  {
    icon: 'youtube',
    href: 'https://www.youtube.com/channel/UCr7Quur3eIyA_oe8FNYexfg',
    label: 'Youtube',
  },
];

const HeaderWrapper = styled.header`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
`;

function Header({ githubStars, inverse, subNav, versionString }) {
  return (
    <HeaderWrapper>
      <Nav
        apiKey={ALGOLIA_API_KEY}
        githubStarCount={githubStars}
        inverse={inverse}
        monochrome={inverse}
        version={versionString}
      />
      {subNav && (
        <SubNav inverse={inverse}>
          {subNav}
          <SubNavRight>
            <SubNavLinkList inverse={inverse} items={supportItems} label="Get support:" />
          </SubNavRight>
        </SubNav>
      )}
    </HeaderWrapper>
  );
}

Header.propTypes = {
  githubStars: PropTypes.number.isRequired,
  inverse: PropTypes.bool,
  subNav: PropTypes.node,
  versionString: PropTypes.string.isRequired,
};

Header.defaultProps = {
  inverse: false,
  subNav: null,
};

export default Header;
