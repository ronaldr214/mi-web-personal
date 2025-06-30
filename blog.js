// ==========================================
// blog.js - JavaScript para el blog
// ==========================================

// Función para cargar todos los posts
async function loadBlogPosts() {
    try {
        const response = await fetch('/posts.json');
        const posts = await response.json();
        
        if (!posts || posts.length === 0) {
            document.getElementById('noPosts').style.display = 'block';
            return;
        }
        
        const blogGrid = document.getElementById('blogGrid');
        
        blogGrid.innerHTML = posts.map(post => `
            <article class="blog-card">
                <div class="blog-image">
                    <img src="${post.featured_image || '/assets/default-blog-image.webp'}" 
                         alt="${post.title}"
                         onerror="this.src='/assets/default-blog-image.webp'">
                    ${post.category ? `<span class="blog-category">${post.category}</span>` : ''}
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">${new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span class="blog-author">Por ${post.author}</span>
                    </div>
                    <h2 class="blog-title">
                        <a href="${post.slug}">${post.title}</a>
                    </h2>
                    <p class="blog-excerpt">${post.excerpt || (post.body ? post.body.substring(0, 150) + '...' : '')}</p>
                    <a href="${post.slug}" class="read-more-btn">Leer artículo completo</a>
                </div>
            </article>
        `).join('');
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        document.getElementById('noPosts').style.display = 'block';
    }
}

// Función para cargar un post individual
async function loadSinglePost() {
    const path = window.location.pathname;
    const postId = path.split('/').pop();
    
    try {
        const response = await fetch('/posts.json');
        const posts = await response.json();
        
        const post = posts.find(p => p.slug === path || p.filename.replace('.md', '') === postId);
        
        if (!post) {
            document.body.innerHTML = '<h1>Artículo no encontrado</h1><p><a href="/blog">Volver al blog</a></p>';
            return;
        }
        
        // Renderizar el post completo
        document.title = `${post.title} - Ronald Rangel`;
        
        const postHtml = `
            <article class="single-post">
                <header class="post-header">
                    <div class="container">
                        <nav class="breadcrumb">
                            <a href="/">Inicio</a> > <a href="/blog">Blog</a> > ${post.title}
                        </nav>
                        ${post.category ? `<span class="post-category">${post.category}</span>` : ''}
                        <h1 class="post-title">${post.title}</h1>
                        <div class="post-meta">
                            <span>Por ${post.author}</span>
                            <span>${new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </header>
                
                ${post.featured_image ? `
                <div class="post-featured-image">
                    <img src="${post.featured_image}" alt="${post.title}">
                </div>
                ` : ''}
                
                <div class="post-content">
                    <div class="container">
                        <div class="post-body">
                            ${markdownToHtml(post.body)}
                        </div>
                        
                        <div class="post-footer">
                            <div class="post-share">
                                <h4>Comparte este artículo</h4>
                                <div class="share-buttons">
                                    <a href="https://wa.me/?text=${encodeURIComponent(post.title + ' - ' + window.location.href)}" class="share-btn whatsapp">WhatsApp</a>
                                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" class="share-btn linkedin">LinkedIn</a>
                                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}" class="share-btn twitter">Twitter</a>
                                </div>
                            </div>
                            
                            <div class="back-to-blog">
                                <a href="/blog" class="btn-secondary">← Volver al blog</a>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        `;
        
        document.body.innerHTML = postHtml;
        
    } catch (error) {
        console.error('Error loading post:', error);
        document.body.innerHTML = '<h1>Error cargando el artículo</h1><p><a href="/blog">Volver al blog</a></p>';
    }
}

// Función simple para convertir markdown a HTML (básica)
function markdownToHtml(markdown) {
    return markdown
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
        .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/^(.*)$/gim, '<p>$1</p>');
}

// Determinar qué cargar según la página
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    if (path === '/blog' || path === '/blog/') {
        loadBlogPosts();
    } else if (path.startsWith('/blog/')) {
        loadSinglePost();
    }
});

// ==========================================
// package.json - Scripts de construcción
// ==========================================

/*
{
  "name": "ronald-rangel-blog",
  "version": "1.0.0",
  "scripts": {
    "build": "node build-posts.js",
    "dev": "node build-posts.js && python -m http.server 8000",
    "prebuild": "node build-posts.js"
  },
  "dependencies": {
    "gray-matter": "^4.0.3"
  }
}
*/
