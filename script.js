// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');

  // Backdrop that overlays the page when menu is open
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  const closeMenu = () => {
    links.classList.remove('open');
    backdrop.classList.remove('show');
    document.body.classList.remove('no-scroll');
  };
  const openMenu = () => {
    links.classList.add('open');
    backdrop.classList.add('show');
    document.body.classList.add('no-scroll');
  };

  if (toggle) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      links.classList.contains('open') ? closeMenu() : openMenu();
    });
  }
  // Close on backdrop click
  backdrop.addEventListener('click', closeMenu);
  // Close on link click
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  // Close on click anywhere outside menu
  document.addEventListener('click', (e) => {
    if (!links.classList.contains('open')) return;
    if (!links.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });
  // Close on Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // Mobile reflow: profile card under hero, kekuatan utama inside keahlian
  const profileCard = document.getElementById('tentang');
  const sidebar = document.querySelector('.sidebar');
  const heroEl = document.getElementById('beranda');
  const kekuatanCard = document.getElementById('kekuatan-card');
  const keahlianSection = document.getElementById('keahlian');
  let kekuatanOriginalNext = kekuatanCard ? kekuatanCard.nextElementSibling : null;

  if (profileCard && sidebar && heroEl) {
    const mq = window.matchMedia('(max-width: 1100px)');
    const reflow = () => {
      if (mq.matches) {
        if (profileCard.parentElement !== heroEl.parentElement) {
          heroEl.insertAdjacentElement('afterend', profileCard);
        }
        if (kekuatanCard && keahlianSection && kekuatanCard.parentElement !== keahlianSection) {
          // Strip card styling so it blends inside keahlian
          kekuatanCard.classList.add('embedded');
          keahlianSection.appendChild(kekuatanCard);
        }
      } else {
        if (profileCard.parentElement !== sidebar) {
          sidebar.insertAdjacentElement('afterbegin', profileCard);
        }
        if (kekuatanCard && kekuatanCard.parentElement !== sidebar) {
          kekuatanCard.classList.remove('embedded');
          if (kekuatanOriginalNext && kekuatanOriginalNext.parentElement === sidebar) {
            sidebar.insertBefore(kekuatanCard, kekuatanOriginalNext);
          } else {
            sidebar.appendChild(kekuatanCard);
          }
        }
      }
    };
    reflow();
    mq.addEventListener('change', reflow);
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const setActive = () => {
    const y = window.scrollY + 120;
    let current = 'beranda';
    sections.forEach(s => {
      if (s.offsetTop <= y) current = s.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });

  // Reveal on scroll using IntersectionObserver
  const revealEls = document.querySelectorAll('.card, .hero, .cta');
  revealEls.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));

  // Animate stat numbers
  const stats = document.querySelectorAll('.stat-num');
  const animateNum = (el) => {
    const text = el.textContent.trim();
    const match = text.match(/(\d+)(\D*)/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2] || '';
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const tick = () => {
      n = Math.min(target, n + step);
      el.textContent = n + suffix;
      if (n < target) requestAnimationFrame(tick);
    };
    tick();
  };
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateNum(e.target);
        statIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  stats.forEach(s => statIO.observe(s));
});
