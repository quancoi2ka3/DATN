// Simple service worker for handling chunk load errors
self.addEventListener('fetch', (event) => {
  // Only handle GET requests for JavaScript chunks
  if (event.request.method === 'GET' && 
      event.request.url.includes('/_next/static/chunks/')) {
    
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If chunk loading fails, redirect to homepage
          console.log('Chunk load failed, redirecting to homepage');
          return Response.redirect('/', 302);
        })
    );
  }
});
