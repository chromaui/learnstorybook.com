// Looks up whether a chapter's translation tracks the current Storybook version.
//
// `tutorialStatus` (from gatsby-config siteMetadata) is keyed by guide, then by framework and
// language for guides organised by framework, or directly by language for guides without a
// framework level. Returns `undefined` when there is no entry, so callers can leave the
// `tutorialUpToDate` field unset rather than claim the tutorial is stale.
module.exports = function getTutorialUpToDate({
  tutorialStatus,
  storybookVersion,
  guide,
  framework,
  language,
}) {
  const guideStatus = tutorialStatus[guide];
  if (!guideStatus) {
    return undefined;
  }
  const languageStatus = framework ? guideStatus[framework] : guideStatus;
  if (!languageStatus) {
    return undefined;
  }
  const version = languageStatus[language];
  if (!version) {
    return undefined;
  }
  return storybookVersion === version;
};
