import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';

import {
  color,
  typography,
  spacing,
  pageMargins,
  pageMargin,
  breakpoint,
} from '../components/shared/styles';

import Hero from '../components/Hero';
import Link from '../components/Link';
import Button from '../components/Button';
import CTA from '../components/CTA';

const Title = styled.h1`
  color: ${color.lightest};
  font-weight: ${typography.weight.extrabold};
  font-size: ${typography.size.l2}px;
  line-height: 1;
  margin-bottom: 0.2em;
  text-shadow: rgba(0, 135, 220, 0.3) 0 1px 5px;

  @media (min-width: ${breakpoint * 1}px) {
    font-size: 56px;
  }

  @media (min-width: ${breakpoint * 2}px) {
    font-size: 88px;
  }
`;

const Desc = styled.div`
  color: ${color.lightest};
  font-size: ${typography.size.m1}px;
  line-height: 1.4;
  margin-bottom: 1em;
  text-shadow: rgba(0, 135, 220, 0.3) 0 1px 5px;

  @media (min-width: ${breakpoint * 1}px) {
    font-size: ${typography.size.m2}px;
  }

  @media (min-width: ${breakpoint * 2}px) {
    font-size: ${typography.size.m3}px;
  }
`;

const Actions = styled.div`
  > * {
    margin-right: 20px;
    margin-bottom: 12px;
  }
`;

const Pitch = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;

  @media (min-width: ${breakpoint}px) {
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

  @media (min-width: ${breakpoint}px) {
    padding-top: 7rem;
    padding-bottom: 5rem;
    flex-direction: row;
    text-align: left;
    display: flex;
    align-items: center;
    flex: 1;
  }
`;

const FigureWrapper = styled.div`
  flex: 1;

  svg {
    display: block;
    height: auto;
    margin: 0 auto;
    width: 80%;
    @media (min-width: ${breakpoint}px) {
      width: 100%;
    }
  }
`;

const Wrapper = styled.div`
  background-color: #26c6da;
  background-image: linear-gradient(14deg, #26c6db 0%, #2694db 100%);

  @media (min-width: ${breakpoint}px) {
    min-height: 75vh;
    display: flex;
    align-items: center;
  }
`;

const Question = styled.h3`
  font-size: ${typography.size.m3}px;
  font-weight: ${typography.weight.extrabold};
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

const ClickIntercept = styled(Link)`
  position: absolute;
  cursor: pointer;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const ChapterTitle = styled.div`
  font-size: ${typography.size.m1}px;
  font-weight: ${typography.weight.extrabold};
  line-height: 1;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
`;
const ChapterDesc = styled.div`
  line-height: 1.5;
  color: ${color.dark};
`;

const ChapterMeta = styled.div`
  display: block;
  overflow: hidden;
`;

const Chapter = styled.li`
  background: ${color.app};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  padding: 20px 30px;
  position: relative;

  &:hover {
    background: ${darken(0.02, color.app)};
  }

  &:before {
    float: left;
    vertical-align: top;
    content: counter(counter);
    counter-increment: counter;
    font-size: ${typography.size.m3}px;
    line-height: 40px;
    font-weight: ${typography.weight.bold};
    color: ${color.mediumdark};
    margin-right: 30px;
    margin-top: 8px;
  }
`;
const Chapters = styled.ol`
  list-style: none;
  margin: 0;
  padding: 1rem 0;
  counter-reset: counter;
`;

export default ({ data }) => {
  const tocEntries = data.site.siteMetadata.toc.map(slug => {
    const node = data.allMarkdownRemark.edges
      .map(e => e.node)
      .find(({ fields }) => fields.slug === slug);

    if (!node) {
      throw new Error(
        `Didn't find chapter for slug:"${slug}" -- is the config's TOC in sync with the chapters?`
      );
    }
    const { tocTitle, title, description } = node.frontmatter;

    return { slug, title: tocTitle || title, description };
  });

  return (
    <div>
      <Wrapper>
        <Content>
          <Pitch>
            <Title>Storybook Tutorial</Title>
            <Desc>
              Learn Storybook to create bulletproof UI components as you build an app UI from
              scratch.
            </Desc>

            <Actions>
              <Link isGatsby to={data.site.siteMetadata.toc[0]}>
                <Button inverse>Get started</Button>
              </Link>
              <Link href="https://GitHub.com/hichroma/learnstorybook.com" target="_blank">
                <Button outline>View on GitHub</Button>
              </Link>
            </Actions>
          </Pitch>

          <FigureWrapper>
            <Hero />
          </FigureWrapper>
        </Content>
      </Wrapper>
      <FAQLayout>
        <Question>Why a Storybook tutorial?</Question>
        <Answer>
          <p>
            Learn Storybook aims to teach tried-and-true patterns for component development using
            Storybook. You&rsquo;ll walk through essential UI component techniques while building a
            UI from scratch in React (Vue and Angular coming soon).
          </p>
          <p>
            The info here is sourced from professional teams, core maintainers, and the awesome
            Storybook community. Rather than trying to cover every edge case –which can take
            forever!– this tutorial recommends best practices.{' '}
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
            </strong>.
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

        <Question>What&rsquo;s inside</Question>
        <Answer>
          <Chapters>
            {tocEntries.map(({ slug, title, description }) => (
              <Chapter key={slug}>
                <ClickIntercept isGatsby className="primary" to={slug} />
                <ChapterMeta>
                  <ChapterTitle>{title}</ChapterTitle>
                  <ChapterDesc>{description}</ChapterDesc>
                </ChapterMeta>
              </Chapter>
            ))}
          </Chapters>
        </Answer>
        <Question>Who&rsquo;s this for?</Question>
        <Answer>
          <p>
            This tutorial is for developers of all skill levels that are new to Storybook. If you
            follow along, you’ll be able to grasp the core concepts of isolated UI component
            development and build a full UI in Storybook without issue.
          </p>
          <p>
            We assume that you’re familiar with basic JavaScript, components, and web development.
            If you already use Storybook, checkout the{' '}
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
            experienced developer even shorter. Our aim is to be the most efficient way to onboard
            to Storybook.
          </p>
        </Answer>

        <CTA
          text={`Let's learn Storybook!`}
          action={
            <Link isGatsby to={data.site.siteMetadata.toc[0]}>
              <Button primary>Start tutorial</Button>
            </Link>
          }
        />
      </FAQLayout>
    </div>
  );
};

export const query = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        toc
      }
    }
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            tocTitle
            title
            description
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
