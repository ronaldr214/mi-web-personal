document.addEventListener('DOMContentLoaded', function() {

    // Registra el plugin de ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // --- Animación de Entrada para el Hero ---
    gsap.set('.hero-text-panel > *', { autoAlpha: 0, y: 30 });
    gsap.set('.hero-image-panel', { autoAlpha: 0, x: '100%' });
    gsap.set('.logo, .nav-links li', { autoAlpha: 0, y: -20 });

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl.to('.hero-image-panel', { duration: 1.5, autoAlpha: 1, x: '0%' })
          .to('.hero-text-panel h1', { duration: 0.8, autoAlpha: 1, y: 0 }, "-=1.2")
          .to('.hero-text-panel p', { duration: 0.8, autoAlpha: 1, y: 0 }, "-=0.8")
          .to('.hero-text-panel .cta-button', { duration: 0.8, autoAlpha: 1, y: 0 }, "-=0.6")
          .to('.logo', { duration: 0.5, autoAlpha: 1, y: 0 }, "-=0.5")
          .to('.nav-links li', { duration: 0.5, autoAlpha: 1, y: 0, stagger: 0.1 }, "<");

    
    // --- NUEVO: Animación para las Tarjetas de Servicio ---
    gsap.from(".service-card", {
        scrollTrigger: {
            trigger: ".services-section", // El elemento que dispara la animación
            start: "top 80%", // Empieza cuando el 80% de la ventana ha alcanzado la sección
            toggleActions: "play none none none" // La animación solo se ejecuta una vez
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2, // Anima cada tarjeta con 0.2s de diferencia
        ease: 'power3.out'
    });

});