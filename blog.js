document.addEventListener('DOMContentLoaded', async () => {
    // Selectores de los contenedores
    const featuredContainer = document.getElementById('featured-posts-container');
    const blogContainer = document.getElementById('blog-posts-container');
    const postContainer = document.getElementById('post-container');
    
    // --- FUNCIÓN PRINCIPAL PARA OBTENER POSTS ---
    const getPosts = async () => {
        // En un futuro, se podría generar esta lista automáticamente
        const postsList = [
            '2025-06-29-5-prompts-de-ia-para-startups.md',
            '2025-06-29-bienvenidos-a-mi-blog.md'
        ];

        const postPromises = postsList.map(async (file) => {
            try {
                const response = await fetch(`/posts/${file}`);
                if (!response.ok) return null;
                const text = await response.text();
                const data = parseFrontMatter(text);
                data.slug = file.replace('.md', '');
                data.content = text.split('---').slice(2).join('---').trim();
                return data;
            } catch (e) {
                console.error(`Error cargando el post: ${file}`, e);
                return null;
            }
        });

        const allPosts = (await Promise.all(postPromises)).filter(p => p);
        return allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    // Función para "leer" los metadatos de los archivos .md
    const parseFrontMatter = (text) => { /* ... (código sin cambios) ... */ };
    
    // --- LÓGICA PARA RENDERIZAR ---
    
    // Para la página principal del blog
    if (blogContainer) {
        const posts = await getPosts();
        blogContainer.innerHTML = posts.map(post => {
             const excerpt = post.subtitle || 'Un resumen del contenido del post...';
             return `
             <div class="blog-card">
                 <a href="/post.html?slug=${post.slug}" class="card-image-link"><img src="${post.thumbnail}" alt="${post.title}"></a>
                 <div class="card-content">
                     <span class="card-category">${post.category}</span>
                     <h3><a href="/post.html?slug=${post.slug}">${post.title}</a></h3>
                     <p class="post-excerpt">${excerpt}</p>
                     <a href="/post.html?slug=${post.slug}" class="card-read-more">Leer Más <i class="fas fa-arrow-right"></i></a>
                 </div>
             </div>`;
        }).join('');
    }

    // Para la sección de destacados en el home
    if (featuredContainer) {
        const posts = await getPosts();
        const featuredPosts = posts.slice(0, 3); // Muestra los 3 más recientes
        featuredContainer.innerHTML = featuredPosts.map(post => {
             // Reutilizamos el estilo de las tarjetas del blog
             return `
             <div class="blog-card">
                 <a href="/post.html?slug=${post.slug}" class="card-image-link"><img src="${post.thumbnail}" alt="${post.title}"></a>
                 <div class="card-content">
                     <span class="card-category">${post.category}</span>
                     <h3><a href="/post.html?slug=${post.slug}">${post.title}</a></h3>
                     <a href="/post.html?slug=${post.slug}" class="card-read-more">Leer Más <i class="fas fa-arrow-right"></i></a>
                 </div>
             </div>`;
        }).join('');
    }
    
    // Para la página de un artículo individual
    // (La lógica para renderSinglePost se mantiene igual)

});
