import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';
import Subheading from './SubHeading';
import BoxLink from '../../basics/BoxLink';

const { color, typography } = styles;

const BoxLinkWrapper = styled(BoxLink).attrs({ isInternal: true })`
  padding: 20px 28px;
  margin-bottom: 10px;
  letter-spacing: -0.26px;
  line-height: 20px;

  &&,
  &&:hover,
  &&:focus {
    color: ${color.darkest};
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Chapter = styled.div`
  display: flex;
  align-items: center;
`;

const ChapterNumber = styled.div`
  font-weight: ${typography.weight.black};
  font-size: ${typography.size.m1}px;
  letter-spacing: -0.33px;
  line-height: 24px;
  color: ${color.mediumdark};
  margin-right: 26px;
`;

const ChapterTitle = styled.div`
  font-weight: ${typography.weight.bold};
`;

const ChapterDescription = styled.div`
  font-size: ${typography.size.s2}px;
`;

const TableOfContents = ({ entries }) => (
  <>
    <Subheading>Table of Contents</Subheading>

    {entries.map((entry, index) => (
      <BoxLinkWrapper to={entry.slug} key={entry.slug}>
        <Chapter>
          <ChapterNumber>{index + 1}</ChapterNumber>

          <div>
            <ChapterTitle>{entry.tocTitle || entry.title}</ChapterTitle>
            <ChapterDescription>{entry.description}</ChapterDescription>
          </div>
        </Chapter>
      </BoxLinkWrapper>
    ))}
  </>
);

TableOfContents.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string,
      tocTitle: PropTypes.string,
    }).isRequired
  ).isRequired,
};

export default TableOfContents;
