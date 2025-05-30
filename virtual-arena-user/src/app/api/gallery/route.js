import fs from 'fs'
import path from 'path'

export async function GET() {
  const galleryDir = path.join(process.cwd(), 'public/gallery')
  const files = fs.readdirSync(galleryDir)

  const images = files.filter(file => /\.(jpe?g|png|webp)$/i.test(file))
  const videos = files.filter(file => /\.(mp4|webm|ogg)$/i.test(file))

  return Response.json({ images, videos })
}
