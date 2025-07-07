// lib/strapi.js (crear este archivo en tu proyecto mi-web-personal)
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function getAllArticles() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/articles?populate=*`);
    const data = await response.json();
    
    return data.data.map(article => ({
      id: article.id,
      title: article.attributes.title,
      content: article.attributes.content,
      excerpt: article.attributes.excerpt,
      slug: article.attributes.slug,
      publishedAt: article.attributes.publishedAt,
      featuredImage: article.attributes.featuredImage?.data?.attributes?.url 
        ? `${STRAPI_URL}${article.attributes.featuredImage.data.attributes.url}`
        : null,
    }));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`);
    const data = await response.json();
    
    if (!data.data.length) return null;
    
    const article = data.data[0];
    return {
      id: article.id,
      title: article.attributes.title,
      content: article.attributes.content,
      excerpt: article.attributes.excerpt,
      slug: article.attributes.slug,
      publishedAt: article.attributes.publishedAt,
      featuredImage: article.attributes.featuredImage?.data?.attributes?.url 
        ? `${STRAPI_URL}${article.attributes.featuredImage.data.attributes.url}`
        : null,
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function getRecentArticles(limit = 3) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/articles?populate=*&pagination[limit]=${limit}&sort=publishedAt:desc`);
    const data = await response.json();
    
    return data.data.map(article => ({
      id: article.id,
      title: article.attributes.title,
      excerpt: article.attributes.excerpt,
      slug: article.attributes.slug,
      publishedAt: article.attributes.publishedAt,
      featuredImage: article.attributes.featuredImage?.data?.attributes?.url 
        ? `${STRAPI_URL}${article.attributes.featuredImage.data.attributes.url}`
        : null,
    }));
  } catch (error) {
    console.error('Error fetching recent articles:', error);
    return [];
  }
}
