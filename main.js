/* ============================================================
   BestRate — shared site behaviour
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initRevealOnScroll();
  initFaq();
  initRateTicker();
  initYear();
});

/* ---------- Mobile nav ---------- */
function initMobileNav(){
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-nav');
  const close = document.querySelector('.mobile-nav-close');
  if(!toggle || !drawer) return;

  const open = () => { drawer.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const shut = () => { drawer.classList.remove('open'); document.body.style.overflow = ''; };

  toggle.addEventListener('click', open);
  if(close) close.addEventListener('click', shut);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
}

/* ---------- Reveal on scroll ---------- */
function initRevealOnScroll(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;

  if(!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => io.observe(el));
}

/* ---------- FAQ accordion ---------- */
function initFaq(){
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if(!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => {
        i.classList.remove('open');
        const inner = i.querySelector('.faq-a');
        if(inner) inner.style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Homepage rate ticker ----------
   Purely cosmetic: gives a "live desk" feel by nudging the
   displayed rates within a small, realistic band every few
   seconds and flashing the row that changed. */
function initRateTicker(){
  const rows = document.querySelectorAll('.rate-row[data-base]');
  if(!rows.length) return;

  rows.forEach(row => {
    const base = parseFloat(row.dataset.base);
    row.dataset.current = base.toFixed(2);
  });

  setInterval(() => {
    const row = rows[Math.floor(Math.random() * rows.length)];
    const base = parseFloat(row.dataset.base);
    const current = parseFloat(row.dataset.current);
    const wiggle = (Math.random() * 0.1 - 0.05);
    let next = current + wiggle;
    // keep it within +/- 0.15 of the published base rate
    next = Math.max(base - 0.15, Math.min(base + 0.15, next));
    next = Math.round(next * 100) / 100;

    const numEl = row.querySelector('.rate-num');
    const deltaEl = row.querySelector('.rate-delta');
    if(!numEl) return;

    const unit = numEl.querySelector('small');
    numEl.textContent = next.toFixed(2) + '%';
    if(unit){ numEl.append(unit); }

    if(deltaEl){
      const diff = next - current;
      deltaEl.classList.remove('up','down','flat');
      if(diff > 0.005){ deltaEl.textContent = '▲ ' + diff.toFixed(2); deltaEl.classList.add('up'); }
      else if(diff < -0.005){ deltaEl.textContent = '▼ ' + Math.abs(diff).toFixed(2); deltaEl.classList.add('down'); }
      else { deltaEl.textContent = '— 0.00'; deltaEl.classList.add('flat'); }
    }

    row.dataset.current = next.toFixed(2);
    row.classList.add('flash');
    setTimeout(() => row.classList.remove('flash'), 900);
  }, 3200);
}

/* ---------- Footer year ---------- */
function initYear(){
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}
