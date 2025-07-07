// pages/blog/index.js (o src/pages/blog/index.js según tu estructura)
import { getAllArticles } from '../../lib/strapi';
import Link from 'next/link';
import Image from 'next/image';

export default function Blog({ articles }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Blog</h1>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map(article => (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {article.featuredImage && (
                <div className="relative h-48">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 line-clamp-2">
                  <Link href={`/blog/${article.slug}`} className="hover:text-blue-600">
                    {article.title}
                  </Link>
                </h2>
                
                <div className="text-gray-600 text-sm mb-4">
                  {new Date(article.publishedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                {article.excerpt && (
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                
                <Link 
                  href={`/blog/${article.slug}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Leer más
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const articles = await getAllArticles();
  
  return {
    props: { articles },
    revalidate: 60 // Revalidar cada 60 segundos
  };
}

// pages/blog/[slug].js - Página individual del artículo
import { getArticleBySlug, getAllArticles } from '../../lib/strapi';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogPost({ article }) {
  if (!article) {
    return <div>Artículo no encontrado</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          href="/blog"
          className="inline-block mb-8 text-blue-600 hover:text-blue-800"
        >
          ← Volver al blog
        </Link>
        
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {article.featuredImage && (
            <div className="relative h-64 md:h-96">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
              
              <div className="text-gray-600 mb-6">
                {new Date(article.publishedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              {article.excerpt && (
                <p className="text-xl text-gray-700 leading-relaxed">
                  {article.excerpt}
                </p>
              )}
            </header>
            
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const articles = await getAllArticles();
  const paths = articles.map(article => ({
    params: { slug: article.slug }
  }));
  
  return {
    paths,
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return { notFound: true };
  }
  
  return {
    props: { article },
    revalidate: 60
  };
}
