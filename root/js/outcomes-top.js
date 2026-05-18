(function() {
  function setTop() {
    const shell = document.querySelector('.cs-case-shell');
    const hero = document.querySelector('.cs-hero');
    const outcomes = document.querySelector('.cs-outcomes-section');
    if (!shell || !hero || !outcomes) return;

    const shellRect = shell.getBoundingClientRect();

    // Identify the left-column region: start at the project context panel
    // and end at the last left-column child (exclude hero and outcomes).
    const firstLeft = shell.querySelector('.cs-context-panel');
    const children = Array.from(shell.children);
    const leftCandidates = children.filter(el => el !== hero && el !== outcomes);
    const lastLeft = leftCandidates[leftCandidates.length - 1] || firstLeft;

    if (!firstLeft || !lastLeft) {
      // fallback: position under the hero
      const heroRect = hero.getBoundingClientRect();
      const topFallback = Math.max(heroRect.bottom - shellRect.top + 12, 24);
      shell.style.setProperty('--outcomes-top', Math.round(topFallback) + 'px');
      return;
    }

    const firstRect = firstLeft.getBoundingClientRect();
    const lastRect = lastLeft.getBoundingClientRect();
    const outcomesRect = outcomes.getBoundingClientRect();

    // Vertically center outcomes within the left-column content block.
    // Height is capped in CSS, so this stays stable on shorter viewports.
    const centerY = (firstRect.top + lastRect.bottom) / 2;
    let top = centerY - outcomesRect.height / 2 - shellRect.top;

    // Keep a sensible minimum/maximum so it doesn't overlap shell edges
    const minTop = 24;
    const viewportMaxHeight = Math.max(320, window.innerHeight - 120);
    const effectivePanelHeight = Math.min(outcomesRect.height, viewportMaxHeight);
    const maxTop = Math.max(minTop, shellRect.height - effectivePanelHeight - 24);
    if (top < minTop) top = minTop;
    if (top > maxTop) top = maxTop;

    shell.style.setProperty('--outcomes-top', Math.round(top) + 'px');
  }

  function init() {
    const hero = document.querySelector('.cs-hero');
    const shell = document.querySelector('.cs-case-shell');
    const outcomes = document.querySelector('.cs-outcomes-section');
    if (!hero || !shell || !outcomes) return;

    // update on load and resize
    window.addEventListener('load', setTop);
    window.addEventListener('resize', setTop);

    // observe key elements for size/position changes
    try {
      const ro = new ResizeObserver(setTop);
      ro.observe(hero);
      ro.observe(shell);
      ro.observe(outcomes);
      const firstLeft = shell.querySelector('.cs-context-panel');
      if (firstLeft) ro.observe(firstLeft);
      // also observe other left-column children
      Array.from(shell.children).forEach(el => {
        if (el !== hero && el !== outcomes) ro.observe(el);
      });
    } catch (e) {
      // ResizeObserver not available — it'll still update on resize/load
    }

    setTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
