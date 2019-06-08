import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import LanguageMenu from './LanguageMenu';

const Wrapper = styled.div`
  padding: 20px;
`;

storiesOf('Molecules|LanguageMenu', module)
  .addDecorator(story => <Wrapper>{story()}</Wrapper>)
  .add('default', () => (
    <LanguageMenu
      buttonContent="English"
      renderItems={({ Item, Image, Title, Detail, Link }) => (
        <>
          <Item>
            <Image src="/logo-react.svg" alt="React" />
            <div>
              <Title>React</Title>
              <Detail>
                <Link to="/">English</Link>
              </Detail>
            </div>
          </Item>
        </>
      )}
    />
  ));
