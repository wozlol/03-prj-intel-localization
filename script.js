const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const track = document.getElementById('timelineTrack');
const prevButton = document.getElementById('timelinePrev');
const nextButton = document.getElementById('timelineNext');

function updateTimelineButtons() {
  if (!track || !prevButton || !nextButton) return;

  const maxScroll = track.scrollWidth - track.clientWidth;
  const left = track.scrollLeft;
  prevButton.disabled = left <= 4;
  nextButton.disabled = left >= Math.max(maxScroll - 1, 0);
}

if (track && prevButton && nextButton) {
  prevButton.addEventListener('click', () => {
    const firstCard = track.querySelector('.milestone-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 24 : 320;
    track.scrollBy({ left: -cardWidth, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  nextButton.addEventListener('click', () => {
    const firstCard = track.querySelector('.milestone-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 24 : 320;
    track.scrollBy({ left: cardWidth, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  track.addEventListener('scroll', updateTimelineButtons, { passive: true });
  window.addEventListener('resize', updateTimelineButtons);
  updateTimelineButtons();
}

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const preloader = document.getElementById('preloader');

if (preloader) {
  document.body.classList.add('preloading');

  const images = Array.from(document.querySelectorAll('.card-image img'));
  const loadPromises = images.map((img) => new Promise((resolve) => {
    if (img.complete) {
      resolve();
      return;
    }
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  }));

  const hidePreloader = () => {
    preloader.classList.add('hidden');
    document.body.classList.remove('preloading');
    setTimeout(() => preloader.remove(), 500);
  };

  Promise.race([
    Promise.all(loadPromises),
    new Promise((resolve) => setTimeout(resolve, 5000)),
  ]).then(hidePreloader);
}

const newsletterForm = document.getElementById('newsletterForm');
const newsletterToastEl = document.getElementById('newsletterToast');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!newsletterForm.checkValidity()) {
      newsletterForm.reportValidity();
      return;
    }

    if (newsletterToastEl && window.bootstrap) {
      const toast = window.bootstrap.Toast.getOrCreateInstance(newsletterToastEl);
      toast.show();
    }

    newsletterForm.reset();
  });
}

const RTL_LANGUAGE_CODES = ['ar', 'he', 'iw', 'fa', 'ur', 'yi', 'ps', 'sd', 'ku', 'dv'];
const htmlEl = document.documentElement;
const bootstrapStylesheet = document.getElementById('bootstrapStylesheet');
const BOOTSTRAP_LTR_HREF = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
const BOOTSTRAP_RTL_HREF = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css';

function applyPageDirection(isRtl) {
  const nextDir = isRtl ? 'rtl' : 'ltr';
  if (htmlEl.getAttribute('dir') === nextDir) return;

  htmlEl.setAttribute('dir', nextDir);

  if (bootstrapStylesheet) {
    bootstrapStylesheet.setAttribute('href', isRtl ? BOOTSTRAP_RTL_HREF : BOOTSTRAP_LTR_HREF);
  }
}

function checkLanguageDirection() {
  const currentLang = (htmlEl.getAttribute('lang') || '').toLowerCase().split('-')[0];
  const isRtl = RTL_LANGUAGE_CODES.includes(currentLang) || htmlEl.classList.contains('translated-rtl');
  applyPageDirection(isRtl);
}

checkLanguageDirection();

const languageObserver = new MutationObserver(checkLanguageDirection);
languageObserver.observe(htmlEl, { attributes: true, attributeFilter: ['lang', 'class'] });

document.querySelectorAll('.timeline-jump').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center',
      inline: 'center',
    });
  });
});
