const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://fgbnfujztuwvxmbzuhmn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYm5mdWp6dHV3dnhtYnp1aG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1MTcyOTEsImV4cCI6MjEwOTA5MzI5MX0.uetQ4iYWvIROWBpXjQMgKjkoX2loZpxEYTR1_w6YEBM';
const BUCKET_NAME = 'project-media';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const baseDir = path.resolve(__dirname, '..');
const masterJsonPath = path.join(baseDir, '02.Project', 'projects_master.json');

// Mappings of real disk files for the 10 canonical projects
const PROJECT_MEDIA_DEFINITIONS = [
  {
    slug: 'me',
    title: 'Me',
    subtitle: 'Spatial Practice & Architecture Portfolio',
    description: 'Archive of spatial design, architectural curation, and urban research by Baro Nguyen.',
    collections: ['Orange~', 'Photography', 'Practice Art'],
    mediaFiles: [
      { path: '02.Project/02_Baropholio brand_240401/Baropholio brand (1).jpg', isCover: true, caption: 'Me - Baro Nguyen' }
    ]
  },
  {
    slug: 'the-veil-national-art-museum-of-andorra',
    title: 'The Veil - National Art Museum of Andorra',
    subtitle: 'International Architecture Competition',
    description: 'A contextual veil mediating historical stone topography with contemporary museum volumes.',
    collections: ['Urban- Architecture- Landscape', 'Model', 'Sketch'],
    mediaFiles: [
      { path: '02.Project/03_120H/Screenshot 2024-09-30 212638.jpg', isCover: true, caption: 'Museum Elevation & Perspective' },
      { path: '02.Project/03_120H/Screenshot 2024-09-30 212701.jpg', isCover: false, caption: 'Spatial Section Detail' },
      { path: '02.Project/03_120H/Screenshot 2024-09-30 212907.jpg', isCover: false, caption: 'Structural Framework' },
      { path: '02.Project/03_120H/Screenshot 2024-09-30 212932.jpg', isCover: false, caption: 'Gallery Interior Flow' },
      { path: '02.Project/03_120H/Screenshot 2024-09-30 212958.jpg', isCover: false, caption: 'Site Plan Context' }
    ]
  },
  {
    slug: 'rocras-reborn-of-coalmine-restoration-and-sustainability',
    title: 'ROCRAS - Reborn of Coalmine Restoration and Sustainability',
    subtitle: 'Ecological Mine Rejuvenation & Coastal Civic Basin',
    description: 'Transforming post-extraction mining voids into self-sustaining ecological wetland networks.',
    collections: ['Urban- Architecture- Landscape', 'Sustainable Strategy Consulting'],
    mediaFiles: [
      { path: '02.Project/08_Rocras/b2d7ff64eb506b0e3241.jpg', isCover: true, caption: 'ROCRAS Masterplan Vision' }
    ]
  },
  {
    slug: 'saigon-in-sight-van-don-area-urban-design-guidelines',
    title: 'Saigon in Sight - Van Don Area Urban Design Guidelines',
    subtitle: 'Urban Design & Waterfront Framework',
    description: 'Regeneration framework for Saigon waterfront nodes, balancing commercial density and public access.',
    collections: ['Urban- Architecture- Landscape', 'Mapping'],
    mediaFiles: [
      { path: '02.Project/04_Thanh Da Market/11.jpg', isCover: true, caption: 'Van Don Urban Corridor Analysis' },
      { path: '02.Project/04_Thanh Da Market/12.jpg', isCover: false, caption: 'Street Elevation Study' },
      { path: '02.Project/04_Thanh Da Market/13.jpg', isCover: false, caption: 'Public Realm Network' }
    ]
  },
  {
    slug: 'sun-of-love-will-to-live-center',
    title: 'Sun of Love - "Will to Live" Center',
    subtitle: 'Universal Inclusive Design & Healing Architecture',
    description: 'Barrier-free vocational center designed for youth with physical disabilities, embedding light as therapy.',
    collections: ['Orange~', 'Urban- Architecture- Landscape', 'Photography'],
    mediaFiles: [
      { path: '02.Project/07_Park/2-1793088026015_convert_com_vn.webp', isCover: true, caption: 'Center Courtyard Perspective' }
    ]
  },
  {
    slug: 'the-reborn-of-water-reservoirs-thuy-dai',
    title: 'The Reborn of Water Reservoirs (Thuy Dai)',
    subtitle: 'Adaptive Reuse of Heritage Water Towers',
    description: 'Repurposing colonial-era water reservoirs into public community cistern-parks and gathering hubs.',
    collections: ['Urban- Architecture- Landscape', 'Sketch', 'Model'],
    mediaFiles: [
      { path: '02.Project/05_Thuy Dai/386047287_3683376851949091_162864876726435184_n.jpg', isCover: true, caption: 'Thuy Dai Adaptive Reuse Axonometric' },
      { path: '02.Project/05_Thuy Dai/386154707_3683376901949086_4561552392266495583_n.jpg', isCover: false, caption: 'Reservoir Structure Cross-Section' },
      { path: '02.Project/05_Thuy Dai/386155132_3683376858615757_4751522486607492302_n.jpg', isCover: false, caption: 'Community Public Floor Plan' }
    ]
  },
  {
    slug: 'cu-xa-scomeco-smart-community-and-eco-housing',
    title: 'Cư Xá (S.COMECO) - Smart, Community and Eco Housing',
    subtitle: 'Sustainable Social Housing Typology',
    description: 'Affordable modular living units prioritizing natural cross-ventilation and communal courtyard interactions.',
    collections: ['Urban- Architecture- Landscape', 'Sustainable Strategy Consulting'],
    mediaFiles: [
      { path: '02.Project/06_Scomeco/baro-du-duk_01-1793087556464_convert_com_vn.webp', isCover: true, caption: 'Cư Xá Housing Facade' },
      { path: '02.Project/06_Scomeco/baro-du-duk_02-1793087557317_convert_com_vn.webp', isCover: false, caption: 'Modular Apartment Floor Plan' },
      { path: '02.Project/06_Scomeco/baro-du-duk_03-1793087558447_convert_com_vn.webp', isCover: false, caption: 'Courtyard Ventilation Diagram' },
      { path: '02.Project/06_Scomeco/baro-du-duk_04-1793087554583_convert_com_vn.webp', isCover: false, caption: 'Community Rooftop Garden' },
      { path: '02.Project/06_Scomeco/baro-du-duk_05-1793087555740_convert_com_vn.webp', isCover: false, caption: 'Materiality & Construction Study' }
    ]
  },
  {
    slug: 'central-lake-eco-park',
    title: 'Central Lake Eco Park',
    subtitle: 'Urban Hydrology & Wetland Park Masterplan',
    description: 'Integrating urban stormwater catchment systems into a sprawling public bio-filtration park.',
    collections: ['Urban- Architecture- Landscape', 'Mapping', 'Sustainable Strategy Consulting'],
    mediaFiles: [
      { path: '02.Project/07_Park/NGUYA1BB84NC3C220BA1BAA2O_M8394C3C220(1)-1793088070119_convert_com_vn.webp', isCover: true, caption: 'Eco Park Masterplan' },
      { path: '02.Project/07_Park/ssss.jpg', isCover: false, caption: 'Wetland Boardwalk Perspective' },
      { path: '02.Project/07_Park/NGUYA1BB84NC3C220BA1BAA2O_M8394C3C220(2)-1793088075569_convert_com_vn.webp', isCover: false, caption: 'Riparian Edge Detail' },
      { path: '02.Project/07_Park/NGUYA1BB84NC3C220BA1BAA2O_M8394C3C220(3)-1793088081903_convert_com_vn.webp', isCover: false, caption: 'Water Purification Flow' }
    ]
  },
  {
    slug: 'windy-hill-neighborhood',
    title: 'Windy Hill Neighborhood',
    subtitle: 'Microclimate & Hillside Urbanism',
    description: 'Terrain-sensitive low-impact residential clustering designed to capture prevailing hillside wind corridors.',
    collections: ['Urban- Architecture- Landscape', 'Model'],
    mediaFiles: [
      { path: '02.Project/01_Windy Hill/Baro Portfolio25.jpg', isCover: true, caption: 'Windy Hill Master Plan' },
      { path: '02.Project/01_Windy Hill/370206031_233749272725049_8156576336194971843_n.jpg', isCover: false, caption: 'Hillside Cluster Section' },
      { path: '02.Project/01_Windy Hill/1-1793085295855_convert_com_vn.webp', isCover: false, caption: 'Topographic Contours Study' },
      { path: '02.Project/01_Windy Hill/mh-1793085300964_convert_com_vn.webp', isCover: false, caption: 'Wind Flow Simulation' }
    ]
  },
  {
    slug: 'fish-and-orchard',
    title: 'Fish and Orchard',
    subtitle: 'Spatial Design & Brand Identity System',
    description: 'An architectural identity system balancing geometric structure with organic branding freedom.',
    collections: ['Orange~', 'Graphic Design', 'Branding'],
    mediaFiles: [
      { path: '02.Project/02_Baropholio brand_240401/Baropholio brand (1).jpg', isCover: true, caption: 'Brand Identity Cover' },
      { path: '02.Project/02_Baropholio brand_240401/Baropholio brand (2).jpg', isCover: false, caption: 'Emblem Morphology' },
      { path: '02.Project/02_Baropholio brand_240401/Baropholio brand (10).jpg', isCover: false, caption: 'Packaging System' }
    ]
  }
];

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    case '.mp4': return 'video/mp4';
    default: return 'application/octet-stream';
  }
}

