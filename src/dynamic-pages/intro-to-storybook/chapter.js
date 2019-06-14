import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import startCase from 'lodash/startCase';
import LanguageMenu from '../../components/molecules/LanguageMenu';
import Chapter, { chapterDataPropTypes } from '../../templates/chapter';
import getLanguageName from '../../lib/getLanguageName';

const getChapterInOtherLanguage = (
  framework,
  language,
  guide,
  currentChapter,
  firstChapter,
  translationPages
) => {
  const expectedSlug = `/${guide}/${framework}/${language}/${currentChapter}/`;
  const chapterInOtherLanguage = translationPages.edges.find(
    ({ node: { fields } }) =>
      fields.slug === `/${guide}/${framework}/${language}/${currentChapter}/`
  );

  if (chapterInOtherLanguage) {
    return expectedSlug;
  }

  return `/${guide}/${framework}/${language}/${firstChapter}/`;
};

const VisualTestingHandbookChapter = ({ data }) => {
  const {
    currentPage: {
      fields: { chapter, framework, guide, language },
      frontmatter: { title: currentPageTitle, description: currentPageDescription },
    },
    currentGuide,
    site: { siteMetadata },
    translationPages,
  } = data;
  const otherLanguages = currentGuide.frontmatter.languages.filter(l => l !== language);
  const firstChapter = currentGuide.frontmatter.toc[0];
  const sharedLinkArgs = [guide, chapter, firstChapter, translationPages];

  return (
    <>
      <Helmet
        title={`${currentPageTitle} | ${siteMetadata.title}`}
        meta={[{ name: 'description', content: currentPageDescription }]}
      >
        {otherLanguages.map(otherLanguage => (
          <link
            key={otherLanguage}
            rel="alternate"
            hrefLang={otherLanguage}
            href={`${siteMetadata.siteUrl}/${framework}/${otherLanguage}/${chapter}`}
          />
        ))}
      </Helmet>

      <Chapter
        data={data}
        languageMenu={
          <LanguageMenu
            buttonContent={`${startCase(framework)} - ${getLanguageName(language)}`}
            renderItems={({ Item, ItemContent, Title, Image, Detail, Link }) => (
              <>
                <Item>
                  <Image src="/logo-react.svg" alt="React" />
                  <ItemContent>
                    <Title>React</Title>
                    <Detail>
                      <Link to={getChapterInOtherLanguage('react', 'en', ...sharedLinkArgs)}>
                        English
                      </Link>
                      <Link to={getChapterInOtherLanguage('react', 'es', ...sharedLinkArgs)}>
                        Español
                      </Link>
                      <Link to={getChapterInOtherLanguage('react', 'zh-CN', ...sharedLinkArgs)}>
                        简体中文
                      </Link>
                      <Link to={getChapterInOtherLanguage('react', 'zh-TW', ...sharedLinkArgs)}>
                        繁體中文
                      </Link>
                      <Link to={getChapterInOtherLanguage('react', 'pt', ...sharedLinkArgs)}>
                        Português
                      </Link>
                    </Detail>
                  </ItemContent>
                </Item>

                <Item>
                  <Image src="/logo-angular.svg" alt="Angular" />
                  <ItemContent>
                    <Title>Angular</Title>
                    <Detail>
                      <Link to={getChapterInOtherLanguage('angular', 'en', ...sharedLinkArgs)}>
                        English
                      </Link>
                      <Link to={getChapterInOtherLanguage('angular', 'es', ...sharedLinkArgs)}>
                        Español
                      </Link>
                      <Link to={getChapterInOtherLanguage('angular', 'pt', ...sharedLinkArgs)}>
                        Português
                      </Link>
                    </Detail>
                  </ItemContent>
                </Item>
                <Item>
                  <Image src="/logo-vue.svg" alt="Vue" />
                  <ItemContent>
                    <Title>Vue</Title>
                    <Detail>
                      <Link to={getChapterInOtherLanguage('vue', 'en', ...sharedLinkArgs)}>
                        English
                      </Link>
                      <Link to={getChapterInOtherLanguage('vue', 'pt', ...sharedLinkArgs)}>
                        Português
                      </Link>
                    </Detail>
                  </ItemContent>
                </Item>
              </>
            )}
          />
        }
      />
    </>
  );
};

VisualTestingHandbookChapter.propTypes = {
  ...chapterDataPropTypes,
};

export default VisualTestingHandbookChapter;

export const query = graphql`
  query ChapterQuery($framework: String, $language: String, $slug: String!, $guide: String!) {
    currentPage: markdownRemark(fields: { slug: { eq: $slug } }) {
      ...ChapterCurrentPageFragment
    }
    currentGuide: markdownRemark(fields: { guide: { eq: $guide }, pageType: { eq: "guide" } }) {
      ...ChapterGuidePageFragment
    }
    site {
      ...ChapterSiteMetadataFragment
    }
    tocPages: allMarkdownRemark(
      filter: {
        fields: {
          framework: { eq: $framework }
          language: { eq: $language }
          guide: { eq: $guide }
          pageType: { eq: "chapter" }
        }
      }
    ) {
      edges {
        node {
          ...ChapterOtherPagesFragment
        }
      }
    }
    translationPages: allMarkdownRemark(
      filter: { fields: { guide: { eq: $guide }, pageType: { eq: "chapter" } } }
    ) {
      edges {
        node {
          ...ChapterOtherPagesFragment
        }
      }
    }
  }
`;
