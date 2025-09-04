import { useState, useEffect } from 'react';

export const useExperienceMedia = (experienceName, fallbackImages = []) => {
  const [showcaseImages, setShowcaseImages] = useState(fallbackImages);
  const [showcaseVideos, setShowcaseVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        // Use relative URLs that will be proxied by Nginx
        const API_URL = '/api/v1'; // this is for the production
        // const API_URL = 'http://localhost:8080/api/v1';
        
        console.log(`Fetching media for: ${experienceName}`);
        const response = await fetch(`${API_URL}/user/experience-media/${experienceName}?t=${Date.now()}`);
        console.log(`Response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Media data:`, data);
          
          if (data.success && data.media && data.media.length > 0) {
            const baseUrl = API_URL.replace('/api/v1', '');
            
            const images = data.media
              .filter(item => item.media_type === 'image')
              .sort((a, b) => a.media_order - b.media_order)
              .map(item => {
                const url = item.media_url.startsWith('/uploads/') ? `http://localhost:8080${item.media_url}` : item.media_url;
                console.log(`Image URL: ${url}`);
                return url;
              });
              
            const videos = data.media
              .filter(item => item.media_type === 'video')
              .sort((a, b) => a.media_order - b.media_order)
              .map(item => item.media_url.startsWith('/uploads/') ? `http://localhost:8080${item.media_url}` : item.media_url);
            
            console.log(`Found ${images.length} images, ${videos.length} videos`);
            
            if (images.length > 0) {
              setShowcaseImages(images);
            }
            
            if (videos.length > 0) {
              setShowcaseVideos(videos);
            }
          } else {
            console.log('No media found or API returned empty data');
          }
        } else {
          console.log(`API request failed with status: ${response.status}`);
        }
      } catch (error) {
        console.log(`Error fetching media for ${experienceName}:`, error);
        // Keep fallback images if API fails
      } finally {
        setLoading(false);
      }
    };
    
    if (experienceName) {
      fetchMedia();
    }
  }, [experienceName]);

  return {
    showcaseImages,
    showcaseVideos,
    loading
  };
};