const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createFavicons() {
  const rootDir = path.resolve(__dirname, '..');
  const src = path.join(rootDir, '01.Logo', 'Baropholio logo2-01.png');

  console.log('Source logo:', src);

  // 1. Generate PNG sizes
  const p16 = await sharp(src).resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const p32 = await sharp(src).resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const p48 = await sharp(src).resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const p180 = await sharp(src).resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const p512 = await sharp(src).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

  fs.writeFileSync(path.join(rootDir, 'favicon-16x16.png'), p16);
  fs.writeFileSync(path.join(rootDir, 'favicon-32x32.png'), p32);
  fs.writeFileSync(path.join(rootDir, 'favicon-48x48.png'), p48);
  fs.writeFileSync(path.join(rootDir, 'apple-touch-icon.png'), p180);
  fs.writeFileSync(path.join(rootDir, 'favicon.png'), p512);
  console.log('PNG favicons generated.');

  // 2. Build multi-res ICO containing 16x16, 32x32, 48x48
  const images = [
    { width: 16, height: 16, data: p16 },
    { width: 32, height: 32, data: p32 },
    { width: 48, height: 48, data: p48 }
  ];

  const headerLen = 6;
  const dirEntryLen = 16;
  const numImages = images.length;
  let offset = headerLen + dirEntryLen * numImages;

  const header = Buffer.alloc(headerLen);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO format
  header.writeUInt16LE(numImages, 4); // count

  const entries = [];
  const datas = [];

  for (const img of images) {
    const entry = Buffer.alloc(dirEntryLen);
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.data.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    datas.push(img.data);
    offset += img.data.length;
  }

  const icoBuffer = Buffer.concat([header, ...entries, ...datas]);
  fs.writeFileSync(path.join(rootDir, 'favicon.ico'), icoBuffer);
  console.log('favicon.ico generated, size:', icoBuffer.length);

  // 3. SVG favicon embedding the logo
  const p128Base64 = (await sharp(src).resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()).toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <image href="data:image/png;base64,${p128Base64}" width="128" height="128" />
</svg>
`;
  fs.writeFileSync(path.join(rootDir, 'favicon.svg'), svgContent, 'utf8');
  console.log('favicon.svg updated with logo data.');
}

createFavicons().then(() => {
  console.log('Favicon build completed successfully.');
}).catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});

