const glow = document.querySelector('.cursor-glow');
const progress = document.querySelector('.scroll-progress span');
const header = document.querySelector('.site-header');
const navLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

if (glow && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const observer = new IntersectionObserver((entries, currentObserver) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      currentObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13, rootMargin: '0px 0px -4% 0px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

let ticking = false;
function updateScrollState() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const marker = scrollTop + window.innerHeight * 0.4;
  let current = sections[0]?.id;

  header.classList.toggle('scrolled', scrollTop > 18);
  if (progress) progress.style.width = `${scrollable > 0 ? (scrollTop / scrollable) * 100 : 0}%`;
  sections.forEach((section) => {
    if (marker >= section.offsetTop) current = section.id;
  });
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollState);
    ticking = true;
  }
}, { passive: true });
window.addEventListener('resize', updateScrollState, { passive: true });
updateScrollState();
