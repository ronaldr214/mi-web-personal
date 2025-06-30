const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Directorio donde Netlify CMS guarda los posts
const postsDirectory = path.join(process.cwd(), '_posts');
const outputFile = path.join(process.cwd(), 'posts.json');

function buildPostsJson() {
    try {
        // Verificar si existe el directorio de posts
        if (!fs.existsSync(postsDirectory)) {
            console.log('Directorio _posts no encontrado, creando posts.json vacío');
            fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
            return;
        }

        // Leer todos los archivos markdown del directorio
        const files = fs.readdirSync(postsDirectory).filter(file => 
            file.endsWith('.md') || file.endsWith('.markdown')
        );

        if (files.length === 0) {
            console.log('No se encontraron posts, creando posts.json vacío');
            fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
            return;
        }

        const posts = [];

        files.forEach(filename => {
            const filePath = path.join(postsDirectory, filename);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            // Parsear el front matter
            const { data, content } = matter(fileContent);
            
            // Crear el objeto del post
            const post = {
                titulo: data.titulo || 'Sin título',
                slug: data.slug || filename.replace(/\.(md|markdown)$/, ''),
                categoria: data.categoria || 'General',
                fecha: data.fecha || new Date().toISOString().split('T')[0],
                autor: data.autor || 'Ronald Rangel',
                destacado: data.destacado || false,
                imagen_principal: data.imagen_principal || '',
                resumen: data.resumen || '',
                contenido: content || '',
                seo_title: data.seo_title || data.titulo,
                seo_description: data.seo_description || data.resumen
            };

            posts.push(post);
        });

        // Ordenar posts por fecha (más recientes primero)
        posts.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // Escribir el archivo JSON
        fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
        console.log(`✅ posts.json generado exitosamente con ${posts.length} posts`);
        
        // Mostrar resumen
        const destacados = posts.filter(p => p.destacado).length;
        console.log(`📊 Resumen: ${posts.length} posts total, ${destacados} destacados`);
        
    } catch (error) {
        console.error('❌ Error generando posts.json:', error);
        process.exit(1);
    }
}

// Ejecutar el script
buildPostsJson();
