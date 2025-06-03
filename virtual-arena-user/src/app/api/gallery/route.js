import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/gallery`, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure we have the expected data structure
    const images = Array.isArray(data.images) ? data.images : [];
    const videos = Array.isArray(data.videos) ? data.videos : [];
    
    return Response.json({ 
      images: images.map(img => img.startsWith('/') ? img : `/${img}`),
      videos: videos.map(vid => vid.startsWith('/') ? vid : `/${vid}`)
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
