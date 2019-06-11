import React from 'react';
import styled from 'styled-components';
import { Button, Link, styles } from '@storybook/design-system';
import GatsbyLink from '../components/atoms/GatsbyLink';
import CTA from '../components/molecules/CTA';

const { color, typography, spacing, pageMargins, pageMargin, breakpoint } = styles;

const Title = styled.h1`
  color: ${color.lightest};
  font-weight: ${typography.weight.black};
  font-size: ${typography.size.l2}px;
  line-height: 1;
  margin-bottom: 0.2em;
  text-shadow: rgba(0, 135, 220, 0.3) 0 1px 5px;

  @media (min-width: ${breakpoint * 1.5}px) {
    font-size: ${typography.size.l3}px;
  }
`;

const Desc = styled.div`
  color: ${color.lightest};
  font-size: ${typography.size.s3}px;
  line-height: 1.4;
  margin-bottom: 1em;
  text-shadow: rgba(0, 135, 220, 0.3) 0 1px 5px;

  @media (min-width: ${breakpoint * 1}px) {
    font-size: ${typography.size.m1}px;
  }

  @media (min-width: ${breakpoint * 2}px) {
    font-size: ${typography.size.m2}px;
  }
`;

const Pitch = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;

  @media (min-width: ${breakpoint * 1.5}px) {
    flex: 0 1 55%;
    padding-right: 3rem;
  }
`;

const Content = styled.div`
  ${pageMargins};
  display: flex;
  flex: 1;
  text-align: center;
  flex-direction: column-reverse;

  padding-top: 5rem;
  padding-bottom: 5rem;

  @media (min-width: ${breakpoint * 1.5}px) {
    padding-top: 10rem;
    padding-bottom: 8rem;
    flex-direction: row;
    text-align: left;
    display: flex;
    align-items: center;
    flex: 1;
  }
`;

const Wrapper = styled.div`
  background-color: #26c6da;
  background-image: linear-gradient(14deg, #26c6db 0%, #2694db 100%);

  @media (min-width: ${breakpoint * 1.5}px) {
    min-height: 70vh;
    display: flex;
    align-items: center;
  }
`;

const Question = styled.h3`
  font-size: ${typography.size.m3}px;
  font-weight: ${typography.weight.black};
`;

const Answer = styled.div`
  margin-bottom: 3rem;
  font-size: 18px;
  line-height: 1.65;

  p:first-child {
    margin-top: 0.5em;
  }

  p {
    margin: 1em 0;
  }

  img {
    margin: 1em 0;
    max-width: 100%;
    display: block;
  }
`;

const FAQLayout = styled.div`
  padding: 4rem ${spacing.padding.medium}px 1rem;
  @media (min-width: ${breakpoint * 1}px) {
    margin: 0 ${pageMargin * 3}%;
  }
  @media (min-width: ${breakpoint * 2}px) {
    margin: 0 ${pageMargin * 4}%;
  }
`;

const CTALineBreak = styled.div`
  height: 1px;
  background: ${color.mediumlight};

  @media (min-width: ${breakpoint}px) {
    margin-left: -56px;
    margin-right: -56px;
  }
`;

const Pages = () => (
  <>
    <Wrapper>
      <Content>
        <Pitch>
          <Title>Storybook Tutorial</Title>
          <Desc>
            Learn Storybook to create bulletproof UI components, along the way you&rsquo;ll build an
            app UI from scratch.
          </Desc>
        </Pitch>
      </Content>
    </Wrapper>
    <FAQLayout>
      <Question>Why a Storybook tutorial?</Question>
      <Answer>
        <p>
          Learn Storybook aims to teach tried-and-true patterns for component development using
          Storybook. You&rsquo;ll walk through essential UI component techniques while building a UI
          from scratch in React, Vue, or Angular.
        </p>
        <p>
          The info here is sourced from professional teams, core maintainers, and the awesome
          Storybook community. Rather than trying to cover every edge case –which can take forever!–
          this tutorial recommends best practices.{' '}
          <Link
            className="primary"
            href="https://blog.hichroma.com/introducing-learnstorybook-com-2a43cd33edf5"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the announcement »
          </Link>
        </p>
      </Answer>

      <img
        src="/logo-storybook.svg"
        style={{ width: '50%', margin: '3rem auto', display: 'block' }}
        alt="Storybook logo"
      />
      <Question>What is Storybook?</Question>
      <Answer>
        <p>
          <Link
            className="primary"
            href="https://storybook.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Storybook
          </Link>{' '}
          is the most popular UI component development tool for React, Vue, and Angular. It helps
          you{' '}
          <strong>
            develop and design UI components outside your app in an isolated environment
          </strong>
          .
        </p>
        <p>
          Professional developers at Airbnb, Dropbox, and Lonely Planet use Storybook to build
          durable documented UIs faster.
        </p>
      </Answer>

      <Question>What you&rsquo;ll build</Question>
      <Answer>
        <img src="/ss-browserchrome-taskbox-learnstorybook.png" alt="Taskbox UI" />
        <p>
          Taskbox, a task management UI (similar to Asana), complete with multiple item types and
          states. We’ll go from building simple UI components to assembling screens. Each chapter
          illustrates a different aspect of developing UIs with Storybook.
        </p>
        <p>
          <span role="img" aria-label="book">
            📖
          </span>{' '}
          Each chapter is linked to a <b>working commit</b> to help you stay in sync.
        </p>
      </Answer>

      <Question>Who&rsquo;s this for?</Question>
      <Answer>
        <p>
          This tutorial is for developers of all skill levels that are new to Storybook. If you
          follow along, you’ll be able to grasp the core concepts of isolated UI component
          development and build a full UI in Storybook without issue.
        </p>
        <p>
          We assume that you’re familiar with basic JavaScript, components, and web development. If
          you already use Storybook, checkout the{' '}
          <Link href="https://storybook.js.org/basics/introduction/">official docs</Link> for API
          documentation or visit{' '}
          <Link href="https://blog.hichroma.com/" target="_blank">
            Chroma on Medium
          </Link>{' '}
          for more resources like this.
        </p>
      </Answer>

      <Question>How long does it take?</Question>
      <Answer>
        <p>
          Developer time is precious. This tutorial covers the key parts of Storybook to get you
          started as quickly as possible. Finish it in less than two hours. If you&rsquo;re an
          experienced developer even shorter. Our aim is to be the most efficient way to onboard to
          Storybook.
        </p>
      </Answer>

      <CTALineBreak />

      <CTA
        text="Learn to build UIs with components and libraries now"
        action={
          <GatsbyLink to="/intro-to-storybook">
            <Button appearance="secondary">Get started</Button>
          </GatsbyLink>
        }
      />
    </FAQLayout>
  </>
);

export default Pages;
