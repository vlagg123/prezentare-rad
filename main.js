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


    // ── Active nav link on scroll (deterministic) ──────────
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));

    const setActiveLink = (id) => {
        navLinks.forEach(link => {
            const matches = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', matches);
        });
    };

    // Alege secțiunea care trece printr-un “probe line” imediat sub navbar
    const getActiveSectionId = () => {
        const navbarH = navbar?.offsetHeight ?? 0;
        const probeY = navbarH + 24; // 24px sub navbar

        for (const s of sections) {
            const rect = s.getBoundingClientRect();
            if (rect.top <= probeY && rect.bottom > probeY) {
                return s.id;
            }
        }

        return sections[0]?.id;
    };

    let ticking = false;
    const onActiveScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const id = getActiveSectionId();
            if (id) setActiveLink(id);
            ticking = false;
        });
    };

    window.addEventListener('scroll', onActiveScroll, { passive: true });
    onActiveScroll(); // setare inițială

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
            setActiveLink(target.id);
            history.replaceState(null, '', window.location.pathname + window.location.search);
        });
    });


    // ── Mobile menu ────────────────────────────
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
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


    // ── Contact form submit (FormSubmit) ─────
    const contactForm = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    // Show success message after FormSubmit redirect (?sent=1)
    try {
        const url = new URL(window.location.href);

        if (url.searchParams.get('sent') === '1' && feedback) {
            feedback.className = 'mt-6 p-4 rounded-xl text-sm font-medium success';
            feedback.textContent = '✓ Solicitarea ta a fost trimisă! Te contactăm în maxim 24 de ore.';
            const contactSection = document.getElementById('contact');
            contactSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Remove the flag so refresh doesn't keep showing the message
            url.searchParams.delete('sent');
            const qs = url.searchParams.toString();
            history.replaceState(null, '', url.pathname + (qs ? `?${qs}` : ''));
        }
    } catch (_) {
        // ignore
    }

    contactForm?.addEventListener('submit', (e) => {
        // Client-side validation (keeps your nice UI), then allow normal POST to FormSubmit
        const required = contactForm.querySelectorAll('[required]');
        let valid = true;

        required.forEach((field) => {
            field.classList.remove('border-error/60');

            // For selects, value can be "" when placeholder option is selected
            const value = (field.value ?? '').toString().trim();
            if (!value) {
                field.classList.add('border-error/60');
                valid = false;
            }
        });

        // Basic email format check for _replyto
        const emailField = contactForm.querySelector('input[name="_replyto"]');
        if (emailField) {
            const email = emailField.value.trim();
            const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!ok) {
                emailField.classList.add('border-error/60');
                valid = false;
            }
        }

        if (!valid) {
            e.preventDefault();
            if (feedback) {
                feedback.className = 'mt-6 p-4 rounded-xl text-sm font-medium error';
                feedback.textContent = 'Te rugăm să completezi corect toate câmpurile obligatorii.';
            }
            return;
        }

        // Optional: show sending state
        if (feedback) {
            feedback.className = 'mt-6 p-4 rounded-xl text-sm font-medium success';
            feedback.textContent = 'Se trimite...';
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.85';
        }

        // Do NOT preventDefault — let the browser submit to FormSubmit
    });

});
