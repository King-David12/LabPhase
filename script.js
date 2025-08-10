/* ---------- Helpers ---------- */
const qs = sel => document.querySelector(sel);
const qsa = sel => document.querySelectorAll(sel);

/* ---------- Theme (light/dark) ---------- */
const root = document.documentElement;
const themeToggle = qs('#theme-toggle');

// initialize theme from localStorage or system preference
(function initTheme(){
  const saved = localStorage.getItem('theme');
  if(saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)){
    document.documentElement.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    document.documentElement.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }
})();

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
});

/* ---------- Mobile nav toggle ---------- */
const mobileBtn = qs('#mobile-toggle');
const nav = qs('#nav');

mobileBtn.addEventListener('click', () => {
  nav.classList.toggle('open');
  // simple show/hide for small screens
  if(nav.style.display === 'flex') nav.style.display = '';
  else nav.style.display = 'flex';
});

/* Close mobile menu when clicking a link */
qsa('.nav-link').forEach(a => {
  a.addEventListener('click', () => {
    if(window.innerWidth < 720){
      nav.style.display = '';
    }
  });
});

/* ---------- Smooth active link highlighting based on scroll ---------- */
const sections = Array.from(qsa('main section[id]'));
const navLinks = Array.from(qsa('.nav-link'));

function onScrollHighlight(){
  const y = window.scrollY + 120; // offset to account for header
  let current = sections[0];
  for(const s of sections){
    if(s.offsetTop <= y) current = s;
  }
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current.id}`));
}
window.addEventListener('scroll', onScrollHighlight);
window.addEventListener('resize', onScrollHighlight);
onScrollHighlight();

/* ---------- IntersectionObserver for fade-in and skill bars ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');

      // if it's a skill-bar container, animate fill
      entry.target.querySelectorAll?.('.skill-bar')?.forEach(bar => {
        const fill = bar.querySelector('.fill');
        const level = parseInt(bar.getAttribute('data-level') || '0', 10);
        // set width after small delay for nicer effect
        setTimeout(() => fill.style.width = `${level}%`, 120);
      });

      // unobserve once in view for performance
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

qsa('.fade-up').forEach(el => observer.observe(el));
qsa('.skills-card').forEach(el => observer.observe(el));

/* ---------- Newsletter form validation (frontend only) ---------- */
const nlForm = qs('#newsletter-form');
const nlName = qs('#nl-name');
const nlEmail = qs('#nl-email');
const nlMsg = qs('#nl-msg');

function isValidEmail(email){
  // simple strict-ish regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

nlForm.addEventListener('submit', (e) => {
  e.preventDefault();
  nlMsg.textContent = '';
  const name = nlName.value.trim();
  const email = nlEmail.value.trim();

  if(name.length < 2){
    nlMsg.textContent = 'Please enter your full name.';
    nlName.focus();
    return;
  }
  if(!isValidEmail(email)){
    nlMsg.textContent = 'Please enter a valid email address.';
    nlEmail.focus();
    return;
  }

  // "subscribe" success message (no backend)
  nlMsg.textContent = 'Thanks — you’re subscribed (demo).';
  nlForm.reset();
});

/* ---------- Contact form (frontend behavior only) ---------- */
const contactForm = qs('#contact-form');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Basic client-side validation
  const nm = qs('#name').value.trim();
  const em = qs('#email').value.trim();
  const msg = qs('#message').value.trim();

  if(nm.length < 2){ alert('Please enter your name.'); return; }
  if(!isValidEmail(em)){ alert('Please enter a valid email.'); return; }
  if(msg.length < 6){ alert('Please write a short message (6+ characters).'); return; }

  // Since no backend, show demo success
  alert('Message sent! (demo) — thanks for reaching out. I will reply to ' + em);
  contactForm.reset();
});

/* ---------- Accessibility improvement: enable keyboard nav for links in nav when opened on mobile ---------- */
nav.addEventListener('keydown', (e) => {
  if(e.key === 'Escape'){
    nav.style.display = '';
  }
});

/* ---------- Small enhancement: replace placeholder brand font with a custom hosted font (optional)
   If you want to use "Reey" or another font hosted on your server, insert:
   document.fonts.load('1rem "Reey"').then(() => { document.getElementById('brand').style.fontFamily = 'Reey, Poppins, sans-serif'; });
   Or just change the CSS font-family to include that font once available.
*/

// Select the toggle button
const modeToggle = document.getElementById('mode-toggle');

// Check if user has a saved preference
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

// Toggle theme on button click
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Save preference
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});
