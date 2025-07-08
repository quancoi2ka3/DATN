// Fix for chunk loading timeout issues
if (typeof window !== 'undefined') {
  // Extend chunk loading timeout
  window.__webpack_public_path__ = '/_next/';
  
  // Handle chunk load errors
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('ChunkLoadError')) {
      console.log('Chunk load error detected, reloading page...');
      window.location.reload();
    }
  });

  // Handle unhandled promise rejections for chunk errors
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.name === 'ChunkLoadError') {
      console.log('Chunk load error in promise, reloading page...');
      event.preventDefault();
      window.location.reload();
    }
  });
}
