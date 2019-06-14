import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Icon, styles, WithTooltip } from '@storybook/design-system';
import GatsbyLink from '../basics/GatsbyLink';

const { color, typography } = styles;

const TooltipList = styled.div`
  width: 200px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 14px 14px 5px;

  &:not(:first-child) {
    border-top: 1px solid ${color.mediumlight};
  }
`;

const ItemContent = styled.div`
  flex: 1;
`;

const Image = styled.img`
  width: 1rem;
  height: 1rem;
  margin-right: 8px;
`;

const Title = styled.div`
  font-weight: ${typography.weight.black};
  font-size: ${typography.size.s1}px;
  line-height: 14px;
  margin-bottom: 6px;
`;

const Detail = styled.div`
  font-size: ${typography.size.s1}px;
  line-height: 14px;
`;

const Link = styled(GatsbyLink).attrs({ tertiary: true })`
  && {
    text-decoration: underline;
    margin-right: 10px;
    margin-bottom: 9px;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  font-weight: ${typography.weight.black};
`;

const ChevronDownIcon = styled(Icon).attrs({ icon: 'chevrondown' })`
  && {
    width: 8px;
    height: 8px;
    margin-left: 5px;
  }
`;

const LanguageMenu = ({ buttonContent, renderItems }) => (
  <WithTooltip
    placement="bottom"
    trigger="click"
    closeOnClick
    tooltip={
      <TooltipList>{renderItems({ Item, ItemContent, Title, Image, Detail, Link })}</TooltipList>
    }
  >
    <Button appearance="outline" size="small">
      <ButtonContent>
        {buttonContent}
        <ChevronDownIcon />
      </ButtonContent>
    </Button>
  </WithTooltip>
);

LanguageMenu.propTypes = {
  buttonContent: PropTypes.string.isRequired,
  renderItems: PropTypes.func.isRequired,
};

export default LanguageMenu;
