import React, { useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { styles } from '@storybook/design-system';
import Guide from './Guide';
import GatsbyLink from '../../basics/GatsbyLink';

const { breakpoint, pageMargins } = styles;

const GuidesWrapper = styled.div`
  ${pageMargins}
`;

const Content = styled.div`
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

const GuideLink = styled(GatsbyLink)`
  &&:hover {
    transform: translateY(-3px);
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

const Guides = ({ chaptersEdges, guidesEdges }) => {
  const chapterCountByGuide = useMemo(() => getChapterCountByGuide(chaptersEdges), [chaptersEdges]);

  return (
    <GuidesWrapper>
      <Content>
        {guidesEdges.map(({ node: guideNode }) => (
          <GuideLink key={guideNode.fields.slug} to={guideNode.fields.slug}>
            <Guide
              chapterCount={chapterCountByGuide[guideNode.fields.guide]}
              description={guideNode.frontmatter.description}
              imagePath={guideNode.frontmatter.thumbImagePath}
              themeColor={guideNode.frontmatter.themeColor}
              title={guideNode.frontmatter.title}
            />
          </GuideLink>
        ))}

        {guidesEdges.map(({ node: guideNode }) => (
          <GuideLink key={guideNode.fields.slug} to={guideNode.fields.slug}>
            <Guide
              chapterCount={chapterCountByGuide[guideNode.fields.guide]}
              description={guideNode.frontmatter.description}
              imagePath="/guide-thumb/cdd.svg"
              themeColor="#66BF3C"
              title={guideNode.frontmatter.title}
            />
          </GuideLink>
        ))}

        {guidesEdges.map(({ node: guideNode }) => (
          <GuideLink key={guideNode.fields.slug} to={guideNode.fields.slug}>
            <Guide
              chapterCount={chapterCountByGuide[guideNode.fields.guide]}
              description={guideNode.frontmatter.description}
              imagePath="/guide-thumb/design-system.svg"
              themeColor="#1EA7FD"
              title={guideNode.frontmatter.title}
            />
          </GuideLink>
        ))}

        {guidesEdges.map(({ node: guideNode }) => (
          <GuideLink key={guideNode.fields.slug} to={guideNode.fields.slug}>
            <Guide
              chapterCount={chapterCountByGuide[guideNode.fields.guide]}
              description={guideNode.frontmatter.description}
              imagePath="/guide-thumb/master.svg"
              themeColor="#37D5D3"
              title={guideNode.frontmatter.title}
            />
          </GuideLink>
        ))}

        {guidesEdges.map(({ node: guideNode }) => (
          <GuideLink key={guideNode.fields.slug} to={guideNode.fields.slug}>
            <Guide
              chapterCount={chapterCountByGuide[guideNode.fields.guide]}
              description={guideNode.frontmatter.description}
              imagePath="/guide-thumb/production.svg"
              themeColor="#FF4785"
              title={guideNode.frontmatter.title}
            />
          </GuideLink>
        ))}

        {guidesEdges.map(({ node: guideNode }) => (
          <GuideLink key={guideNode.fields.slug} to={guideNode.fields.slug}>
            <Guide
              chapterCount={chapterCountByGuide[guideNode.fields.guide]}
              description={guideNode.frontmatter.description}
              imagePath="/guide-thumb/visual-testing.svg"
              themeColor="#FFAE00"
              title={guideNode.frontmatter.title}
            />
          </GuideLink>
        ))}
      </Content>
    </GuidesWrapper>
  );
};

Guides.propTypes = {
  chaptersEdges: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        fields: PropTypes.shape({
          guide: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
  guidesEdges: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        fields: PropTypes.shape({
          guide: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        }).isRequired,
        frontmatter: PropTypes.shape({
          description: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          themeColor: PropTypes.string.isRequired,
          thumbImagePath: PropTypes.string,
        }).isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
};

export default Guides;
