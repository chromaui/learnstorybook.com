import React from 'react'
import styled from 'styled-components'

import {
  color,
  typography,
  spacing,
  pageMargins,
  pageMargin,
  breakpoint,
} from '../components/shared/styles'

import Link from '../components/Link'
import Button from '../components/Button'
import CTA from '../components/CTA'

const Title = styled.h1`
  color: ${color.lightest};
  font-weight: ${typography.weight.extrabold};

  font-size: ${typography.size.l3}px;
  line-height: 1;
  margin-bottom: 1rem;

  @media (min-width: ${breakpoint * 1}px) {
    font-size: ${typography.size.l1}px;
    line-height: 1;
  }

  @media (min-width: ${breakpoint * 2}px) {
    font-size: 108px;
    line-height: 1;
    margin-bottom: 1rem;
  }
`

const Desc = styled.div`
  color: ${color.lightest};

  font-size: ${typography.size.m2}px;
  line-height: 24px;
  margin-bottom: 1.5rem;

  @media (min-width: ${breakpoint * 1}px) {
    font-size: ${typography.size.l1}px;
    line-height: 1.4;
  }
`

const Actions = styled.div`
  > * {
    margin-right: 20px;
  }
`

const Pitch = styled.div`
  position: relative;
  z-index: 1;
  flex: 0 1 55%;

  padding-right: 3rem;
`

const Content = styled.div`
  ${pageMargins};
  display: flex;
  flex: 1;
  text-align: center;

  @media (min-width: ${breakpoint}px) {
    text-align: left;
    display: flex;
    align-items: center;
    flex: 1;
  }
`

const FigureWrapper = styled.div`
  display: flex;
  flex: 1;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`

const Wrapper = styled.div`
  background-color: #26c6da;
  background-image: linear-gradient(14deg, #26c6db 0%, #2694db 100%);
  @media (min-width: ${breakpoint}px) {
    min-height: 75vh;
    display: flex;
    align-items: center;
  }
`

const Question = styled.div`
  font-size: ${typography.size.m3}px;
  font-weight: ${typography.weight.extrabold};
`

const Answer = styled.div`
  margin-bottom: 3rem;
  font-size: ${typography.size.m1}px;
  line-height: 1.6;

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
`

const FAQLayout = styled.div`
  padding: 4rem ${spacing.padding.medium}px 1rem;
  @media (min-width: ${breakpoint * 1}px) {
    margin: 0 ${pageMargin * 3}%;
  }
  @media (min-width: ${breakpoint * 2}px) {
    margin: 0 ${pageMargin * 4}%;
  }

  ol {
    list-style-position: outside;
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding-left: 30px;

    li {
      margin-bottom: 0.5rem;
      padding-left: 10px;
    }
  }

  ol {
    list-style-type: decimal;
  }
`

const IndexPage = ({ data }) => (
  <div>
    <Wrapper>
      <Content>
        <Pitch>
          <Title>Storybook Tutorial</Title>
          <Desc>
            Learn Storybook to create bulletproof UI components as you build an
            app UI from scratch.
          </Desc>

          <Actions>
            <Link isGatsby to={data.site.siteMetadata.toc[0]}>
              <Button inverse>Get started</Button>
            </Link>
            <Link
              href="https://GitHub.com/hichroma/learnstorybook.com"
              target="_blank"
            >
              <Button outline>View on Github</Button>
            </Link>
          </Actions>
        </Pitch>

        <FigureWrapper>
          <img src="/storybook-hero.svg" />
        </FigureWrapper>
      </Content>
    </Wrapper>
    <FAQLayout>
      <Question>Why a Storybook tutorial?</Question>
      <Answer>
        <p>
          LearnStorybook.com aims to explain tried-and-true patterns for
          component development using Storybook. It walks through essential
          techniques from working with a single UI component to assembling
          composite components. Along the way you’ll also learn how to test
          component libraries and deploy Storybook.
        </p>
        <p>
          The info here is sourced from professional teams, core maintainers,
          and the awesome Storybook community. Rather than trying to cover every
          edge case (which can take forever!) the tutorial recommends best
          practice.
        </p>
      </Answer>

      <Question>What is Storybook?</Question>
      <Answer>
        <p>
          Storybook is the most popular UI component development tool for React,
          Vue, and Angular. It helps you *develop and design UI components
          outside your app in an isolated environment*. Professional developers
          use it to build faster, more durable, and documented UIs.
        </p>
        <p>
          Storybook is used by teams at Airbnb, Dropbox, Lonely Planet, IBM, and
          many more.
        </p>
      </Answer>

      <Question>What you'll build</Question>
      <Answer>
        <img src="/ss-browserchrome-taskbox-learnstorybook.png" />
        <p>
          Taskbox, a task management UI (similar to Asana), complete with
          multiple item types and states. We’ll go from building simple UI
          components to assembling screens. Each chapter illustrates a different
          aspect of developing UIs with Storybook.
        </p>
        <p>
          At the end of each chapter you'll get a handy link to the commit to
          help you stay in sync.
        </p>
      </Answer>

      <Question>What's inside</Question>
      <Answer>
        <ul>
          <li>Setup</li>
          <li>Build a simple component</li>
          <li>Assemble a composite component</li>
          <li>Container components with data</li>
          <li>Construct a screen</li>
          <li>Test your component library</li>
          <li>Deploy Storybook online</li>
        </ul>
      </Answer>
      <Question>Who's this for?</Question>
      <Answer>
        <p>
          This tutorial is for new Storybook developers. Our aim is to be
          approachable to all skill levels. If you follow along, you’ll be able
          to grasp the core concepts of isolated UI component development and
          build a full UI in Storybook without issue.
        </p>
        <p>
          We do assume that you’re familiar with basic JavaScript, components,
          and web development. If you already use Storybook, checkout the
          <Link href="https://storybook.js.org/basics/introduction/">
            official docs
          </Link>{' '}
          for API documentation or visit{' '}
          <Link href="https://blog.hichroma.com/" target="_blank">
            Chroma on Medium
          </Link>{' '}
          for more resources like this.
        </p>
      </Answer>

      <CTA
        text={<Question>Let's learn Storybook</Question>}
        action={<Button primary>Start tutorial</Button>}
      />
    </FAQLayout>
  </div>
)

export default IndexPage

export const query = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        toc
      }
    }
  }
`
