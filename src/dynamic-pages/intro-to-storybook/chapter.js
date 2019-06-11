import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import startCase from 'lodash/startCase';
import LanguageMenu from '../../components/molecules/LanguageMenu';
import Chapter, { chapterDataPropTypes } from '../../templates/chapter';
import tocEntries from '../../lib/tocEntries';

const VisualTestingHandbookChapter = ({
  data: {
    currentPage,
    currentGuide: {
      frontmatter: { toc, languages },
    },
    pages,
    site: {
      siteMetadata: { title: siteTitle, githubUrl, codeGithubUrl, siteUrl },
    },
  },
}) => {
  const tocList = toc.split(', ');
  const {
    html,
    frontmatter: { commit, title, description },
    fields: { guide, slug, chapter, framework, language, languageName },
  } = currentPage;
  const otherLanguages = languages.split(', ').filter(l => l !== language);
  const entries = tocEntries(tocList, pages);
  const nextEntry = entries[tocList.indexOf(chapter) + 1];
  const firstChapter = tocList[0];

  return (
    <>
      <Helmet
        title={`${title} | ${siteTitle}`}
        meta={[{ name: 'description', content: description }]}
      >
        {otherLanguages.map(otherLanguage => (
          <link
            key={otherLanguage}
            rel="alternate"
            hrefLang={otherLanguage}
            href={`${siteUrl}/${framework}/${otherLanguage}/${chapter}`}
          />
        ))}
      </Helmet>

      <Chapter
        guide={guide}
        title={title}
        slug={slug}
        description={description}
        githubUrl={githubUrl}
        codeGithubUrl={codeGithubUrl}
        entries={entries}
        nextEntry={nextEntry}
        commit={commit}
        html={html}
        languageMenu={
          <LanguageMenu
            buttonContent={`${startCase(framework)} - ${languageName}`}
            renderItems={({ Item, Title, Image, Detail, Link }) => (
              <>
                <Item>
                  <Image src="/logo-react.svg" alt="React" />
                  <div>
                    <Title>React</Title>
                    <Detail>
                      <Link to={`/${guide}/react/en/${firstChapter}/`}>English</Link>
                      <Link to={`/${guide}/react/es/${firstChapter}/`}>Español</Link>
                      <Link to={`/${guide}/react/zh-CN/${firstChapter}/`}>简体中文</Link>
                      <Link to={`/${guide}/react/zh-TW/${firstChapter}/`}>繁體中文</Link>
                      <Link to={`/${guide}/react/pt/${firstChapter}/`}>Português</Link>
                    </Detail>
                  </div>
                </Item>

                <Item>
                  <Image src="/logo-angular.svg" alt="Angular" />
                  <div>
                    <Title>Angular</Title>
                    <Detail>
                      <Link to={`/${guide}/angular/en/${firstChapter}/`}>English</Link>
                      <Link to={`/${guide}/angular/es/${firstChapter}/`}>Español</Link>
                      <Link to={`/${guide}/angular/pt/${firstChapter}/`}>Português</Link>
                    </Detail>
                  </div>
                </Item>
                <Item>
                  <Image src="/logo-vue.svg" alt="Vue" />
                  <div>
                    <Title>Vue</Title>
                    <Detail>
                      <Link to={`/${guide}/vue/en/${firstChapter}/`}>English</Link>
                      <Link to={`/${guide}/vue/pt/${firstChapter}/`}>Português</Link>
                    </Detail>
                  </div>
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
    pages: allMarkdownRemark(
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
  }
`;
