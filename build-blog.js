// build-blog.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const WP_API_URL = 'https://todoweb.pro/CMS/wp-json/wp/v2/';
const OUTPUT_DIR = './blog'; // Directorio donde se guardarán los posts individuales
const POSTS_JSON_PATH = './posts.json'; // Ruta para el JSON de posts

async function fetchWordPressPosts( ) {
    try {
        const response = await axios.get(`${WP_API_URL}posts`, {
            params: {
                _embed: true,
                per_page: 100,
                orderby: 'date',
                order: 'desc'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching posts from WordPress API:', error.message);
        return [];
    }
}

async function buildBlog() {
    console.log('Iniciando construcción del blog desde WordPress...');

    const wpPosts = await fetchWordPressPosts();
    if (wpPosts.length === 0) {
        console.warn('No se encontraron posts en WordPress. No se generará contenido del blog.');
        fs.writeFileSync(POSTS_JSON_PATH, JSON.stringify([]));
        return;
    }

    const allPostsData = wpPosts.map(post => {
        const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
        const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'General';
        const excerpt = post.excerpt.rendered.replace(/<[^>]*>?/gm, '');

        return {
            id: post.id,
            title: post.title.rendered,
            date: post.date,
            excerpt: excerpt,
            slug: post.slug,
            featured_image: featuredImage,
            author: post._embedded?.author?.[0]?.name || 'Ronald Rangel',
            category: category,
            content: post.content.rendered
        };
    });

    fs.writeFileSync(POSTS_JSON_PATH, JSON.stringify(allPostsData, null, 2));
    console.log(`Generado ${POSTS_JSON_PATH} con ${allPostsData.length} posts.`);

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    for (const post of allPostsData) {
        const postHtml = `
