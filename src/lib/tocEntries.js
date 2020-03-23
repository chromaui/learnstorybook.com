export default function tocEntries(toc, pages) {
  return toc
    .map(slug => {
      const node = pages.edges.map(e => e.node).find(({ fields }) => fields.chapter === slug);
      // Just don't include a sidebar link if we do not have this chapter
      if (!node) {
        return null;
      }
      const { tocTitle, title, description } = node.frontmatter;
      const { headings } = node;
      // needs better sanitizing strategy
      const chapterNavItems = headings
        ? headings.map(heading => {
            return {
              chapterNavText: heading.value,
              chapterNavLink: `${node.fields.slug}#${heading.value
                .replace(/\s/g, '-')
                .toLowerCase()}`,
            };
          })
        : [];
      return {
        chapter: node.fields.chapter,
        slug: node.fields.slug,
        title: tocTitle || title,
        description,
        chapterNavItems,
      };
    })
    .filter(e => !!e);
}
