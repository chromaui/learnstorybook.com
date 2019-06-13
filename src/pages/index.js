import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { graphql } from 'gatsby';
import pluralize from 'pluralize';
import { Button, styles } from '@storybook/design-system';
import IconLearnStorybook from '../components/atoms/IconLearnStorybook';
import GatsbyLink from '../components/atoms/GatsbyLink';
import SiteStat from '../components/atoms/SiteStat';
import CTA from '../components/molecules/CTA';
import Guide from '../components/molecules/Guide';

const { color, typography, spacing, pageMargins, pageMargin, breakpoint } = styles;

// The background image only loads on the first render. Passing the time forces it to update.
const Background = styled.div`
  background: url('bg-dots.svg?t=${props => props.time}');
  background-repeat: repeat-x;
  background-position-y: 80px;
`;

const Pitch = styled.div`
  text-align: center;
  max-width: 608px;
  margin: 0 auto;
  text-align: center;
  padding: 145px 20px 64px;
`;

const PitchTitle = styled.h1`
  color: ${color.darkest};
  font-weight: ${typography.weight.black};
  font-size: ${typography.size.l1}px;
  letter-spacing: -0.33px;
  line-height: 38px;
  margin-top: 18px;

  @media (min-width: ${breakpoint * 1.5}px) {
    font-size: 36px;
    line-height: 44px;
  }
`;

const PitchDescription = styled.div`
  color: ${color.darkest};
  font-size: ${typography.size.m1}px;
  color: ${color.dark};
  letter-spacing: -0.41px;
  line-height: 32px;
  text-align: center;
  margin: 12px auto 0;
  max-width: 434px;
`;

const PageMargins = styled.div`
  ${pageMargins}
`;

const Guides = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  @media (min-width: ${breakpoint}px) {
    margin-left: -25px;
    margin-right: -25px;
  }

  > * {
    max-width: 100%;
    margin: 25px 0;

    @media (min-width: ${breakpoint}px) {
      max-width: calc(50% - 50px);
      margin: 25px;
    }

    @media (min-width: ${breakpoint * 1.75}px) {
      max-width: calc(33% - 50px);
    }
  }
`;

const SiteStats = styled.div`
  margin-top: 66px;

  @media (min-width: ${breakpoint * 1.25}px) {
    display: flex;
  }
`;

const SiteStatWrapper = styled.div`
  position: relative;
  margin-top: ${spacing.padding.large}px;

  @media (min-width: ${breakpoint * 1.25}px) {
    margin-right: 66px;
    margin-top: 0;
  }

  @media (min-width: ${breakpoint * 1.75}px) {
    margin-right: 97px;
  }

  &:last-of-type {
    margin-right: 0;
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

const getChapterCountByGuide = chaptersEdges =>
  chaptersEdges.reduce((acc, { node: { fields: { guide } } }) => {
    const chapterCountByGuide = { ...acc };

    if (chapterCountByGuide[guide]) {
      chapterCountByGuide[guide] += 1;
    } else {
      chapterCountByGuide[guide] = 1;
    }

    return chapterCountByGuide;
  }, {});

const getGuideEditionCount = guidesEdges =>
  guidesEdges.reduce((acc, guideEdge) => acc + guideEdge.node.frontmatter.editionCount, 0);

const Index = ({ data }) => {
  const chapterCountByGuide = getChapterCountByGuide(data.chapters.edges);

  return (
    <>
      <Background time={Date.now()}>
        <Pitch>
          <IconLearnStorybook />

          <PitchTitle>Learn to develop UIs with components and design systems</PitchTitle>

          <PitchDescription>
            Free in-depth guides for professional frontend developers. Made by Storybook
            maintainers.
          </PitchDescription>
        </Pitch>

        <PageMargins>
          <Guides>
            {data.guides.edges.map(({ node: guideNode }) => (
              <GatsbyLink key={guideNode.fields.slug} to={guideNode.fields.slug}>
                <Guide
                  chapterCount={chapterCountByGuide[guideNode.fields.guide]}
                  description={guideNode.frontmatter.description}
                  imagePath={guideNode.frontmatter.imagePath}
                  themeColor={guideNode.frontmatter.themeColor}
                  title={guideNode.frontmatter.title}
                />
              </GatsbyLink>
            ))}
          </Guides>

          <SiteStats>
            <SiteStatWrapper>
              <SiteStat
                heading={pluralize('guide', data.guides.edges.length, true)}
                message="Professional walkthroughs made for frontend devs. Updated all the time."
              />
            </SiteStatWrapper>

            <SiteStatWrapper>
              <SiteStat
                heading={pluralize('chapter', data.chapters.edges.length, true)}
                message="With code snippets, sample repos, icons, and production assets."
              />
            </SiteStatWrapper>

            <SiteStatWrapper>
              <SiteStat
                heading={pluralize('edition', getGuideEditionCount(data.guides.edges), true)}
                message="Support for React, Vue, and Angular. Translated into Spanish, Chinese, and more."
              />
            </SiteStatWrapper>
          </SiteStats>
        </PageMargins>
      </Background>

      <FAQLayout>
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
};

Index.propTypes = {
  data: PropTypes.shape({
    guides: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              description: PropTypes.string.isRequired,
              editionCount: PropTypes.number.isRequired,
              imagePath: PropTypes.string.isRequired,
              themeColor: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
            }).isRequired,
            fields: PropTypes.shape({
              guide: PropTypes.string.isRequired,
              slug: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
    chapters: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            fields: PropTypes.shape({
              guide: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Index;

export const query = graphql`
  query IndexGuidesQuery {
    guides: allMarkdownRemark(filter: { fields: { pageType: { eq: "guide" } } }) {
      edges {
        node {
          frontmatter {
            description
            editionCount
            imagePath
            themeColor
            title
          }
          fields {
            guide
            slug
          }
        }
      }
    }
    chapters: allMarkdownRemark(
      filter: { fields: { pageType: { eq: "chapter" }, isDefaultTranslation: { eq: true } } }
    ) {
      edges {
        node {
          fields {
            guide
          }
        }
      }
    }
  }
`;
