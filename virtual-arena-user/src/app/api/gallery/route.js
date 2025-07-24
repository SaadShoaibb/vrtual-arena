import { promises as fs } from 'fs';
import path from 'path';

// Helper function to get media base URL
function getMediaBaseUrl() {
  // For deployment, use the environment variable or construct from request
  if (process.env.NEXT_PUBLIC_MEDIA_BASE_URL) {
    return process.env.NEXT_PUBLIC_MEDIA_BASE_URL.replace(/\/$/, '');
  }

  // For development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // For production, try to get from headers or use relative paths
  return '';
}

export async function GET(request) {
  try {
    const galleryDir = path.join(process.cwd(), 'public', 'gallery');
    const mediaBaseUrl = getMediaBaseUrl();

    // Check if directory exists
    try {
      await fs.access(galleryDir);
    } catch {
      // Directory doesn't exist, return empty arrays
      return Response.json({
        images: [],
        videos: [],
        mediaBaseUrl
      });
    }

    // Read the directory
    const files = await fs.readdir(galleryDir);

    // Filter and sort images
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort()
      .map(img => ({
        filename: img,
        url: mediaBaseUrl ? `${mediaBaseUrl}/gallery/${img}` : `/gallery/${img}`,
        type: 'image'
      }));

    // Filter and sort videos with poster images
    const videos = files
      .filter(file => /\.(mp4|webm|ogg)$/i.test(file))
      .sort()
      .map(vid => {
        const posterName = vid.replace(/\.(mp4|webm|ogg)$/i, '.jpg');
        const posterExists = files.includes(posterName);

        return {
          filename: vid,
          url: mediaBaseUrl ? `${mediaBaseUrl}/gallery/${vid}` : `/gallery/${vid}`,
          poster: posterExists
            ? (mediaBaseUrl ? `${mediaBaseUrl}/gallery/${posterName}` : `/gallery/${posterName}`)
            : null,
          type: 'video'
        };
      });

    return Response.json({
      images,
      videos,
      mediaBaseUrl,
      total: images.length + videos.length
    });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return Response.json({
      images: [],
      videos: [],
      mediaBaseUrl: getMediaBaseUrl(),
      error: 'Failed to fetch gallery content'
    });
  }
}
