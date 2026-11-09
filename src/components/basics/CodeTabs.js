import React, { useId, useRef } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { Highlight, styles } from '@storybook/design-system';

const { color, typography } = styles;

const Wrapper = styled.div`
  margin: 2em 0;

  ${'' /* The group owns the vertical rhythm; what the tabs hold keeps only its padding. */}
  pre[class*='language-'] {
    margin: 0;
  }
  .gatsby-code-title {
    margin-top: 0;
  }
`;

const TabList = styled.div`
  display: flex;
  flex-wrap: wrap;
  background: ${color.lighter};
  border-bottom: 1px solid ${color.border};
`;

const Tab = styled.button`
  appearance: none;
  background: none;
  border: 0;
  cursor: pointer;
  padding: 12px 16px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  font-size: ${typography.size.s3 - 2}px;
  line-height: 1;
  color: ${color.mediumdark};
  box-shadow: inset 0 -2px 0 transparent;
  transition:
    color 150ms ease-out,
    box-shadow 150ms ease-out;

  &:hover {
    color: ${color.darkest};
  }

  &[aria-selected='true'] {
    color: ${color.secondary};
    box-shadow: inset 0 -2px 0 ${color.secondary};
  }

  &:focus-visible {
    outline: 2px solid ${color.secondary};
    outline-offset: -2px;
  }
`;

const nextIndex = (key, current, count) => {
  switch (key) {
    case 'ArrowRight':
      return (current + 1) % count;
    case 'ArrowLeft':
      return (current - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
};

/**
 * A tabbed code snippet: one strip of tabs over the HTML of the active tab, as the chapter markdown
 * produced it (copy button, code title and highlighted `pre` included). Controlled: the parent
 * holds the active tab, because the choice is shared by every group of the same kind on the site.
 */
function CodeTabs({ group, tabs, activeTab = null, onChange, ...rest }) {
  const baseId = useId();
  const tabRefs = useRef([]);
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab)
  );

  const handleKeyDown = (event) => {
    const index = nextIndex(event.key, activeIndex, tabs.length);
    if (index === null) return;
    event.preventDefault();
    onChange(tabs[index].id);
    tabRefs.current[index]?.focus();
  };

  return (
    <Wrapper {...rest}>
      <TabList role="tablist" aria-label={group}>
        {tabs.map((tab, index) => (
          <Tab
            key={tab.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-selected={index === activeIndex}
            aria-controls={`${baseId}-panel-${index}`}
            tabIndex={index === activeIndex ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={handleKeyDown}
          >
            {tab.label ?? tab.id}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab, index) => (
        // Not a tab stop itself: the copy button inside is, and browsers make a scrolling
        // `pre` focusable on their own.
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={index !== activeIndex}
        >
          <Highlight>{tab.html}</Highlight>
        </div>
      ))}
    </Wrapper>
  );
}

CodeTabs.propTypes = {
  /** Names the kind of choice the tabs offer, e.g. packageManager. Read to screen readers. */
  group: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      /** The rendered markdown for this tab, highlighted by the design system's Highlight. */
      html: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** The id of the tab to show. An id the group lacks shows the first tab. */
  activeTab: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default CodeTabs;
