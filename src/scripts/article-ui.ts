// -- copy buttons on code blocks + hover anchors on headings.
// -- both only make sense inside a rendered article.

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
};

const flash = (el: HTMLElement, msg: string, restore: string) => {
  el.textContent = msg;
  window.setTimeout(() => {
    el.textContent = restore;
  }, 1500);
};

const body = document.querySelector<HTMLElement>('.article-body');

if (body) {
  // ---- code blocks: wrap, label the language, add a copy button ----
  body.querySelectorAll<HTMLPreElement>('pre.astro-code').forEach((pre) => {
    const wrap = document.createElement('div');
    wrap.className = 'code-block';
    pre.parentNode?.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    const bar = document.createElement('div');
    bar.className = 'code-bar';

    const lang = pre.dataset.language;
    if (lang && lang !== 'plaintext') {
      const tag = document.createElement('span');
      tag.className = 'code-lang';
      tag.textContent = lang;
      bar.appendChild(tag);
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.addEventListener('click', async () => {
      await copyText(pre.innerText.replace(/\n$/, ''));
      flash(btn, 'Copied', 'Copy');
    });
    bar.appendChild(btn);
    wrap.appendChild(bar);
  });

  // ---- headings: a # that copies the deep link ----
  body.querySelectorAll<HTMLElement>('h2[id], h3[id]').forEach((h) => {
    const a = document.createElement('a');
    a.className = 'heading-anchor';
    a.href = `#${h.id}`;
    a.textContent = '#';
    a.setAttribute('aria-label', `Link to section: ${h.textContent ?? ''}`);
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const url = new URL(location.href);
      url.hash = h.id;
      history.replaceState(null, '', url.hash);
      void copyText(url.href);
      const prev = a.textContent || '#';
      flash(a, 'copied', prev);
    });
    h.appendChild(a);
  });
}

// -- module marker: keeps these top-level consts out of the global scope
export {};
