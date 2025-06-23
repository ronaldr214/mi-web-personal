document.addEventListener('DOMContentLoaded', function() {

    // Registra el plugin de ScrollTrigger para las animaciones al hacer scroll
    gsap.registerPlugin(ScrollTrigger);

    // --- Animación de Entrada para el Hero (Reescrita para ser más segura) ---
    // En lugar de ocultar todo primero, animamos cada elemento desde un estado inicial.
    // Esto asegura que si algo falla, el contenido al menos será visible.

    // El panel de la imagen se desliza desde la derecha
    gsap.from(".hero-image-panel", { 
        duration: 1.2, 
        x: '100%', // Empieza fuera de la pantalla a la derecha
        ease: 'power3.out',
        delay: 0.2 // Un pequeño retraso para asegurar que todo esté cargado
    });

    // El texto aparece con un ligero retraso y escalonamiento
    gsap.from(".hero-text-panel > *", {
        duration: 1,
        y: 40, // Empiezan 40px más abajo
        opacity: 0, // Empiezan invisibles
        stagger: 0.2, // Cada elemento aparece 0.2s después del anterior
        ease: 'power3.out',
        delay: 0.5 // Empieza después de que la imagen comience a moverse
    });

    // La navegación aparece desde arriba
    gsap.from(".main-header", {
        duration: 1,
        y: -100, // Empieza 100px por encima
        opacity: 0,
        ease: 'power3.out',
        delay: 0.8
    });


    // --- Animación para las Tarjetas de Servicio (Ya era segura, pero la mantenemos consistente) ---
    gsap.from(".service-card", {
        scrollTrigger: {
            trigger: ".services-section", // El elemento que dispara la animación
            start: "top 80%", // Empieza cuando el 80% de la ventana ha alcanzado la sección
            toggleActions: "play none none none" 
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2, // Anima cada tarjeta con 0.2s de diferencia
        ease: 'power3.out'
    });

    // --- Animación para la Sección Sobre Mí ---
    gsap.from(".about-main-profile", {
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 70%",
            toggleActions: "play none none none"
        },
        duration: 1,
        x: -100, // Entra desde la izquierda
        opacity: 0,
        ease: 'power3.out'
    });

    gsap.from(".team-member-card", {
        scrollTrigger: {
            trigger: ".team-grid",
            start: "top 80%",
            toggleActions: "play none none none"
        },
        duration: 0.7,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    });

});