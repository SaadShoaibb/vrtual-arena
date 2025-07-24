#!/usr/bin/env node

/**
 * Media Optimization Script
 * 
 * This script helps optimize images and videos for better web performance.
 * It can be run manually or as part of the build process.
 * 
 * Usage:
 * node scripts/optimize-media.js
 * 
 * Requirements:
 * - ffmpeg (for video optimization)
 * - sharp (for image optimization) - install with: npm install sharp
 */

const fs = require('fs').promises;
const path = require('path');

const GALLERY_DIR = path.join(__dirname, '..', 'public', 'gallery');
const OPTIMIZED_DIR = path.join(GALLERY_DIR, 'optimized');

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

async function getMediaFiles() {
  try {
    const files = await fs.readdir(GALLERY_DIR);
    
    const images = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && !file.startsWith('.')
    );
    
    const videos = files.filter(file => 
      /\.(mp4|webm|ogg|mov|avi)$/i.test(file) && !file.startsWith('.')
    );
    
    return { images, videos };
  } catch (error) {
    console.error('Error reading gallery directory:', error);
    return { images: [], videos: [] };
  }
}

async function optimizeImages(images) {
  console.log('\n📸 Optimizing images...');
  
  for (const image of images) {
    const inputPath = path.join(GALLERY_DIR, image);
    const outputPath = path.join(OPTIMIZED_DIR, image);
    
    try {
      // Check if optimized version already exists
      try {
        await fs.access(outputPath);
        console.log(`✓ ${image} already optimized`);
        continue;
      } catch {
        // File doesn't exist, proceed with optimization
      }
      
      // For now, just copy the file (you can add sharp optimization here)
      await fs.copyFile(inputPath, outputPath);
      console.log(`✓ Copied ${image}`);
      
      // TODO: Add actual image optimization with sharp
      // const sharp = require('sharp');
      // await sharp(inputPath)
      //   .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      //   .jpeg({ quality: 80 })
      //   .toFile(outputPath);
      
    } catch (error) {
      console.error(`✗ Failed to optimize ${image}:`, error.message);
    }
  }
}

async function generateVideoThumbnails(videos) {
  console.log('\n🎬 Generating video thumbnails...');
  
  for (const video of videos) {
    const videoPath = path.join(GALLERY_DIR, video);
    const thumbnailName = video.replace(/\.(mp4|webm|ogg|mov|avi)$/i, '.jpg');
    const thumbnailPath = path.join(GALLERY_DIR, thumbnailName);
    
    try {
      // Check if thumbnail already exists
      try {
        await fs.access(thumbnailPath);
        console.log(`✓ ${thumbnailName} already exists`);
        continue;
      } catch {
        // Thumbnail doesn't exist, generate it
      }
      
      console.log(`📹 Generating thumbnail for ${video}...`);
      
      // TODO: Add ffmpeg thumbnail generation
      // For now, create a placeholder
      console.log(`⚠️  Manual thumbnail generation needed for ${video}`);
      console.log(`   Run: ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${thumbnailPath}"`);
      
    } catch (error) {
      console.error(`✗ Failed to generate thumbnail for ${video}:`, error.message);
    }
  }
}

async function checkVideoFormats(videos) {
  console.log('\n🎥 Checking video formats...');
  
  for (const video of videos) {
    const videoPath = path.join(GALLERY_DIR, video);
    const webmName = video.replace(/\.(mp4|mov|avi)$/i, '.webm');
    const webmPath = path.join(GALLERY_DIR, webmName);
    
    if (video.endsWith('.mp4')) {
      try {
        await fs.access(webmPath);
        console.log(`✓ ${webmName} exists`);
      } catch {
        console.log(`⚠️  WebM version missing for ${video}`);
        console.log(`   Run: ffmpeg -i "${videoPath}" -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus "${webmPath}"`);
      }
    }
  }
}

async function generateManifest(images, videos) {
  console.log('\n📋 Generating media manifest...');
  
  const manifest = {
    generated: new Date().toISOString(),
    images: images.map(img => ({
      filename: img,
      path: `/gallery/${img}`,
      optimized: `/gallery/optimized/${img}`,
      type: 'image'
    })),
    videos: videos.map(vid => {
      const thumbnailName = vid.replace(/\.(mp4|webm|ogg|mov|avi)$/i, '.jpg');
      return {
        filename: vid,
        path: `/gallery/${vid}`,
        thumbnail: `/gallery/${thumbnailName}`,
        type: 'video'
      };
    })
  };
  
  const manifestPath = path.join(GALLERY_DIR, 'manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✓ Generated manifest.json with ${images.length} images and ${videos.length} videos`);
}

async function main() {
  console.log('🚀 Starting media optimization...');
  
  try {
    await ensureDirectoryExists(OPTIMIZED_DIR);
    
    const { images, videos } = await getMediaFiles();
    
    if (images.length === 0 && videos.length === 0) {
      console.log('📁 No media files found in gallery directory');
      return;
    }
    
    console.log(`Found ${images.length} images and ${videos.length} videos`);
    
    if (images.length > 0) {
      await optimizeImages(images);
    }
    
    if (videos.length > 0) {
      await generateVideoThumbnails(videos);
      await checkVideoFormats(videos);
    }
    
    await generateManifest(images, videos);
    
    console.log('\n✅ Media optimization complete!');
    console.log('\n💡 Tips for better performance:');
    console.log('   - Install ffmpeg for video thumbnail generation');
    console.log('   - Install sharp for image optimization: npm install sharp');
    console.log('   - Consider using a CDN for large media files');
    console.log('   - Compress videos before uploading');
    
  } catch (error) {
    console.error('❌ Error during media optimization:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, optimizeImages, generateVideoThumbnails, checkVideoFormats };
