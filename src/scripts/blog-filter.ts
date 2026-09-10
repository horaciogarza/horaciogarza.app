// -- filters the already-rendered post list. No index, no fetch: /blog ships
// -- every post server-side, so this is pure client-side narrowing.

const input = document.getElementById('blogfilter') as HTMLInputElement | null;
const list = document.querySelector<HTMLElement>('.posts');
const count = document.getElementById('blogcount');
const empty = document.getElementById('blogempty');

if (input && list) {
  const items = [...list.querySelectorAll<HTMLElement>('li')].map((el) => ({
    el,
    haystack: (el.textContent || '').toLowerCase(),
  }));

  const render = (q: string) => {
    const needle = q.trim().toLowerCase();
    let shown = 0;
    for (const { el, haystack } of items) {
      const hit = !needle || haystack.includes(needle);
      el.hidden = !hit;
      if (hit) shown++;
    }
    if (count) {
      count.textContent = `${shown} row${shown === 1 ? '' : 's'} in set (0.00 sec)`;
    }
    if (empty) empty.hidden = shown !== 0;
    return shown;
  };

  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      render('');
      input.blur();
    }
  });

  // the list is only filterable once JS is up; reveal the control now
  input.closest('.blog-search')?.removeAttribute('hidden');
}

// -- module marker: keeps these top-level consts out of the global scope
export {};
