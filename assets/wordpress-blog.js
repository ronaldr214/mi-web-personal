// Configuración - Cambia esta URL por tu dominio de WordPress
const WORDPRESS_API_URL = 'https://todoweb.pro/CMS/wp-json/wp/v2';

class WordPressBlog {
    constructor() {
        this.currentPage = 1;
        this.postsPerPage = 9;
        this.totalPages = 1;
        this.loading = false;
    }

    async init() {
        await this.loadPosts();
        this.setupEventListeners();
    }

    async loadPosts(page = 1) {
        if (this.loading) return;
        
        this.loading = true;
        this.showLoading();

        try {
            const response = await fetch(
                `${WORDPRESS_API_URL}/posts?per_page=${this.postsPerPage}&page=${page}&_embed`
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const posts = await response.json();
            
            // Obtener total de páginas del header
            this.totalPages = parseInt(response.headers.get('X-WP-TotalPages')) || 1;
            this.currentPage = page;

            this.renderPosts(posts);
            this.renderPagination();
            
        } catch (error) {
            console.error('Error cargando posts:', error);
            this.showError('Error cargando los artículos. Por favor intenta más tarde.');
        } finally {
            this.loading = false;
        }
    }

    renderPosts(posts) {
        const container = document.getElementById('blog-posts');
        
        if (posts.length === 0) {
            container.innerHTML = '<p class="no-posts">No hay artículos disponibles.</p>';
            return;
        }

        const postsHTML = posts.map(post => this.createPostCard(post)).join('');
        container.innerHTML = postsHTML;
    }

    createPostCard(post) {
        // Obtener imagen destacada
        const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                             'https://via.placeholder.com/400x200?text=Sin+Imagen';
        
        // Obtener categorías
        const categories = post._embedded?.['wp:term']?.[0] || [];
        const categoryName = categories.length > 0 ? categories[0].name : 'General';
        
        // Formatear fecha
        const date = new Date(post.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Limpiar excerpt
        const excerpt = this.stripHtml(post.excerpt.rendered).substring(0, 150) + '...';

        return `
            <article class="post-card">
                <img src="${featuredImage}" alt="${post.title.rendered}" class="post-image" onerror="this.src='https://via.placeholder.com/400x200?text=Sin+Imagen'">
                <div class="post-content">
                    <span class="post-category">${categoryName}</span>
                    <h2 class="post-title">${post.title.rendered}</h2>
                    <div class="post-meta">
                        <span>📅 ${date}</span>
                        <span>👤 Ronald Rangel</span>
                    </div>
                    <p class="post-excerpt">${excerpt}</p>
                    <a href="${post.link}" target="_blank" class="read-more">Leer más</a>
                </div>
            </article>
        `;
    }

    renderPagination() {
        const container = document.getElementById('pagination');
        
        if (this.totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Botón anterior
        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="blog.loadPosts(${this.currentPage - 1})">← Anterior</button>`;
        }

        // Números de página
        for (let i = 1; i <= this.totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="active">${i}</button>`;
            } else if (i === 1 || i === this.totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `<button onclick="blog.loadPosts(${i})">${i}</button>`;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<span>...</span>`;
            }
        }

        // Botón siguiente
        if (this.currentPage < this.totalPages) {
            paginationHTML += `<button onclick="blog.loadPosts(${this.currentPage + 1})">Siguiente →</button>`;
        }

        container.innerHTML = paginationHTML;
    }

    showLoading() {
        document.getElementById('blog-posts').innerHTML = '<div class="loading">⏳ Cargando artículos...</div>';
    }

    showError(message) {
        document.getElementById('blog-posts').innerHTML = `<div class="error">❌ ${message}</div>`;
    }

    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    setupEventListeners() {
        // Búsqueda (opcional)
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchPosts(e.target.value);
                }, 500);
            });
        }
    }

    async searchPosts(query) {
        if (!query.trim()) {
            this.loadPosts(1);
            return;
        }

        this.showLoading();

        try {
            const response = await fetch(
                `${WORDPRESS_API_URL}/posts?search=${encodeURIComponent(query)}&_embed`
            );
            const posts = await response.json();
            this.renderPosts(posts);
            document.getElementById('pagination').innerHTML = '';
        } catch (error) {
            this.showError('Error en la búsqueda');
        }
    }

    // Método para obtener posts destacados para la homepage
    async getFeaturedPosts(limit = 3) {
        try {
            const response = await fetch(
                `${WORDPRESS_API_URL}/posts?per_page=${limit}&_embed&sticky=true`
            );
            return await response.json();
        } catch (error) {
            console.error('Error cargando posts destacados:', error);
            return [];
        }
    }
}

// Inicializar cuando cargue la página
let blog;
document.addEventListener('DOMContentLoaded', () => {
    blog = new WordPressBlog();
    blog.init();
});

// Para usar en la homepage (opcional)
async function loadFeaturedPostsHomepage() {
    const blogInstance = new WordPressBlog();
    const posts = await blogInstance.getFeaturedPosts(3);
    
    // Renderizar en la homepage
    const container = document.getElementById('featured-posts-home');
    if (container && posts.length > 0) {
        container.innerHTML = posts.map(post => blogInstance.createPostCard(post)).join('');
    }
}
