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

        // Animaciones para las secciones al hacer scroll
        const sectionsToAnimate = ['.service-card', '.plan-card', '.about-main-profile', '.team-member-card', '.contact-section > *'];
        
        sectionsToAnimate.forEach(selector => {
            gsap.from(selector, {
                scrollTrigger: {
                    trigger: selector,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                ease: 'power3.out'
            });
        });
    }

    // --- Lógica para el Blog (si el script del blog está en esta página) ---
    const featuredContainer = document.getElementById('featured-posts-container');
    if (featuredContainer && typeof loadFeaturedPosts === 'function') {
        loadFeaturedPosts(); // Asume que tienes una función para cargar posts destacados
    }
});
