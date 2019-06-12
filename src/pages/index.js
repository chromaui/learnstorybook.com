import React from 'react';
import styled from 'styled-components';
import { Button, styles } from '@storybook/design-system';
import GatsbyLink from '../components/atoms/GatsbyLink';
import CTA from '../components/molecules/CTA';
import Guide from '../components/molecules/Guide';

const { color, typography, spacing, pageMargins, pageMargin, breakpoint } = styles;

const Pitch = styled.div`
  text-align: center;
  max-width: 608px;
  margin: 145px auto 64px;
  text-align: center;
  padding: 0 20px;
`;

const PitchTitle = styled.h1`
  color: ${color.darkest};
  font-weight: ${typography.weight.black};
  font-size: ${typography.size.l1}px;
  letter-spacing: -0.33px;
  line-height: 38px;

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
  padding: 0;
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
    max-width: calc(100% - 50px);
    margin: 25px;

    @media (min-width: 550px) {
      max-width: calc(50% - 50px);
    }

    @media (min-width: ${breakpoint * 1.75}px) {
      max-width: calc(33% - 50px);
    }
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
    if (acc[guide]) {
      acc[guide] += 1;
    } else {
      acc[guide] = 1;
    }

    return acc;
  }, {});

const Index = ({ data }) => {
  const chapterCountByGuide = getChapterCountByGuide(data.chapters.edges);

  return (
    <>
      <Pitch>
        <PitchTitle>Learn to develop UIs with components and design systems</PitchTitle>

        <PitchDescription>
          Free in-depth guides for professional frontend developers. Made by Storybook maintainers.
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
      </PageMargins>

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

export default Index;

export const query = graphql`
  query IndexGuidesQuery {
    guides: allMarkdownRemark(filter: { fields: { pageType: { eq: "guide" } } }) {
      edges {
        node {
          frontmatter {
            description
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
