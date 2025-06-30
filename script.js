document.addEventListener('DOMContentLoaded', function() { 
    // --- Lógica para el Menú Móvil ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.nav-links');
    if (mobileNavToggle) {
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
    }

    // --- Lógica de Animaciones GSAP ---
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".hero-image-panel", { duration: 1.2, x: '100%', ease: 'power3.out', delay: 0.2 });
        gsap.from(".hero-text-panel > *", { duration: 1, y: 40, opacity: 0, stagger: 0.2, ease: 'power3.out', delay: 0.5 });
        gsap.from(".main-header", { duration: 1, y: -100, opacity: 0, ease: 'power3.out', delay: 0.8 });

        const sections = [".service-card", ".plan-card", ".about-main-profile", ".team-member-card", ".contact-section > *"];
        sections.forEach(selector => {
            gsap.from(selector, {
                scrollTrigger: {
                    trigger: selector,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                ease: 'power3.out'
            });
        });
    }

    // --- Blog dinámico desde Markdown ---
    const blogContainer = document.querySelector('.blog-grid');

    if (blogContainer) {
        const postsFolder = '/content/blog/';
        const posts = [
            '2025-06-29-el-segundo-round-cómo-usar-los-errores-de-tu-primer-negocio-como-arma-secreta.md',
            'mi-primer-post.md'
        ];

        const slugify = text =>
            text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');

        async function loadFeaturedPosts() {
            for (const file of posts) {
                const res = await fetch(postsFolder + file);
                const text = await res.text();

                const frontmatter = text.match(/---\n([\s\S]*?)\n---/);
                const body = text.replace(/---[\s\S]*?---/, '').trim();
                const metadata = {};

                if (frontmatter) {
                    frontmatter[1].split('\n').forEach(line => {
                        const [key, ...rest] = line.split(':');
                        metadata[key.trim().toLowerCase()] = rest.join(':').trim();
                    });
                }

                if (metadata.destacado?.toLowerCase() === 'true') {
                  const html = `
                  <article class="post-card">
                ${metadata["imagen principal"] ? `<img src="${metadata["imagen principal"]}" alt="${metadata["pie de imagen"] || metadata.título}">` : ''}
                <div class="post-card-content">
                  <h3>${metadata.título}</h3>
                  ${metadata.subtítulo ? `<p><em>${metadata.subtítulo}</em></p>` : ''}
              <p>${metadata.extracto || metadata["descripción corta del post"] || ''}</p>
              <p class="post-meta">${metadata.categoría || ''} · ${metadata["tiempo de lectura"] || '?'} min</p>
            </div>
              </article>
                    `;
                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = html.trim();
                    blogContainer.appendChild(wrapper.firstChild);
                }
            }

            if (typeof gsap !== 'undefined') {
                gsap.to(".post-card", {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.2,
                    ease: "power2.out"
                });
            }
        }

        loadFeaturedPosts();
    }
});
