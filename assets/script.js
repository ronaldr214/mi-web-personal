document.addEventListener('DOMContentLoaded', function() {

    gsap.registerPlugin(ScrollTrigger);

    // ... (Todas tus animaciones de GSAP se mantienen igual)
    // ...

    // ======== NUEVO: LÓGICA PARA EL MENÚ MÓVIL ========
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.nav-links');

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

});