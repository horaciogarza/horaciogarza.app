// -- a very small, very fake SQL engine. Parses a handful of clauses with
// -- regexes over /posts.json and prints an ASCII result table. No deps.

type Row = { title: string; url: string; date: string; tags: string[]; description: string };

const el = <T extends Element>(s: string) => document.querySelector<T>(s);

const panel = el<HTMLElement>('#sqlconsole');
const form = el<HTMLFormElement>('#sqlform');
const input = el<HTMLInputElement>('#sqlinput');
const out = el<HTMLElement>('#sqlout');
if (panel && form && input && out) {
  let rows: Row[] | null = null;
  const history: string[] = [];
  let hIdx = -1;

  const HELP = [
    'Supported grammar (a loving subset):',
    '',
    "  SELECT * FROM posts",
    "  SELECT * FROM posts WHERE tag = 'swift'",
    "  SELECT * FROM posts WHERE title LIKE '%astro%'",
    "  SELECT * FROM posts ORDER BY date ASC LIMIT 3",
    "  SELECT COUNT(*) FROM posts",
    '  SELECT * FROM apps',
    '',
    '  \\h  help      \\c  clear      \\q  quit (Esc)',
  ].join('\n');

  const print = (text: string) => {
    out.textContent += text + '\n';
    out.scrollTop = out.scrollHeight;
  };

  const table = (data: Row[], cols: (keyof Row)[]) => {
    if (!data.length) return 'Empty set (0.00 sec)';
    const head = cols.map((c) => String(c));
    const body = data.map((r) => cols.map((c) => (Array.isArray(r[c]) ? (r[c] as string[]).join(', ') : String(r[c]))));
    const w = head.map((h, i) => Math.max(h.length, ...body.map((b) => b[i].length)));
    const rule = '+' + w.map((n) => '-'.repeat(n + 2)).join('+') + '+';
    const line = (cells: string[]) => '| ' + cells.map((c, i) => c.padEnd(w[i])).join(' | ') + ' |';
    return [rule, line(head), rule, ...body.map(line), rule, `${data.length} row${data.length === 1 ? '' : 's'} in set (0.00 sec)`].join('\n');
  };

  const load = async () => {
    if (rows) return rows;
    const res = await fetch('/posts.json');
    rows = (await res.json()) as Row[];
    return rows;
  };

  const run = async (raw: string) => {
    const q = raw.trim().replace(/;+\s*$/, '');
    if (!q) return;

    if (q === '\\q' || q === 'exit' || q === 'quit') return close();
    if (q === '\\c' || q === 'clear') { out.textContent = ''; return; }
    if (q === '\\h' || /^help$/i.test(q)) return print(HELP + '\n');

    if (/^select\b/i.test(q) && /\bfrom\s+apps\b/i.test(q)) {
      window.location.href = '/apps';
      return print('-- redirecting to /apps ...');
    }

    const m = /^select\s+(.+?)\s+from\s+([a-z_]+)(.*)$/is.exec(q);
    if (!m) {
      print(`ERROR 1064 (42000): You have an error in your SQL syntax near '${q.slice(0, 32)}'`);
      print('-- try \\h\n');
      return;
    }

    const [, projection, tableName, rest] = m;
    if (tableName.toLowerCase() !== 'posts') {
      print(`ERROR 1146 (42S02): Table 'site.${tableName}' doesn't exist\n`);
      return;
    }

    let data = [...(await load())];

    const where = /\bwhere\s+(.+?)(?=\s+order\s+by|\s+limit|$)/is.exec(rest);
    if (where) {
      const cond = where[1].trim();
      const tag = /^tags?\s*=\s*['"]([^'"]+)['"]$/i.exec(cond);
      const like = /^(title|description|tags?)\s+like\s+['"]%?([^'"%]*)%?['"]$/i.exec(cond);
      const eq = /^(title)\s*=\s*['"]([^'"]+)['"]$/i.exec(cond);
      if (tag) {
        const t = tag[1].toLowerCase();
        data = data.filter((r) => r.tags.some((x) => x.toLowerCase() === t));
      } else if (like) {
        const field = like[1].toLowerCase();
        const needle = like[2].toLowerCase();
        data = data.filter((r) => {
          const hay = field.startsWith('tag') ? r.tags.join(' ') : (r as any)[field];
          return String(hay).toLowerCase().includes(needle);
        });
      } else if (eq) {
        data = data.filter((r) => r.title.toLowerCase() === eq[2].toLowerCase());
      } else {
        print(`ERROR 1054 (42S22): Unknown condition '${cond}' — supported: tag = '…', title LIKE '%…%'\n`);
        return;
      }
    }

    const order = /\border\s+by\s+(date|title)\s*(asc|desc)?/i.exec(rest);
    if (order) {
      const key = order[1].toLowerCase() as 'date' | 'title';
      const dir = (order[2] || 'asc').toLowerCase() === 'desc' ? -1 : 1;
      data.sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0) * dir);
    }

    const limit = /\blimit\s+(\d+)/i.exec(rest);
    if (limit) data = data.slice(0, parseInt(limit[1], 10));

    if (/count\s*\(/i.test(projection)) {
      print(['+----------+', '| COUNT(*) |', '+----------+', `| ${String(data.length).padEnd(8)} |`, '+----------+', '1 row in set (0.00 sec)', ''].join('\n'));
      return;
    }

    print(table(data, ['date', 'title', 'tags']) + '\n');
    if (data.length === 1) {
      print(`-- opening ${data[0].url} …\n`);
      setTimeout(() => (window.location.href = data[0].url), 700);
    } else if (data.length) {
      print('-- refine to exactly 1 row and I will open it.\n');
    }
  };

  const open = () => {
    panel.classList.add('open');
    panel.removeAttribute('aria-hidden');
    if (!out.textContent) print("mysql> -- connected. type \\h for help.\n");
    input.focus();
  };
  const close = () => {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    input.blur();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = input.value;
    if (!q.trim()) return;
    print('mysql> ' + q);
    history.unshift(q);
    hIdx = -1;
    input.value = '';
    try {
      await run(q);
    } catch {
      print('ERROR 2013: Lost connection to the query engine.\n');
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      hIdx = Math.min(hIdx + 1, history.length - 1);
      input.value = history[hIdx];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      hIdx = Math.max(hIdx - 1, -1);
      input.value = hIdx < 0 ? '' : history[hIdx];
    }
  });

  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement | null;
    const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '/' || e.key === ':') { e.preventDefault(); open(); }
  });

  document.querySelectorAll('[data-open-console]').forEach((b) =>
    b.addEventListener('click', (e) => { e.preventDefault(); open(); })
  );
  el<HTMLButtonElement>('#sqlclose')?.addEventListener('click', close);
}
