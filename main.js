/* =============================================
   RAD – Registrul Auto Digital  |  main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ── Scroll reveal ──────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    // ── Navbar scroll effect ───────────────────
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });


    // ── Active nav link on scroll ──────────────
    const sections   = document.querySelectorAll('section[id]');
    const navLinks   = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const matches = link.getAttribute('href') === `#${id}`;
                    link.classList.toggle('active', matches);
                });
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(s => sectionObserver.observe(s));


    // ── Smooth scroll for anchor links ────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            closeMobileMenu();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });


    // ── Mobile menu ────────────────────────────
    const menuBtn   = document.getElementById('menu-btn');
    const closeBtn  = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    function openMobileMenu() {
        mobileMenu?.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu?.classList.remove('open');
        document.body.style.overflow = '';
    }

    menuBtn?.addEventListener('click', openMobileMenu);
    closeBtn?.addEventListener('click', closeMobileMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    // Close menu when clicking outside the menu panel
    mobileMenu?.addEventListener('click', (e) => {
        if (e.target === mobileMenu) closeMobileMenu();
    });


    // ── Contact form submit (placeholder) ─────
    const contactForm = document.getElementById('contact-form');
    const feedback    = document.getElementById('form-feedback');

    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const required = contactForm.querySelectorAll('[required]');
        let valid = true;
        required.forEach(field => {
            field.classList.remove('border-error/60');
            if (!field.value.trim()) {
                field.classList.add('border-error/60');
                valid = false;
            }
        });

        if (!valid) {
            feedback.className = 'mt-6 p-4 rounded-xl text-sm font-medium error';
            feedback.textContent = 'Te rugăm să completezi toate câmpurile obligatorii.';
            return;
        }

        // TODO: conectează la backend / serviciu email
        feedback.className = 'mt-6 p-4 rounded-xl text-sm font-medium success';
        feedback.textContent = '✓ Solicitarea ta a fost trimisă! Te contactăm în maxim 24 de ore.';
        contactForm.reset();
    });

});
