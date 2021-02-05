import React, { useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { styles } from '@storybook/design-system';
import { withPrefix } from 'gatsby';
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
    margin-left: -30px;
    margin-right: -30px;
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

const StyledGuide = styled(Guide)``;

const GuideLink = styled(GatsbyLink)`
  ${StyledGuide} {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.2);
  }
  &&:hover {
    transform: translateY(-3px);

    ${StyledGuide} {
      box-shadow: 0 7px 15px 0 rgba(0, 0, 0, 0.15);
    }
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
            <StyledGuide
              chapterCount={chapterCountByGuide[guideNode.fields.guide]}
              description={guideNode.frontmatter.description}
              imagePath={withPrefix(guideNode.frontmatter.thumbImagePath)}
              themeColor={guideNode.frontmatter.themeColor}
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
