// Builds the language list shown in a guide's hero: one entry per translated language, each
// linking to the best page to start that translation from.
//
// Per language, the link is the first chapter in the default framework (or in no framework for
// guides without a framework level), else the first chapter in any framework, else the first
// page seen for that language, so a partial translation never links to a missing page.
export default function getGuideLanguageLinks({
  translationPages,
  firstChapter,
  defaultFramework = 'react',
}) {
  const pagesByLanguage = new Map();
  translationPages.edges.forEach(({ node: { fields } }) => {
    if (!pagesByLanguage.has(fields.language)) {
      pagesByLanguage.set(fields.language, []);
    }
    pagesByLanguage.get(fields.language).push(fields);
  });

  return Array.from(pagesByLanguage, ([language, pages]) => {
    const firstChapterPages = pages.filter((page) => page.chapter === firstChapter);
    const preferred =
      firstChapterPages.find((page) => !page.framework || page.framework === defaultFramework) ||
      firstChapterPages[0] ||
      pages[0];
    return { language, tutorial: preferred.slug };
  });
}
