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
// Agregar este código a tu script.js existente

// Función para cargar posts destacados en la página principal
async function loadFeaturedPosts() {
    const container = document.getElementById('featured-posts-container');
    
    if (!container) return;
    
    try {
        // Buscar archivos markdown en la carpeta posts
        const response = await fetch('/posts/');
        
        if (!response.ok) {
            console.log('Carpeta posts no encontrada, creando posts de ejemplo...');
            showSamplePosts();
            return;
        }
        
        // Si la carpeta existe pero está vacía, mostrar mensaje
        container.innerHTML = `
            <div class="no-posts-message">
                <p>No hay artículos publicados aún.</p>
                <p><a href="/admin" style="color: var(--primary-color);">Crear mi primer artículo</a></p>
            </div>
        `;
        
    } catch (error) {
        console.error('Error cargando posts:', error);
        showSamplePosts();
    }
}

// Función para mostrar posts de ejemplo mientras no hay contenido real
function showSamplePosts() {
    const container = document.getElementById('featured-posts-container');
    
    const samplePosts = [
        {
            title: "Cómo la IA está transformando el marketing digital",
            date: "2025-01-15",
            thumbnail: "assets/img/uploads/sample-1.webp",
            category: "Inteligencia Artificial",
            subtitle: "Descubre las herramientas de IA que están revolucionando la forma de hacer marketing"
        },
        {
            title: "5 estrategias de branding que todo emprendedor debe conocer",
            date: "2025-01-10",
            thumbnail: "assets/img/uploads/sample-2.webp",
            category: "Branding",
            subtitle: "Tu marca es más que un logo: aprende a construir una identidad memorable"
        },
        {
            title: "El futuro del desarrollo web: tendencias 2025",
            date: "2025-01-05",
            thumbnail: "assets/img/uploads/sample-3.webp",
            category: "Desarrollo Web",
            subtitle: "Las tecnologías y enfoques que dominarán el desarrollo web este año"
        }
    ];
    
    container.innerHTML = samplePosts.map(post => `
        <article class="featured-post-card">
            <div class="post-image">
                <img src="${post.thumbnail}" alt="${post.title}" onerror="this.src='hero-photo.webp'">
                <span class="post-category">${post.category}</span>
            </div>
            <div class="post-content">
                <h3>${post.title}</h3>
                <p>${post.subtitle}</p>
                <div class="post-meta">
                    <span class="post-date">${new Date(post.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <a href="/admin" class="read-more">Leer más →</a>
            </div>
        </article>
    `).join('');
}

// Cargar posts cuando se carga la página
document.addEventListener('DOMContentLoaded', loadFeaturedPosts);
