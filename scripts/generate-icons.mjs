import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const source = join(root, 'assets', 'icon-source.svg')
const publicDir = join(root, '..', 'public')
const iconsDir = join(publicDir, 'icons')

mkdirSync(iconsDir, { recursive: true })

const targets = [
  { file: join(iconsDir, 'icon-192.png'), size: 192 },
  { file: join(iconsDir, 'icon-512.png'), size: 512 },
  { file: join(iconsDir, 'icon-maskable-512.png'), size: 512 },
  { file: join(publicDir, 'apple-touch-icon.png'), size: 180 },
  { file: join(publicDir, 'favicon-32.png'), size: 32 },
]

for (const target of targets) {
  await sharp(source).resize(target.size, target.size).png().toFile(target.file)
  console.log(`wrote ${target.file}`)
}
