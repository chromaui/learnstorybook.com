import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// One localStorage entry per tab group, e.g. learnstorybook.codeTabs.packageManager = "yarn".
export const STORAGE_PREFIX = 'learnstorybook.codeTabs.';

const CodeTabPreferencesContext = createContext(null);

const readSavedPreferences = () => {
  const saved = {};
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key.startsWith(STORAGE_PREFIX)) {
        saved[key.slice(STORAGE_PREFIX.length)] = window.localStorage.getItem(key);
      }
    }
  } catch {
    // Storage can be unavailable (privacy modes, quota). Choices then last for the visit only.
  }
  return saved;
};

/**
 * Remembers which tab the reader picked in each tabbed-snippet group, so every snippet of that
 * group on the site shows the same tab, now and on later visits. Mounted once around the whole
 * app from gatsby-browser.js and gatsby-ssr.js.
 */
export function CodeTabPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState({});

  // Saved choices are read after mount so the server and the client render the same first
  // markup; a reader who picked yarn sees the first tab for one frame, then yarn.
  useEffect(() => {
    setPreferences(readSavedPreferences());
  }, []);

  const setPreference = useCallback((group, value) => {
    setPreferences((previous) => ({ ...previous, [group]: value }));
    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}${group}`, value);
    } catch {
      // See readSavedPreferences.
    }
  }, []);

  const value = useMemo(() => ({ preferences, setPreference }), [preferences, setPreference]);

  return (
    <CodeTabPreferencesContext.Provider value={value}>
      {children}
    </CodeTabPreferencesContext.Provider>
  );
}

CodeTabPreferencesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * The reader's saved tab for a group (null when they have not picked one yet) and a setter.
 * Mirrors useState: `const [preferred, setPreferred] = useCodeTabPreference('packageManager')`.
 */
export function useCodeTabPreference(group) {
  const context = useContext(CodeTabPreferencesContext);
  if (!context) {
    throw new Error('useCodeTabPreference needs a CodeTabPreferencesProvider above it');
  }
  const { preferences, setPreference } = context;
  const setPreferred = useCallback((value) => setPreference(group, value), [group, setPreference]);
  return [preferences[group] ?? null, setPreferred];
}
