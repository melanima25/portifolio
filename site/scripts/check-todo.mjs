// Varre dist/ procurando marcadores TODO_*.
// - sem flag: apenas avisa (build de desenvolvimento);
// - --strict: falha com exit code 1 (build de produção, ADR DO-4).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const strict = process.argv.includes('--strict');
const found = new Map();

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|xml|txt|json|js|css|svg)$/.test(name)) {
      const ids = readFileSync(p, 'utf8').match(/TODO_[A-Z0-9_]+/g);
      if (ids) for (const id of new Set(ids)) found.set(id, [...(found.get(id) ?? []), p]);
    }
  }
}

walk('dist');

if (found.size === 0) {
  console.log('check-todo: nenhuma pendência TODO_* em dist/.');
} else {
  const tag = strict ? 'ERRO' : 'AVISO';
  console.warn(`check-todo [${tag}]: ${found.size} pendência(s) TODO_* em dist/:`);
  for (const [id, files] of found) console.warn(`  - ${id} (${files.length} arquivo(s))`);
  if (strict) process.exit(1);
}
