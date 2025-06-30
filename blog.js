document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('postsContainer');
    const categoriesContainer = document.getElementById('category-filters-container');
    const searchInput = document.getElementById('searchInput');

    let allPosts = []; // Guardaremos todos los posts aquí para no pedirlos cada vez

    // Parsea los metadatos de cada archivo Markdown
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

    // Carga todos los posts
    const loadPosts = async () => {
        // En un futuro, aquí podrías cargar un archivo `posts.json` para no listar los archivos a mano.
        const postFiles = [
            '2025-06-29-5-prompts-de-ia-para-startups.md',
            '2025-06-29-bienvenidos-a-mi-blog.md'
        ];

        const postPromises = postFiles.map(file => 
            fetch(`/posts/${file}`)
                .then(response => response.text())
                .then(text => {
                    const data = parseFrontMatter(text);
                    data.slug = file.replace('.md', '');
                    return data;
                })
        );
        allPosts = await Promise.all(postPromises);
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        displayPosts(allPosts);
        createCategoryFilters();
    };

    // Muestra los posts en el HTML
    const displayPosts = (posts) => {
        if (!postsContainer) return;
        postsContainer.innerHTML = posts.map(post => {
            const excerpt = post.subtitle || 'Haz clic para leer más...';
            return `
            <article class="post-card">
                <a href="/post.html?slug=${post.slug}" class="post-image-link">
                    <img src="${post.thumbnail}" alt="${post.title}" class="post-image">
                </a>
                <div class="post-content">
                    <span class="post-category">${post.category}</span>
                    <a href="/post.html?slug=${post.slug}" style="text-decoration:none;">
                        <h2 class="post-title">${post.title}</h2>
                    </a>
                    <p class="post-excerpt">${excerpt}</p>
                    <div class="post-footer">
                        <span class="post-date">${new Date(post.date).toLocaleDateString('es-CO', {day: 'numeric', month: 'long', year: 'numeric'})}</span>
                        <a href="/post.html?slug=${post.slug}" class="read-more">Leer Más <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </article>
            `;
        }).join('');
    };

    // Crea los botones de filtro de categoría
    const createCategoryFilters = () => {
        if (!categoriesContainer) return;
        const categories = ['all', ...new Set(allPosts.map(post => post.category))];
        categoriesContainer.innerHTML = categories.map(category => 
            `<button class="filter-btn ${category === 'all' ? 'active' : ''}" data-category="${category}">
                ${category.charAt(0).toUpperCase() + category.slice(1)}
            </button>`
        ).join('');
    };

    // Lógica para filtrar
    if (categoriesContainer) {
        categoriesContainer.addEventListener('click', e => {
            if (e.target.tagName === 'BUTTON') {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                const category = e.target.dataset.category;
                const filtered = category === 'all' ? allPosts : allPosts.filter(p => p.category === category);
                displayPosts(filtered);
            }
        });
    }

    // Lógica para buscar
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = allPosts.filter(p => p.title.toLowerCase().includes(searchTerm) || p.subtitle.toLowerCase().includes(searchTerm));
            displayPosts(filtered);
        });
    }

    loadPosts();
});
