import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { Highlight } from '@storybook/design-system';

import { pickActiveTab, splitCodeTabs } from '../../../lib/codeTabs';
import CodeTabs from '../../basics/CodeTabs';
import { useCodeTabPreference } from '../../composite/CodeTabPreferences';

const Body = styled.div`
  margin-bottom: 3rem;
`;

function PreferredCodeTabs({ group, tabs }) {
  const [preferred, setPreferred] = useCodeTabPreference(group);
  return (
    <CodeTabs
      group={group}
      tabs={tabs}
      activeTab={pickActiveTab(tabs, preferred)}
      onChange={setPreferred}
    />
  );
}

PreferredCodeTabs.propTypes = {
  group: PropTypes.string.isRequired,
  tabs: CodeTabs.propTypes.tabs,
};

/**
 * The rendered markdown of a chapter. Prose and plain code blocks go through the design system's
 * Highlight as one HTML string; each tabbed snippet group that gatsby-remark-code-tabs marked up
 * becomes a CodeTabs bound to the reader's saved choice for that group.
 */
function ChapterBody({ html }) {
  const segments = useMemo(() => splitCodeTabs(html), [html]);

  return (
    <Body>
      {segments.map((segment, index) =>
        // Index keys are safe here: the segments come from one static string and never reorder.
        segment.type === 'tabs' ? (
          <PreferredCodeTabs key={index} group={segment.group} tabs={segment.tabs} />
        ) : (
          <Highlight key={index}>{segment.html}</Highlight>
        )
      )}
    </Body>
  );
}

ChapterBody.propTypes = {
  html: PropTypes.string.isRequired,
};

export default ChapterBody;