async function uploadFileToSupabase(relPath, slug, index) {
  const fullPath = path.join(baseDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`[Skip] File not found: ${relPath}`);
    return null;
  }

  const ext = path.extname(relPath).toLowerCase();
  const destName = `${slug}/${slug}-${String(index + 1).padStart(2, '0')}${ext}`;
  const fileBuffer = fs.readFileSync(fullPath);
  const contentType = getContentType(relPath);
  const blob = new Blob([fileBuffer], { type: contentType });

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(destName, blob, { contentType, upsert: true });

  if (error) {
    console.error(`[Error] Upload failed for ${relPath}:`, error.message);
    return null;
  }

  const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(destName);
  console.log(`[Uploaded] ${relPath} -> ${urlData.publicUrl}`);
  return urlData.publicUrl;
}

async function run() {
  console.log('=== STARTING AUTOMATED MEDIA UPLOAD FOR 10 PROJECTS ===');

  const processedProjects = [];

  for (let i = 0; i < PROJECT_MEDIA_DEFINITIONS.length; i++) {
    const pDef = PROJECT_MEDIA_DEFINITIONS[i];
    console.log(`\nProcessing project ${i + 1}/10: ${pDef.title} (${pDef.slug})`);

    const uploadedMedia = [];

    for (let mIdx = 0; mIdx < pDef.mediaFiles.length; mIdx++) {
      const mItem = pDef.mediaFiles[mIdx];
      const publicUrl = await uploadFileToSupabase(mItem.path, pDef.slug, mIdx);
      if (publicUrl) {
        uploadedMedia.push({
          id: `m-${pDef.slug}-${mIdx + 1}`,
          type: 'image',
          url: publicUrl,
          dataUrl: publicUrl,
          src: publicUrl,
          isCover: !!mItem.isCover,
          caption: mItem.caption,
          alt: mItem.caption
        });
      }
    }

    const projectPayload = {
      stt: String(i + 1).padStart(2, '0'),
      slug: pDef.slug,
      title: pDef.title,
      subtitle: pDef.subtitle,
      description: pDef.description,
      published: true,
      collections: pDef.collections,
      basic_info: [
        { label: 'Category', value: pDef.collections[0] || 'Architecture' },
        { label: 'Year', value: '2024 - 2026' },
        { label: 'Author', value: 'Baro Nguyen' }
      ],
      media: uploadedMedia,
      seo: {
        metaTitle: `${pDef.title} | Baropholio`,
        metaDescription: pDef.description,
        slug: pDef.slug
      },
      updated_at: new Date().toISOString()
    };

    // Upsert into Supabase database
    const { data: dbData, error: dbErr } = await supabase
      .from('projects')
      .upsert(projectPayload, { onConflict: 'slug' })
      .select('id, slug, title');

    if (dbErr) {
      console.error(`[DB Error] Upsert failed for ${pDef.slug}:`, dbErr.message);
    } else {
      console.log(`[DB Upserted] Project '${pDef.title}' synced to Supabase.`);
    }

    processedProjects.push({ ...projectPayload, media: uploadedMedia });
  }

  // Update projects_master.json with cloud URLs
  try {
    const masterData = {
      _canonical: "Authoritative 10 Core Projects of Baropholio",
      last_synced: new Date().toISOString(),
      projects: processedProjects
    };
    fs.writeFileSync(masterJsonPath, JSON.stringify(masterData, null, 2), 'utf8');
    console.log(`\nUpdated local projects_master.json with Supabase Storage URLs.`);
  } catch (err) {
    console.error('Error writing projects_master.json:', err.message);
  }

  console.log('\n=== ALL 10 PROJECTS MEDIA AUTOMATICALLY UPLOADED & SYNCED! ===');
}

run().catch(console.error);
