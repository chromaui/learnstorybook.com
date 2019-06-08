import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Icon, styles, WithTooltip } from '@storybook/design-system';
import GatsbyLink from '../atoms/GatsbyLink';

const { color, typography } = styles;

const TooltipList = styled.div`
  width: 200px;
`;

const TooltipItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 14px 14px 5px;

  &:not(:first-child) {
    border-top: 1px solid ${color.mediumlight};
  }
`;

const ViewLayerImage = styled.img`
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

const LanguageLink = styled(GatsbyLink).attrs({ tertiary: true })`
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

const LanguageMenu = ({ buttonContent, firstChapter }) => (
  <WithTooltip
    placement="top"
    trigger="click"
    closeOnClick
    tooltip={
      <TooltipList>
        <TooltipItem>
          <ViewLayerImage src="/logo-react.svg" alt="React" />
          <div>
            <Title>React</Title>
            <Detail>
              <LanguageLink to={`/react/en/${firstChapter}/`}>English</LanguageLink>
              <LanguageLink to={`/react/es/${firstChapter}/`}>Español</LanguageLink>
              <LanguageLink to={`/react/zh-CN/${firstChapter}/`}>简体中文</LanguageLink>
              <LanguageLink to={`/react/zh-TW/${firstChapter}/`}>繁體中文</LanguageLink>
              <LanguageLink to={`/react/pt/${firstChapter}/`}>Português</LanguageLink>
            </Detail>
          </div>
        </TooltipItem>

        <TooltipItem>
          <ViewLayerImage src="/logo-angular.svg" alt="Angular" />
          <div>
            <Title>Angular</Title>
            <Detail>
              <LanguageLink to={`/angular/en/${firstChapter}/`}>English</LanguageLink>
              <LanguageLink to={`/angular/es/${firstChapter}/`}>Español</LanguageLink>
              <LanguageLink to={`/angular/pt/${firstChapter}/`}>Português</LanguageLink>
            </Detail>
          </div>
        </TooltipItem>
        <TooltipItem>
          <ViewLayerImage src="/logo-vue.svg" alt="Vue" />
          <div>
            <Title>Vue</Title>
            <Detail>
              <LanguageLink to={`/vue/en/${firstChapter}/`}>English</LanguageLink>
              <LanguageLink to={`/vue/pt/${firstChapter}/`}>Português</LanguageLink>
            </Detail>
          </div>
        </TooltipItem>
      </TooltipList>
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
  firstChapter: PropTypes.string.isRequired,
};

export default LanguageMenu;
