document.addEventListener('DOMContentLoaded', async () => {
    const featuredContainer = document.getElementById('featured-posts-container');
    const blogContainer = document.getElementById('blog-posts-container');
    const postContainer = document.getElementById('post-container');

    const getPosts = async () => {
        try {
            // Decap CMS crea un índice de tus posts. Lo vamos a buscar.
            // Nota: Este fetch asume que tu colección se llama "blog" en config.yml
            const response = await fetch('/admin/config.yml');
            if (!response.ok) {
                 console.error("No se pudo cargar config.yml. Asegúrate de que exista en la carpeta /admin/");
                 return [];
            }
            // Este es un truco para leer el YAML y encontrar la carpeta de posts
            const configText = await response.text();
            const folderLine = configText.split('\n').find(line => line.trim().startsWith('folder:'));
            if (!folderLine) return [];
            const postsFolder = folderLine.split(':')[1].trim().replace(/"/g, '');

            // Ahora, en un sitio real, necesitaríamos una función que liste los archivos de esa carpeta.
            // Para este sitio estático, debemos mantener una lista manual.
            const postsList = [
                '2025-06-29-bienvenidos-a-mi-blog.md'
                // Añade aquí los nombres de tus futuros archivos de post
            ];
            
            const posts = [];
            for (const postFile of postsList) {
                const postResponse = await fetch(`/${postsFolder}/${postFile}`);
                const text = await postResponse.text();
                const metadata = parseFrontMatter(text);
                const content = text.split('---').slice(2).join('---').trim();
                posts.push({ ...metadata, content, slug: postFile.replace('.md', '') });
            }
            return posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        } catch (error) {
            console.error("Error al cargar los posts:", error);
            return [];
        }
    };

    const parseFrontMatter = (text) => {
        const frontMatterMatch = text.match(/---([\s\S]*?)---/);
        if (!frontMatterMatch) return {};
        const frontMatter = frontMatterMatch[1];
        const metadata = {};
        frontMatter.split('\n').forEach(line => {
            const separatorIndex = line.indexOf(':');
            if (separatorIndex > -1) {
                const key = line.slice(0, separatorIndex).trim();
                const value = line.slice(separatorIndex + 1).trim().replace(/^"|"$/g, '');
                if (key) metadata[key] = value;
            }
        });
        return metadata;
    };

    const renderPosts = (container, posts) => {
        if (!container) return;
        container.innerHTML = ''; // Limpia el contenedor
        if (posts.length === 0) {
            container.innerHTML = "<p>No hay artículos disponibles en este momento.</p>";
            return;
        }
        posts.forEach(post => {
            const excerpt = post.subtitle ? `<p>${post.subtitle}</p>` : '';
            const postCard = `
                <div class="blog-card">
                     <a href="/post.html?slug=${post.slug}" class="card-image-link">
                        <img src="${post.thumbnail || '/assets/img/placeholder.png'}" alt="${post.title || 'Artículo de blog'}">
                    </a>
                    <div class="card-content">
                        <span class="card-category">${post.category || 'Sin Categoría'}</span>
                        <h3><a href="/post.html?slug=${post.slug}">${post.title || 'Sin Título'}</a></h3>
                        ${excerpt}
                        <a href="/post.html?slug=${post.slug}" class="card-read-more">Leer Más <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            container.innerHTML += postCard;
        });
    };

    const renderSinglePost = async () => {
        if (!postContainer) return;
        const urlParams = new URLSearchParams(window.location.search);
        const postSlug = urlParams.get('slug');

        if (postSlug) {
            try {
                const response = await fetch(`/posts/${postSlug}.md`);
                const text = await response.text();
                const post = parseFrontMatter(text);
                const contentHtml = marked.parse(text.split('---').slice(2).join('---').trim());

                document.title = `${post.title} - Ronald Rangel`;

                const postHTML = `
                    <header class="post-header">
                        <span class="post-category">${post.category || ''}</span>
                        <h1 class="post-title">${post.title || ''}</h1>
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
                        ${contentHtml}
                    </div>
                `;
                postContainer.innerHTML = postHTML;
            } catch (error) {
                console.error("Error al cargar el artículo:", error);
                postContainer.innerHTML = "<p>El artículo solicitado no fue encontrado.</p>";
            }
        }
    };

    // --- Ejecución ---
    if (featuredContainer || blogContainer) {
        getPosts().then(posts => {
            if (featuredContainer) renderPosts(featuredContainer, posts.slice(0, 3));
            if (blogContainer) renderPosts(blogContainer, posts);
        });
    }

    if (postContainer) {
        renderSinglePost();
    }
});
