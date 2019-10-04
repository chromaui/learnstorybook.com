export default function tocEntries(toc, pages) {
  return toc
    .map(slug => {
      const node = pages.edges.map(e => e.node).find(({ fields }) => fields.chapter === slug);
      // Just don't include a sidebar link if we do not have this chapter
      if (!node) {
        return null;
      }
      const { tocTitle, title, description } = node.frontmatter;

      return { slug: node.fields.slug, title: tocTitle || title, description };
    })
    .filter(e => !!e);
}
