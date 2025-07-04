// js/blog.js

// Función para obtener posts
async function fetchPosts() {
  const res = await fetch(" https://todoweb.pro/CMS/wp-json/wp/v2/posts?_embed");
  return await res.json();
}

// Mostrar posts en blog.html
if (document.getElementById("posts-container")) {
  const container = document.getElementById("posts-container");

  fetchPosts().then(posts => {
    if (!posts.length) {
      container.innerHTML = "<p>No hay artículos disponibles.</p>";
      return;
    }

    posts.forEach(post => {
      const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || " https://placehold.co/600x400 ";

      container.innerHTML += `
        <article class="bg-white rounded shadow overflow-hidden hover:shadow-xl transition">
          <img src="${featuredImage}" alt="${post.title.rendered}" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">${post.title.rendered}</h3>
            <div class="text-sm text-gray-600 mb-4">${post.excerpt.rendered.replace(/(<([^>]+)>)/gi, "").substring(0, 120)}...</div>
            <a href="post.html?id=${post.id}" class="text-blue-600 font-semibold hover:underline">Leer más →</a>
          </div>
        </article>
      `;
    });
  });
}

// Mostrar detalle del post en post.html
if (document.getElementById("post-detail")) {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const detailContainer = document.getElementById("post-detail");

  if (postId) {
    fetch(`https://todoweb.pro/CMS/wp-json/wp/v2/posts/ ${postId}?_embed`)
      .then(res => res.json())
      .then(post => {
        const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";

        detailContainer.innerHTML = `
          <h1 class="text-3xl font-bold mb-4">${post.title.rendered}</h1>
          ${featuredImage ? `<img src="${featuredImage}" alt="${post.title.rendered}" class="mb-6 w-full rounded">` : ""}
          <div class="text-lg">${post.content.rendered}</div>
        `;
      })
      .catch(err => {
        detailContainer.innerHTML = "<p>Error al cargar el artículo.</p>";
        console.error(err);
      });
  } else {
    detailContainer.innerHTML = "<p>No se encontró el artículo.</p>";
  }
}
