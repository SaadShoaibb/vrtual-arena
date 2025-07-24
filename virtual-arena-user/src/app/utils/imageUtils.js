import { getMediaBaseUrl } from '@/utils/ApiUrl';

/**
 * Get proper image URL that works in both development and production
 * @param {string|array} images - Image path or array of image paths
 * @param {string} fallback - Fallback image path (default: '/assets/d1.png')
 * @returns {string} - Properly formatted image URL
 */
export const getImageUrl = (images, fallback = '/assets/d1.png') => {
    // Handle null/undefined/empty cases
    if (!images) return fallback;
    
    // Handle array of images - take the first one
    let imageUrl;
    if (Array.isArray(images)) {
        if (images.length === 0) return fallback;
        imageUrl = images[0];
    } else if (typeof images === 'string') {
        // Handle comma-separated string of images
        if (images.includes(',')) {
            const imageArray = images.split(',').map(img => img.trim());
            if (imageArray.length === 0) return fallback;
            imageUrl = imageArray[0];
        } else {
            imageUrl = images;
        }
    } else {
        return fallback;
    }

    // Handle empty string
    if (!imageUrl || imageUrl.trim() === '') return fallback;

    // If it's already an absolute URL, ensure it uses https for security
    if (/^https?:\/\//i.test(imageUrl)) {
        return imageUrl.replace('http://', 'https://');
    }

    // Get the media base URL for the current environment
    const base = getMediaBaseUrl();

    // Construct the full URL
    // imageUrl may start with '/' (stored correctly) or without
    return imageUrl.startsWith('/') ? `${base}${imageUrl}` : `${base}/${imageUrl}`;
};

/**
 * Get product image URL specifically for product displays
 * @param {object} product - Product object with images property
 * @param {string} fallback - Fallback image path
 * @returns {string} - Properly formatted image URL
 */
export const getProductImageUrl = (product, fallback = '/assets/d1.png') => {
    if (!product) return fallback;
    return getImageUrl(product.images, fallback);
};

/**
 * Get cart item image URL with special handling for different item types
 * @param {object} cartItem - Cart item object
 * @returns {string} - Properly formatted image URL
 */
export const getCartItemImageUrl = (cartItem) => {
    if (!cartItem) return '/assets/d1.png';
    
    // Special handling for tournaments
    if (cartItem.item_type === 'tournament') {
        return '/assets/tournament.png';
    }
    
    // Handle regular products
    return getImageUrl(cartItem.images, '/assets/d1.png');
};

/**
 * Preload an image to ensure it's cached
 * @param {string} imageUrl - Image URL to preload
 * @returns {Promise} - Promise that resolves when image is loaded
 */
export const preloadImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageUrl;
    });
};

/**
 * Check if an image URL is valid and accessible
 * @param {string} imageUrl - Image URL to check
 * @returns {Promise<boolean>} - Promise that resolves to true if image is accessible
 */
export const isImageAccessible = async (imageUrl) => {
    try {
        await preloadImage(imageUrl);
        return true;
    } catch {
        return false;
    }
};
