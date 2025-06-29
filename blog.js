document.addEventListener('DOMContentLoaded', async () => {
    const featuredContainer = document.getElementById('featured-posts-container');
    const blogContainer = document.getElementById('blog-posts-container');
    const postContainer = document.getElementById('post-container');

    // Simula una lista de tus archivos de post. En un caso real, esto se generaría dinámicamente.
    // Asegúrate de que los nombres de archivo coincidan con los que tienes en tu carpeta /posts/
    const postsList = [
        '2025-06-29-bienvenidos-a-mi-blog.md'
        // Añade aquí los nombres de tus futuros archivos de post
    ];

    // --- Funciones Auxiliares ---
    const fetchPosts = async () => {
        const posts = [];
        for (const postFile of postsList) {
            const response = await fetch(`posts/${postFile}`);
            const text = await response.text();
            const metadata = parseFrontMatter(text);
            const content = text.split('---').slice(2).join('---');
            posts.push({ ...metadata, content, slug: postFile.replace('.md', '') });
        }
        // Ordena los posts por fecha, del más nuevo al más antiguo
        return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const parseFrontMatter = (text) => {
        const frontMatterMatch = text.match(/---([\s\S]*?)---/);
        if (!frontMatterMatch) return {};
        
        const frontMatter = frontMatterMatch[1];
        const metadata = {};
        frontMatter.split('\n').forEach(line => {
            const [key, ...value] = line.split(':');
            if (key && value.length > 0) {
                metadata[key.trim()] = value.join(':').trim().replace(/^"|"$/g, '');
            }
        });
        return metadata;
    };
    
    // --- Lógica de Renderizado ---
    if (featuredContainer) {
        const allPosts = await fetchPosts();
        const featuredPosts = allPosts.slice(0, 3); // Muestra los 3 más recientes

        featuredPosts.forEach(post => {
            const postCard = `
                <div class="blog-card">
                    <a href="post.html?slug=${post.slug}" class="card-image-link">
                        <img src="${post.thumbnail}" alt="${post.title}">
                    </a>
                    <div class="card-content">
                        <span class="card-category">${post.category}</span>
                        <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
                        <a href="post.html?slug=${post.slug}" class="card-read-more">Leer Más <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            featuredContainer.innerHTML += postCard;
        });
    }

    if (blogContainer) {
        const allPosts = await fetchPosts();
        allPosts.forEach(post => {
            const postCard = `
                <div class="blog-card">
                     <a href="post.html?slug=${post.slug}" class="card-image-link">
                        <img src="${post.thumbnail}" alt="${post.title}">
                    </a>
                    <div class="card-content">
                        <span class="card-category">${post.category}</span>
                        <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
                        <p>${post.subtitle || ''}</p>
                        <a href="post.html?slug=${post.slug}" class="card-read-more">Leer Más <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            blogContainer.innerHTML += postCard;
        });
    }

    if (postContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const postSlug = urlParams.get('slug');

        if (postSlug) {
            const response = await fetch(`posts/${postSlug}.md`);
            const text = await response.text();
            const post = parseFrontMatter(text);
            const content = text.split('---').slice(2).join('---');

            document.title = `${post.title} - Ronald Rangel`;

            const postHTML = `
                <header class="post-header">
                    <span class="post-category">${post.category}</span>
                    <h1 class="post-title">${post.title}</h1>
                    <p class="post-subtitle">${post.subtitle || ''}</p>
                    <div class="post-meta">Publicado el ${new Date(post.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </header>
                <figure class="featured-image">
                    <img src="${post.thumbnail}" alt="${post.title}">
                    <figcaption class="photo-caption">
                        ${post.caption || ''} <span class="credit">${post.credit || ''}</span>
                    </figcaption>
                </figure>
                <div class="post-body">
                    ${marked.parse(content)}
                </div>
            `;
            postContainer.innerHTML = postHTML;
        }
    }
});
