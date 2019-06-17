import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, styles } from '@storybook/design-system';
import BoxLink from '../../basics/BoxLink';

const { breakpoint, color } = styles;

const boxLinkBreakpoint = breakpoint * 1.5;

const BoxLinksWrapper = styled.div`
  a:nth-child(n + 2) {
    margin-top: 20px;
  }

  @media screen and (min-width: ${boxLinkBreakpoint}px) {
    display: flex;

    a {
      flex: 1;

      &:nth-child(n + 2) {
        margin-top: 0;
        margin-left: 20px;
      }
    }
  }
`;

const BoxLinkContent = styled.div`
  display: flex;
  padding: 20px;
`;

const BoxLinkIcon = styled(Icon)`
  && {
    color: ${color.secondary};
    width: 24px;
    height: 24px;
    margin-right: 20px;
    bottom: 0;
  }
`;

const BoxLinkMessage = styled.div`
  color: ${color.darkest};
  font-size: 14px;
  line-height: 20px;
  flex: 1;
  max-width: 410px;
  align-self: center;

  @media screen and (min-width: ${boxLinkBreakpoint}px) {
    max-width: none;
  }
`;

const ChapterLinks = ({ codeGithubUrl, commit }) => (
  <BoxLinksWrapper withMultiple={!!commit}>
    {commit && (
      <BoxLink to={`${codeGithubUrl}/commit/${commit}`}>
        <BoxLinkContent>
          <BoxLinkIcon icon="repository" />

          <BoxLinkMessage>
            Keep your code in sync with this chapter. View {commit} on GitHub.
          </BoxLinkMessage>
        </BoxLinkContent>
      </BoxLink>
    )}

    <BoxLink to="https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Flearnstorybook.com%2F&ref_src=twsrc%5Etfw&text=I%E2%80%99m%20learning%20Storybook!%20It%E2%80%99s%20a%20great%20dev%20tool%20for%20UI%20components.%20&tw_p=tweetbutton&url=https%3A%2F%2Flearnstorybook.com&via=chromaui">
      <BoxLinkContent>
        <BoxLinkIcon icon="twitter" />

        <BoxLinkMessage>
          Is this free guide helping you? Tweet to give kudos and help other devs find it.
        </BoxLinkMessage>
      </BoxLinkContent>
    </BoxLink>
  </BoxLinksWrapper>
);

ChapterLinks.propTypes = {
  codeGithubUrl: PropTypes.string.isRequired,
  commit: PropTypes.string,
};

ChapterLinks.defaultProps = {
  commit: null,
};

export default ChapterLinks;
