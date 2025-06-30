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
        // Animaciones para todas las secciones
        const sectionsToAnimate = ['.hero-text-panel > *', '.service-card', '.plan-card', '.about-main-profile', '.team-member-card', '.contact-section > *'];
        gsap.from(".hero-image-panel", { duration: 1.2, x: '100%', ease: 'power3.out', delay: 0.2 });
        // ... (resto de las animaciones que ya te había dado)
    }
});
