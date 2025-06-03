import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const galleryDir = path.join(process.cwd(), 'public', 'gallery');
    
    // Read the directory
    const files = await fs.readdir(galleryDir);
    
    // Filter images and videos
    const images = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    const videos = files.filter(file => 
      /\.(mp4|webm|ogg)$/i.test(file)
    );

    return Response.json({
      images: images.map(img => `/gallery/${img}`),
      videos: videos.map(vid => `/gallery/${vid}`)
    });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return Response.json({ 
      images: [], 
      videos: [],
      error: 'Failed to fetch gallery content'
    });
  }
}
