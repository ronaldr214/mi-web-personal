document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica para el Menú Móvil ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.nav-links');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            const isVisible = primaryNav.getAttribute('data-visible');
            if (isVisible === "false" || isVisible === null) {
                primaryNav.setAttribute('data-visible', true);
                mobileNavToggle.setAttribute('aria-expanded', true);
            } else {
                primaryNav.setAttribute('data-visible', false);
                mobileNavToggle.setAttribute('aria-expanded', false);
            }
        });
    }

    // --- Lógica de Animaciones GSAP ---
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Animación de Entrada para el Hero
        gsap.from(".hero-image-panel", { duration: 1.2, x: '100%', ease: 'power3.out', delay: 0.2 });
        gsap.from(".hero-text-panel > *", { duration: 1, y: 40, opacity: 0, stagger: 0.2, ease: 'power3.out', delay: 0.5 });
        gsap.from(".main-header", { duration: 1, y: -100, opacity: 0, ease: 'power3.out', delay: 0.8 });

        // Animación para las Tarjetas de Servicio
        gsap.from(".service-card", {
            scrollTrigger: { trigger: ".services-section", start: "top 80%", toggleActions: "play none none none" },
            duration: 0.8, y: 50, opacity: 0, stagger: 0.2, ease: 'power3.out'
        });

        // Animación para las Tarjetas de Planes
        gsap.from(".plan-card", {
            scrollTrigger: { trigger: ".plans-section", start: "top 80%", toggleActions: "play none none none" },
            duration: 0.8, y: 50, opacity: 0, stagger: 0.2, ease: 'power3.out'
        });

        // Animación para la Sección Sobre Mí
        gsap.from(".about-main-profile", {
            scrollTrigger: { trigger: ".about-section", start: "top 70%", toggleActions: "play none none none" },
            duration: 1, x: -100, opacity: 0, ease: 'power3.out'
        });
        gsap.from(".team-member-card", {
            scrollTrigger: { trigger: ".team-grid", start: "top 80%", toggleActions: "play none none none" },
            duration: 0.7, y: 50, opacity: 0, stagger: 0.2, ease: 'power3.out'
        });

        // Animación para la Sección de Contacto
         gsap.from(".contact-section > *", {
            scrollTrigger: { trigger: ".contact-section", start: "top 80%", toggleActions: "play none none none" },
            duration: 1, y: 50, opacity: 0, stagger: 0.3, ease: 'power3.out'
        });
    }
});
