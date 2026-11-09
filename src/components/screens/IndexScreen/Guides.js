import React, { useMemo } from 'react';
import { styled } from '@storybook/theming';
import PropTypes from 'prop-types';
import { styles } from '@storybook/design-system';
import { withPrefix } from 'gatsby';
import Guide from './Guide';
import GatsbyLink from '../../basics/GatsbyLink';

const { breakpoint } = styles;

// Guide grid column tiers (design-system breakpoint is 600px):
//   1 column  below twoColumnBreakpoint
//   2 columns from twoColumnBreakpoint
//   4 columns from fourColumnBreakpoint
const twoColumnBreakpoint = breakpoint * 1.25;
const fourColumnBreakpoint = breakpoint * 2.5;
const gridGap = 40;

// Every column is `minmax(0, 1fr)` so cards share the row equally regardless
// of how much text they hold; a bare `1fr` would let long content widen a card.
const Content = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${gridGap}px;

  @media (min-width: ${twoColumnBreakpoint}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${fourColumnBreakpoint}px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
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

const getChapterCountByGuide = (chaptersEdges) =>
  chaptersEdges.reduce(
    (
      acc,
      {
        node: {
          fields: { guide },
        },
      }
    ) => {
      const chapterCountByGuide = { ...acc };

      if (chapterCountByGuide[guide]) {
        chapterCountByGuide[guide] += 1;
      } else {
        chapterCountByGuide[guide] = 1;
      }

      return chapterCountByGuide;
    },
    {}
  );

function Guides({ chaptersEdges, guidesEdges }) {
  const chapterCountByGuide = useMemo(() => getChapterCountByGuide(chaptersEdges), [chaptersEdges]);

  return (
    <Content>
      {guidesEdges.map(({ node: guideNode }) => (
        <GuideLink key={guideNode.fields.slug} to={guideNode.fields.slug}>
          <StyledGuide
            chapterCount={chapterCountByGuide[guideNode.fields.guide]}
            description={guideNode.frontmatter.description}
            imagePath={withPrefix(guideNode.frontmatter.thumbImagePath)}
            isNew={guideNode.frontmatter.isNew}
            themeColor={guideNode.frontmatter.themeColor}
            themeGradientName={guideNode.frontmatter.themeGradientName}
            title={guideNode.frontmatter.title}
          />
        </GuideLink>
      ))}
    </Content>
  );
}

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
          isNew: PropTypes.bool,
          title: PropTypes.string.isRequired,
          themeColor: PropTypes.string.isRequired,
          themeGradientName: PropTypes.string,
          thumbImagePath: PropTypes.string,
        }).isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
};

export default Guides;
