

/* ── HAMBURGER ──────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

/* ── NAVBAR SCROLL ──────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('scroll-top').classList.toggle('visible', window.scrollY > 300);
});

/* ── ACTIVE NAV LINK ────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      navLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if(link) link.classList.add('active');
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => observer.observe(s));

/* ── SCROLL REVEAL ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.classList.add('visible');
    } else {
      e.target.classList.remove('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ── TYPING ANIMATION ───────────────────────────────────── */
const roles = [
  "Full-Stack Developer",
  "Python Developer",
  "Database Designer",
  "Problem Solver"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-role');

function type() {
  const current = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    speed = 1500;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 400;
  }

  setTimeout(type, speed);
}

type();

/* ── COUNTER ANIMATION ──────────────────────────────────── */
try {
  const projectCards = document.querySelectorAll('.project-card');
  const projectCounterEl = document.querySelector('.project-counter');
  if (projectCounterEl && projectCards.length > 0) {
    projectCounterEl.setAttribute('data-target', projectCards.length);
  }
} catch (err) {
  console.error("Counter sync error:", err);
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(ease * target);
    el.textContent = value + suffix;
    if(progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterEls = document.querySelectorAll('.counter, [data-target]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObs.observe(el));

/* ── PARTICLES CANVAS ───────────────────────────────────── */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const chars = ['{', '}', '<', '>', '/', '()', '=>', '[]', '&&', '||', 'fn', '=>'];
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.getElementById('hero').offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function makeParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    char: chars[Math.floor(Math.random() * chars.length)],
    size: Math.random() * 12 + 9,
    speed: Math.random() * 0.4 + 0.1,
    opacity: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.6 ? '#FFD400' : '#FF8C00'
  };
}
for(let i = 0; i < 50; i++) particles.push(makeParticle());

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.font = `${p.size}px JetBrains Mono, monospace`;
    ctx.fillText(p.char, p.x, p.y);
    p.y -= p.speed;
    p.opacity -= 0.0005;
    if(p.y < -20 || p.opacity <= 0) {
      Object.assign(p, makeParticle(), { y: canvas.height + 20 });
    }
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── CONTACT FORM — Opens Gmail directly ────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();

  const nameEl    = document.getElementById('contact-name');
  const emailEl   = document.getElementById('contact-email');
  const subjectEl = document.getElementById('contact-subject');
  const msgEl     = document.getElementById('contact-message');
  const btn       = document.getElementById('send-msg-btn');

  const name    = nameEl.value.trim();
  const email   = emailEl.value.trim();
  const subject = subjectEl.value.trim();
  const message = msgEl.value.trim();

  /* ── Validation ── */
  if (!name) {
    nameEl.focus();
    nameEl.style.borderColor = '#FF4444';
    setTimeout(() => { nameEl.style.borderColor = ''; }, 2000);
    showToast('⚠️ আপনার নাম লিখুন!', 'warn');
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailEl.focus();
    emailEl.style.borderColor = '#FF4444';
    setTimeout(() => { emailEl.style.borderColor = ''; }, 2000);
    showToast('⚠️ সঠিক email লিখুন!', 'warn');
    return;
  }
  if (!message) {
    msgEl.focus();
    msgEl.style.borderColor = '#FF4444';
    setTimeout(() => { msgEl.style.borderColor = ''; }, 2000);
    showToast('⚠️ Message লিখুন!', 'warn');
    return;
  }

  /* ── Build Gmail compose URL (opens Gmail in browser directly) ── */
  const toEmail     = 'rsridoykhan000@gmail.com';
  const gmailSubject = encodeURIComponent(
    subject ? subject : `Portfolio Contact from ${name}`
  );
  const gmailBody = encodeURIComponent(
    `Hello R S Ridoy,\n\n` +
    `Name    : ${name}\n` +
    `Email   : ${email}\n\n` +
    `Message :\n${message}\n\n` +
    `---\nSent from rsridoy.portfolio`
  );

  /* Gmail web compose URL — opens Gmail tab with everything filled */
  const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${toEmail}&su=${gmailSubject}&body=${gmailBody}`;

  /* Open Gmail in a new tab */
  window.open(gmailURL, '_blank');

  /* ── Button feedback ── */
  btn.innerHTML = '✅ Gmail খুলছে...';
  btn.disabled  = true;
  btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';

  showToast('✅ Gmail এ compose window খুলেছে! Send করুন।', 'success');

  /* ── Reset form after 3s ── */
  setTimeout(() => {
    btn.innerHTML = 'Send Message 🚀';
    btn.style.background = '';
    btn.disabled = false;
    nameEl.value    = '';
    emailEl.value   = '';
    subjectEl.value = '';
    msgEl.value     = '';
  }, 3000);
}

/* ── Toast notification helper ── */
function showToast(msg, type = 'success') {
  const old = document.getElementById('toast-msg');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.id = 'toast-msg';
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:32px; left:50%; transform:translateX(-50%) translateY(20px);
    background:${type === 'success' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#f59e0b,#d97706)'};
    color:#fff; padding:14px 28px; border-radius:12px;
    font-family:'Space Grotesk',sans-serif; font-size:0.95rem; font-weight:600;
    box-shadow:0 8px 32px rgba(0,0,0,0.4); z-index:9999;
    opacity:0; transition:all 0.4s ease; max-width:90vw; text-align:center;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ── CUSTOM MODAL FUNCTIONS ────────────────────────────── */
const modal = document.getElementById('coming-soon-modal');

function openModal(e) {
  if (e) e.preventDefault();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});
