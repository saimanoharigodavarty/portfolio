/* ======================================================
   PORTFOLIO – Interactive JavaScript (Light Theme)
   Particles, Cursor Glow, Nav, Scroll Reveal, Card Glow
   ====================================================== */

// ─── PARTICLE BACKGROUND (light theme colors) ───────
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.25;
            this.speedY = (Math.random() - 0.5) * 0.25;
            this.opacity = Math.random() * 0.25 + 0.08;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > w) this.speedX *= -1;
            if (this.y < 0 || this.y > h) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity})`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        const count = Math.min(Math.floor((w * h) / 15000), 80);
        particles = Array.from({ length: count }, () => new Particle());
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(37, 99, 235, ${0.04 * (1 - dist / 110)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }

    init();
    animate();
    window.addEventListener('resize', () => { resize(); init(); });
})();

// ─── CURSOR GLOW ────────────────────────────────────
(function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.innerWidth < 768) return;

    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
    });

    function tick() {
        glow.style.left = mx + 'px';
        glow.style.top = my + 'px';
        requestAnimationFrame(tick);
    }
    tick();
})();

// ─── NAVBAR ─────────────────────────────────────────
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    function checkScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
    window.addEventListener('scroll', checkScroll);
    checkScroll();

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scroll & close menu
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    function highlightNav() {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', highlightNav);
    highlightNav();

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
})();

// ─── SCROLL REVEAL ──────────────────────────────────
(function initReveal() {
    const targets = document.querySelectorAll(
        '.info-card, .timeline-item, .project-card, .skill-category, .contact-tile, .about-text, .section-header'
    );

    targets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    targets.forEach(el => observer.observe(el));
})();

// ─── PROJECT CARD GLOW ──────────────────────────────
(function initCardGlow() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
            card.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
        });
    });
})();

// ─── STAGGERED SKILL PILLS ─────────────────────────
(function initPillStagger() {
    const categories = document.querySelectorAll('.skill-category');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.pill').forEach((pill, i) => {
                    pill.style.opacity = '0';
                    pill.style.transform = 'translateY(8px)';
                    setTimeout(() => {
                        pill.style.transition = 'all 0.35s ease';
                        pill.style.opacity = '1';
                        pill.style.transform = 'translateY(0)';
                    }, i * 55);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    categories.forEach(c => observer.observe(c));
})();

// ─── TERMINAL TYPING EFFECT ─────────────────────────
(function initTerminalTyping() {
    const codeEl = document.querySelector('.terminal-body code');
    if (!codeEl) return;

    const html = codeEl.innerHTML;
    codeEl.innerHTML = '';
    codeEl.style.visibility = 'visible';

    let i = 0, insideTag = false, buffer = '';

    function typeChar() {
        if (i >= html.length) return;
        const char = html[i];

        if (char === '<') {
            insideTag = true;
            buffer = '<';
            i++;
            typeChar();
            return;
        }

        if (insideTag) {
            buffer += char;
            if (char === '>') {
                insideTag = false;
                codeEl.innerHTML += buffer;
                buffer = '';
            }
            i++;
            typeChar();
            return;
        }

        codeEl.innerHTML += char;
        i++;
        setTimeout(typeChar, 18);
    }

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            setTimeout(typeChar, 600);
            observer.disconnect();
        }
    });
    observer.observe(codeEl.closest('.hero'));
})();

// ─── DYNAMIC YEAR ───────────────────────────────────
(function updateYear() {
    const el = document.querySelector('.footer-copy');
    if (el) el.textContent = el.textContent.replace('2026', new Date().getFullYear());
})();

console.log('%c Portfolio loaded ✨ ', 'background: #2563eb; color: #fff; border-radius: 4px; padding: 4px 8px; font-weight: bold;');
