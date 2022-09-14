const getChapterInOtherLanguage = (
  language,
  guide,
  currentChapter,
  firstChapter,
  translationPages,
  framework
) => {
  const expectedSlug = `/${guide}/${
    framework ? `${framework}/` : ''
  }${language}/${currentChapter}/`;
  // defines the initial chapter
  const expectedFirstChapter = `/${guide}/${
    framework ? `${framework}/` : ''
  }${language}/${firstChapter}/`;

  const chapterInOtherLanguage = translationPages.edges.find(
    ({ node: { fields } }) => fields.slug === expectedSlug
  );

  if (chapterInOtherLanguage) {
    return expectedSlug;
  }

  if (framework) {
    // searches for the first chapter for the translation
    const firstInOtherLanguage = translationPages.edges.find(
      ({ node: { fields } }) => fields.slug === expectedFirstChapter
    );

    // if it exists returns the expected first chapter
    if (firstInOtherLanguage) {
      // return firstInOtherLanguage;
      return expectedFirstChapter;
    }
    // returns the default first chapter(ie the english version of the tutorial, preventing a 404)
    return `/${guide}/${framework}/en/${firstChapter}/`;
  }

  return `/${guide}/${language}/${firstChapter}/`;
};

export default getChapterInOtherLanguage;
