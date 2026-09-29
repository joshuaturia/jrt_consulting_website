/* ==========================================================================
   JRT Consulting Limited — Site JS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Header scroll state ---- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.nav-overlay');
  const openNav = () => { toggle.classList.add('open'); drawer.classList.add('open'); overlay.classList.add('show'); toggle.setAttribute('aria-expanded', 'true'); };
  const closeNav = () => { toggle.classList.remove('open'); drawer.classList.remove('open'); overlay.classList.remove('show'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', () => drawer.classList.contains('open') ? closeNav() : openNav());
  overlay?.addEventListener('click', closeNav);
  document.querySelector('.mobile-nav-close')?.addEventListener('click', closeNav);

  /* ---- Active nav link ---- */
  const page = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.dataset.nav === page) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
  });

  /* ---- Footer year ---- */
  document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---- Team cards: click to expand full bio ---- */
  const modal = document.getElementById('bio-modal');
  if (modal) {
    const panel = modal.querySelector('.bio-panel');
    const slot = modal.querySelector('.bio-slot');
    const closeBtn = modal.querySelector('.bio-close');
    let activeCard = null;

    const flipFrom = (rect) => {
      const end = panel.getBoundingClientRect();
      const sx = rect.width / end.width, sy = rect.height / end.height;
      panel.style.transform = `translate(${rect.left - end.left}px, ${rect.top - end.top}px) scale(${sx}, ${sy})`;
      panel.style.opacity = '0.4';
    };

    const open = (card) => {
      activeCard = card;
      slot.innerHTML = '';
      slot.appendChild(card.querySelector('template').content.cloneNode(true));
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      panel.scrollTop = 0;
      if (!reduceMotion) {
        panel.classList.remove('animating');
        flipFrom(card.getBoundingClientRect());
        panel.getBoundingClientRect(); // reflow
        panel.classList.add('animating');
        panel.style.transform = '';
        panel.style.opacity = '';
      }
      closeBtn.focus({ preventScroll: true });
    };

    const close = () => {
      if (!modal.classList.contains('open')) return;
      const finish = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        panel.classList.remove('animating');
        panel.style.transform = ''; panel.style.opacity = '';
        activeCard?.focus({ preventScroll: true });
      };
      if (reduceMotion || !activeCard) return finish();
      flipFrom(activeCard.getBoundingClientRect());
      setTimeout(finish, 380);
    };

    document.querySelectorAll('.team-card').forEach(card => {
      card.addEventListener('click', () => open(card));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); } });
    });
    closeBtn.addEventListener('click', close);
    modal.querySelector('.bio-backdrop').addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); closeNav(); } });
  }

  /* ---- Contact form ----
     Works immediately by opening the visitor's email app addressed to JRT.
     To receive submissions directly instead, create a free form at formspree.io
     and replace YOUR_FORM_ID in contact.html with the form's ID. */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      const btn = form.querySelector('button[type="submit"]');
      const label = btn.innerHTML;
      const action = form.getAttribute('action') || '';
      const data = new FormData(form);

      if (!action.includes('formspree.io') || action.includes('YOUR_FORM_ID')) {
        const subject = `Website enquiry${data.get('service') ? ' — ' + data.get('service') : ''}`;
        const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone') || '-'}\nOrganisation: ${data.get('organisation') || '-'}\n\n${data.get('message')}`;
        window.location.href = `mailto:enquiries@jrtconsultingltd.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        status.textContent = 'Your email app should now open with your message ready to send.';
        status.className = 'form-status show ok';
        return;
      }

      btn.disabled = true; btn.innerHTML = 'Sending&hellip;';
      try {
        const res = await fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (res.ok) {
          status.textContent = 'Thank you — your message has been sent. We will be in touch shortly.';
          status.className = 'form-status show ok';
          form.reset();
        } else throw new Error();
      } catch {
        status.textContent = 'Something went wrong. Please try again, or email enquiries@jrtconsultingltd.com directly.';
        status.className = 'form-status show err';
      } finally {
        btn.disabled = false; btn.innerHTML = label;
      }
    });
  }
});
