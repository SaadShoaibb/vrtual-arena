// Image optimization utilities for better performance

/**
 * Get optimized image URL with proper sizing and quality
 */
export const getOptimizedImageUrl = (src, options = {}) => {
  if (!src) return '';

  const {
    width = 800,
    quality = 75,
    format = 'webp'
  } = options;

  // If it's already optimized or external, return as is
  if (src.includes('/_next/image') || src.startsWith('data:')) {
    return src;
  }

  // For local images, use Next.js image optimization
  if (src.startsWith('/')) {
    const params = new URLSearchParams({
      url: src,
      w: width.toString(),
      q: quality.toString()
    });
    return `/_next/image?${params.toString()}`;
  }

  return src;
};

/**
 * Preload critical images for better performance
 */
export const preloadImage = (src, priority = false) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = reject;
    
    // Set loading priority
    if (priority) {
      img.loading = 'eager';
    } else {
      img.loading = 'lazy';
    }
    
    img.src = src;
  });
};

/**
 * Batch preload multiple images
 */
export const preloadImages = async (urls, maxConcurrent = 3) => {
  const results = [];
  
  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    const batchPromises = batch.map(url => 
      preloadImage(url).catch(err => ({ error: err, url }))
    );
    
    const batchResults = await Promise.allSettled(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
};

/**
 * Get responsive image sizes based on viewport
 */
export const getResponsiveSizes = (breakpoints = {}) => {
  const defaultBreakpoints = {
    mobile: '(max-width: 640px) 100vw',
    tablet: '(max-width: 1024px) 50vw',
    desktop: '33vw',
    ...breakpoints
  };
  
  return Object.values(defaultBreakpoints).join(', ');
};

/**
 * Generate blur placeholder for images
 */
export const generateBlurPlaceholder = (width = 8, height = 8) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1f2937');
  gradient.addColorStop(1, '#374151');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
};

/**
 * Lazy loading intersection observer
 */
export const createLazyLoadObserver = (callback, options = {}) => {
  const defaultOptions = {
    rootMargin: '200px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Throttle function for scroll events
 */
export const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};
