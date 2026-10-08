// Plugin rehype: transforma marcadores TODO_* do Markdown em <mark class="pendente">.
// - build normal: a pendência fica visível e destacada (para o Breno preencher);
// - build estrito (STRICT_TODO=1): lança erro, impedindo publicar placeholders.
const RE = /(TODO_[A-Z0-9_]+)/g;

/** @param {{ strict?: boolean }} [options] */
export function rehypePendente(options = {}) {
  /** @param {any} node @param {string} file */
  function visit(node, file) {
    if (!node.children) return;
    /** @type {any[]} */
    const out = [];
    for (const child of node.children) {
      if (child.type === 'text' && RE.test(child.value)) {
        RE.lastIndex = 0;
        if (options.strict) {
          throw new Error(`Pendência ${child.value.match(RE)?.[0]} em ${file} (build estrito).`);
        }
        for (const part of child.value.split(RE)) {
          if (!part) continue;
          out.push(
            part.startsWith('TODO_')
              ? {
                  type: 'element',
                  tagName: 'mark',
                  properties: { className: ['pendente'], title: 'Pendente de preenchimento' },
                  children: [{ type: 'text', value: `pendente: ${part}` }],
                }
              : { type: 'text', value: part },
          );
        }
      } else {
        RE.lastIndex = 0;
        visit(child, file);
        out.push(child);
      }
    }
    node.children = out;
  }
  return (/** @type {any} */ tree, /** @type {any} */ file) =>
    visit(tree, file?.path ?? 'markdown');
}
