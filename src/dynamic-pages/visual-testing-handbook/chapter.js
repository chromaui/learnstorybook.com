import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import startCase from 'lodash/startCase';
import LanguageMenu from '../../components/molecules/LanguageMenu';
import Chapter from '../../templates/chapter';
import tocEntries from '../../lib/tocEntries';

const VisualTestingHandbookChapter = ({
  data: {
    currentPage,
    pages,
    site: {
      siteMetadata: { title: siteTitle, toc, languages, githubUrl, codeGithubUrl, siteUrl },
    },
  },
}) => {
  const {
    html,
    frontmatter: { commit, title, description },
    fields: { guide, slug, chapter, framework, language, languageName },
  } = currentPage;
  const otherLanguages = languages.filter(l => l !== language);
  const entries = tocEntries(toc, pages);
  const nextEntry = entries[toc.indexOf(chapter) + 1];
  const firstChapter = toc[0];

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
                      <Link to={`${guide}/react/en/${firstChapter}/`}>English</Link>
                      <Link to={`${guide}/react/es/${firstChapter}/`}>Español</Link>
                      <Link to={`${guide}/react/zh-CN/${firstChapter}/`}>简体中文</Link>
                      <Link to={`${guide}/react/zh-TW/${firstChapter}/`}>繁體中文</Link>
                      <Link to={`${guide}/react/pt/${firstChapter}/`}>Português</Link>
                    </Detail>
                  </div>
                </Item>

                <Item>
                  <Image src="/logo-angular.svg" alt="Angular" />
                  <div>
                    <Title>Angular</Title>
                    <Detail>
                      <Link to={`${guide}/angular/en/${firstChapter}/`}>English</Link>
                      <Link to={`${guide}/angular/es/${firstChapter}/`}>Español</Link>
                      <Link to={`${guide}/angular/pt/${firstChapter}/`}>Português</Link>
                    </Detail>
                  </div>
                </Item>
                <Item>
                  <Image src="/logo-vue.svg" alt="Vue" />
                  <div>
                    <Title>Vue</Title>
                    <Detail>
                      <Link to={`${guide}/vue/en/${firstChapter}/`}>English</Link>
                      <Link to={`${guide}/vue/pt/${firstChapter}/`}>Português</Link>
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
  data: PropTypes.shape({
    currentPage: PropTypes.shape({
      fields: PropTypes.shape({
        guide: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        chapter: PropTypes.string.isRequired,
        framework: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired,
      }).isRequired,
      frontmatter: PropTypes.shape({
        commit: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
      }).isRequired,
    }).isRequired,
    pages: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              tocTitle: PropTypes.string,
              title: PropTypes.string,
              description: PropTypes.string,
            }).isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              chapter: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired
      ).isRequired,
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
        permalink: PropTypes.string,
        description: PropTypes.string,
        githubUrl: PropTypes.string.isRequired,
        toc: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default VisualTestingHandbookChapter;

export const query = graphql`
  query PageQuery($framework: String!, $language: String!, $slug: String!) {
    currentPage: markdownRemark(fields: { slug: { eq: $slug } }) {
      ...CurrentPageFragment
    }
    site {
      ...SiteMetadataFragment
    }
    pages: allMarkdownRemark(
      filter: { fields: { framework: { eq: $framework }, language: { eq: $language } } }
    ) {
      edges {
        node {
          ...OtherPagesFragment
        }
      }
    }
  }
`;
