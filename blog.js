document.addEventListener('DOMContentLoaded', async () => {
    const featuredContainer = document.getElementById('featured-posts-container');
    const blogContainer = document.getElementById('blog-posts-container');
    const postContainer = document.getElementById('post-container');
    const categoriesContainer = document.getElementById('category-filters-container');
    const searchInput = document.getElementById('searchInput');

    let allPosts = [];

    const parseFrontMatter = (text) => {
        const frontMatterMatch = text.match(/---([\s\S]*?)---/);
        if (!frontMatterMatch) return {};
        const frontMatter = frontMatterMatch[1];
        const metadata = {};
        frontMatter.split('\n').forEach(line => {
            const separatorIndex = line.indexOf(':');
            if (separatorIndex > -1) {
                const key = line.slice(0, separatorIndex).trim();
                const value = line.slice(separatorIndex + 1).trim().replace(/^("|')|("|')$/g, '');
                if (key) metadata[key] = value;
            }
        });
        return metadata;
    };

    const getPosts = async () => {
        if (allPosts.length > 0) return allPosts;

        // Lista de archivos de posts. Esta lista deberá ser mantenida manualmente o generada
        // por un script en un entorno de construcción más avanzado.
        const postsList = [
            '2025-06-29-bienvenidos-a-mi-blog.md',
            '2025-06-29-5-prompts-de-ia-para-startups.md' // Ejemplo
        ];
        
        try {
            const postPromises = postsList.map(async (postFile) => {
                const response = await fetch(`/posts/${postFile}`);
                if (!response.ok) return null;
                const text = await response.text();
                const metadata = parseFrontMatter(text);
                const content = text.split('---').slice(2).join('---').trim();
                return { ...metadata, content, slug: postFile.replace('.md', '') };
            });

            const resolvedPosts = (await Promise.all(postPromises)).filter(p => p);
            allPosts = resolvedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            return allPosts;
        } catch (error) {
            console.error("Error al cargar los posts:", error);
            return [];
        }
    };
    
    const renderPosts = (postsToRender) => {
        if (!blogContainer) return;
        blogContainer.innerHTML = '';
        if (postsToRender.length === 0) {
            blogContainer.innerHTML = "<p>No se encontraron artículos que coincidan con tu búsqueda.</p>";
            return;
        }
        postsToRender.forEach(post => {
            const excerpt = post.subtitle || post.content.substring(0, 150) + '...';
            const postCard = `
                <div class="blog-card">
                     <a href="/post.html?slug=${post.slug}" class="card-image-link">
                        <img src="${post.thumbnail || '/assets/img/placeholder.webp'}" alt="${post.title || ''}">
                    </a>
                    <div class="card-content">
                        <span class="card-category">${post.category || 'General'}</span>
                        <h3><a href="/post.html?slug=${post.slug}">${post.title || 'Sin Título'}</a></h3>
                        <p>${excerpt}</p>
                        <a href="/post.html?slug=${post.slug}" class="card-read-more">Leer Más <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            blogContainer.innerHTML += postCard;
        });
    };
    
    const setupFilters = (posts) => {
        if (!categoriesContainer) return;
        const categories = [...new Set(posts.map(p => p.category).filter(c => c))];
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.dataset.category = category;
            button.innerText = category;
            categoriesContainer.appendChild(button);
        });

        categoriesContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                const category = e.target.dataset.category;
                const filteredPosts = category === 'all' ? allPosts : allPosts.filter(p => p.category === category);
                renderPosts(filteredPosts);
            }
        });
    };
    
    // ... (la función renderSinglePost se mantiene igual)

    // --- Lógica de Ejecución ---
    if (blogContainer) {
        getPosts().then(posts => {
            renderPosts(posts);
            setupFilters(posts);
        });
    }

    if (featuredContainer) {
        getPosts().then(posts => {
            // Lógica para renderizar los posts destacados
        });
    }

    if (postContainer) {
        // Lógica para renderizar un solo post
    }
});
