(function() {
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

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
      shell.style.setProperty('--outcomes-height', Math.round(Math.min(680, window.innerHeight - 120)) + 'px');
      return;
    }

    const firstRect = firstLeft.getBoundingClientRect();
    const lastRect = lastLeft.getBoundingClientRect();

    // Center the sidebar against the combined context + contributions block.
    const centerY = (firstRect.top + lastRect.bottom) / 2;

    // Use a slightly shorter visible panel so it can sit visually centered
    // inside the left-column block instead of stretching to the full height.
    const desiredHeight = Math.max(0, lastRect.bottom - firstRect.top);
    const viewportMaxHeight = Math.max(0, window.innerHeight - 120);
    const panelHeight = Math.max(320, Math.min(desiredHeight - 72, viewportMaxHeight));
    const top = clamp(centerY - panelHeight / 2 - shellRect.top, 24, Math.max(24, shellRect.height - panelHeight - 24));

    shell.style.setProperty('--outcomes-top', Math.round(top) + 'px');
    shell.style.setProperty('--outcomes-height', Math.round(panelHeight) + 'px');
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
