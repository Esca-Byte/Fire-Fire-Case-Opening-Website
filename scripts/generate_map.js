import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(process.cwd(), 'public/assets/images/images');
const outputFile = path.join(process.cwd(), 'public/assets/imageMap.json');

const imageMap = {};

function scanDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else {
            const ext = path.extname(file);
            if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext.toLowerCase())) {
                const itemID = path.basename(file, ext);
                // Create relative path from public/assets/images/images
                // We want the path to be used in src, so it should be relative to public or absolute from root
                // The components use /assets/images/images/...

                const relativePath = path.relative(path.join(process.cwd(), 'public'), fullPath).replace(/\\/g, '/');
                imageMap[itemID] = '/' + relativePath;
            }
        }
    });
}

if (!fs.existsSync(imagesDir)) {
    console.error(`Directory not found: ${imagesDir}`);
    process.exit(1);
}

console.log('Scanning images...');
scanDir(imagesDir);

fs.writeFileSync(outputFile, JSON.stringify(imageMap, null, 2));
console.log(`Generated image map with ${Object.keys(imageMap).length} items at ${outputFile}`);
