export default function tocEntries(toc, pages) {
  return toc.map(slug => {
    const node = pages.edges.map(e => e.node).find(({ fields }) => fields.chapter === slug);

    if (!node) {
      throw new Error(
        `Didn't find chapter for slug:"${slug}" -- is the config's TOC in sync with the chapters?`
      );
    }
    const { tocTitle, title, description } = node.frontmatter;

    return { slug: node.fields.slug, title: tocTitle || title, description };
  });
}
