$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYm5mdWp6dHV3dnhtYnp1aG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1MTcyOTEsImV4cCI6MjEwOTA5MzI5MX0.uetQ4iYWvIROWBpXjQMgKjkoX2loZpxEYTR1_w6YEBM"
$supabaseUrl = "https://fgbnfujztuwvxmbzuhmn.supabase.co"
$bucket = "project-media"

$baseDir = "e:\WORK\Baropholio web"

$projectsDef = @(
  @{
    stt = "01"
    slug = "me"
    title = "Me"
    subtitle = "Spatial Practice & Architecture Portfolio"
    description = "Archive of spatial design, architectural curation, and urban research by Baro Nguyen."
    collections = @("Orange~", "Photography", "Practice Art")
    mediaFiles = @(
      @{ path = "02.Project/02_Baropholio brand_240401/Baropholio brand (1).jpg"; isCover = $true; caption = "Me - Baro Nguyen" }
    )
  },
  @{
    stt = "02"
    slug = "the-veil-national-art-museum-of-andorra"
    title = "The Veil - National Art Museum of Andorra"
    subtitle = "International Architecture Competition"
    description = "A contextual veil mediating historical stone topography with contemporary museum volumes."
    collections = @("Urban- Architecture- Landscape", "Model", "Sketch")
    mediaFiles = @(
      @{ path = "02.Project/03_120H/Screenshot 2024-09-30 212638.jpg"; isCover = $true; caption = "Museum Elevation & Perspective" },
      @{ path = "02.Project/03_120H/Screenshot 2024-09-30 212701.jpg"; isCover = $false; caption = "Spatial Section Detail" },
      @{ path = "02.Project/03_120H/Screenshot 2024-09-30 212907.jpg"; isCover = $false; caption = "Structural Framework" },
      @{ path = "02.Project/03_120H/Screenshot 2024-09-30 212932.jpg"; isCover = $false; caption = "Gallery Interior Flow" },
      @{ path = "02.Project/03_120H/Screenshot 2024-09-30 212958.jpg"; isCover = $false; caption = "Site Plan Context" }
    )
  },
  @{
    stt = "03"
    slug = "rocras-reborn-of-coalmine-restoration-and-sustainability"
    title = "ROCRAS - Reborn of Coalmine Restoration and Sustainability"
    subtitle = "Ecological Mine Rejuvenation & Coastal Civic Basin"
    description = "Transforming post-extraction mining voids into self-sustaining ecological wetland networks."
    collections = @("Urban- Architecture- Landscape", "Sustainable Strategy Consulting")
    mediaFiles = @(
      @{ path = "02.Project/08_Rocras/b2d7ff64eb506b0e3241.jpg"; isCover = $true; caption = "ROCRAS Masterplan Vision" }
    )
  },
  @{
    stt = "04"
    slug = "saigon-in-sight-van-don-area-urban-design-guidelines"
    title = "Saigon in Sight - Van Don Area Urban Design Guidelines"
    subtitle = "Urban Design & Waterfront Framework"
    description = "Regeneration framework for Saigon waterfront nodes, balancing commercial density and public access."
    collections = @("Urban- Architecture- Landscape", "Mapping")
    mediaFiles = @(
      @{ path = "02.Project/04_Thanh Da Market/11.jpg"; isCover = $true; caption = "Van Don Urban Corridor Analysis" },
      @{ path = "02.Project/04_Thanh Da Market/12.jpg"; isCover = $false; caption = "Street Elevation Study" },
      @{ path = "02.Project/04_Thanh Da Market/13.jpg"; isCover = $false; caption = "Public Realm Network" }
    )
  },
  @{
    stt = "05"
    slug = "sun-of-love-will-to-live-center"
    title = "Sun of Love - `"Will to Live`" Center"
    subtitle = "Universal Inclusive Design & Healing Architecture"
    description = "Barrier-free vocational center designed for youth with physical disabilities, embedding light as therapy."
    collections = @("Orange~", "Urban- Architecture- Landscape", "Photography")
    mediaFiles = @(
      @{ path = "02.Project/07_Park/2-1793088026015_convert_com_vn.webp"; isCover = $true; caption = "Center Courtyard Perspective" }
    )
  },
  @{
    stt = "06"
    slug = "the-reborn-of-water-reservoirs-thuy-dai"
    title = "The Reborn of Water Reservoirs (Thuy Dai)"
    subtitle = "Adaptive Reuse of Heritage Water Towers"
    description = "Repurposing colonial-era water reservoirs into public community cistern-parks and gathering hubs."
    collections = @("Urban- Architecture- Landscape", "Sketch", "Model")
    mediaFiles = @(
      @{ path = "02.Project/05_Thuy Dai/386047287_3683376851949091_162864876726435184_n.jpg"; isCover = $true; caption = "Thuy Dai Axonometric" },
      @{ path = "02.Project/05_Thuy Dai/386154707_3683376901949086_4561552392266495583_n.jpg"; isCover = $false; caption = "Structure Cross-Section" },
      @{ path = "02.Project/05_Thuy Dai/386155132_3683376858615757_4751522486607492302_n.jpg"; isCover = $false; caption = "Public Floor Plan" }
    )
  },
  @{
    stt = "07"
    slug = "cu-xa-scomeco-smart-community-and-eco-housing"
    title = "Cư Xá (S.COMECO) - Smart, Community and Eco Housing"
    subtitle = "Sustainable Social Housing Typology"
    description = "Affordable modular living units prioritizing natural cross-ventilation and communal courtyard interactions."
    collections = @("Urban- Architecture- Landscape", "Sustainable Strategy Consulting")
    mediaFiles = @(
      @{ path = "02.Project/06_Scomeco/baro-du-duk_01-1793087556464_convert_com_vn.webp"; isCover = $true; caption = "Cư Xá Housing Facade" },
      @{ path = "02.Project/06_Scomeco/baro-du-duk_02-1793087557317_convert_com_vn.webp"; isCover = $false; caption = "Apartment Floor Plan" },
      @{ path = "02.Project/06_Scomeco/baro-du-duk_03-1793087558447_convert_com_vn.webp"; isCover = $false; caption = "Courtyard Ventilation Diagram" },
      @{ path = "02.Project/06_Scomeco/baro-du-duk_04-1793087554583_convert_com_vn.webp"; isCover = $false; caption = "Community Rooftop Garden" },
      @{ path = "02.Project/06_Scomeco/baro-du-duk_05-1793087555740_convert_com_vn.webp"; isCover = $false; caption = "Construction Detail" }
    )
  },
  @{
    stt = "08"
    slug = "central-lake-eco-park"
    title = "Central Lake Eco Park"
    subtitle = "Urban Hydrology & Wetland Park Masterplan"
    description = "Integrating urban stormwater catchment systems into a sprawling public bio-filtration park."
    collections = @("Urban- Architecture- Landscape", "Mapping", "Sustainable Strategy Consulting")
    mediaFiles = @(
      @{ path = "02.Project/07_Park/NGUYA1BB84NC3C220BA1BAA2O_M8394C3C220(1)-1793088070119_convert_com_vn.webp"; isCover = $true; caption = "Eco Park Masterplan" },
      @{ path = "02.Project/07_Park/ssss.jpg"; isCover = $false; caption = "Wetland Boardwalk Perspective" },
      @{ path = "02.Project/07_Park/NGUYA1BB84NC3C220BA1BAA2O_M8394C3C220(2)-1793088075569_convert_com_vn.webp"; isCover = $false; caption = "Riparian Edge Detail" },
      @{ path = "02.Project/07_Park/NGUYA1BB84NC3C220BA1BAA2O_M8394C3C220(3)-1793088081903_convert_com_vn.webp"; isCover = $false; caption = "Water Purification Flow" }
    )
  },
  @{
    stt = "09"
    slug = "windy-hill-neighborhood"
    title = "Windy Hill Neighborhood"
    subtitle = "Microclimate & Hillside Urbanism"
    description = "Terrain-sensitive low-impact residential clustering designed to capture prevailing hillside wind corridors."
    collections = @("Urban- Architecture- Landscape", "Model")
    mediaFiles = @(
      @{ path = "02.Project/01_Windy Hill/Baro Portfolio25.jpg"; isCover = $true; caption = "Windy Hill Master Plan" },
      @{ path = "02.Project/01_Windy Hill/370206031_233749272725049_8156576336194971843_n.jpg"; isCover = $false; caption = "Hillside Cluster Section" },
      @{ path = "02.Project/01_Windy Hill/1-1793085295855_convert_com_vn.webp"; isCover = $false; caption = "Topographic Contours Study" },
      @{ path = "02.Project/01_Windy Hill/mh-1793085300964_convert_com_vn.webp"; isCover = $false; caption = "Wind Flow Simulation" }
    )
  },
  @{
    stt = "10"
    slug = "fish-and-orchard"
    title = "Fish and Orchard"
    subtitle = "Spatial Design & Brand Identity System"
    description = "An architectural identity system balancing geometric structure with organic branding freedom."
    collections = @("Orange~", "Graphic Design", "Branding")
    mediaFiles = @(
      @{ path = "02.Project/02_Baropholio brand_240401/Baropholio brand (1).jpg"; isCover = $true; caption = "Brand Identity Cover" },
      @{ path = "02.Project/02_Baropholio brand_240401/Baropholio brand (2).jpg"; isCover = $false; caption = "Emblem Morphology" },
      @{ path = "02.Project/02_Baropholio brand_240401/Baropholio brand (10).jpg"; isCover = $false; caption = "Packaging System" }
    )
  }
)

function Get-ContentType($filename) {
  $ext = [System.IO.Path]::GetExtension($filename).ToLower()
  switch ($ext) {
    ".jpg"  { return "image/jpeg" }
    ".jpeg" { return "image/jpeg" }
    ".png"  { return "image/png" }
    ".webp" { return "image/webp" }
    ".gif"  { return "image/gif" }
    default { return "application/octet-stream" }
  }
}

$processedProjects = @()

Write-Host "=== AUTOMATING UPLOAD FOR 10 PROJECTS ==="

foreach ($p in $projectsDef) {
  Write-Host ""
  Write-Host "[$($p.stt)/10] Processing $($p.title)..."
  $uploadedMedia = @()
  $idx = 1

  foreach ($m in $p.mediaFiles) {
    $fullPath = Join-Path $baseDir $m.path
    if (Test-Path $fullPath) {
      $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
      $storagePath = "$($p.slug)/$($p.slug)-$([string]::Format('{0:D2}', $idx))$ext"
      $uploadUrl = "$supabaseUrl/storage/v1/object/$bucket/$storagePath"
      $cType = Get-ContentType $fullPath
      $headers = @{
        "apikey" = $anonKey
        "Authorization" = "Bearer $anonKey"
        "Content-Type" = $cType
        "x-upsert" = "true"
      }

      $bytes = [System.IO.File]::ReadAllBytes($fullPath)
      try {
        $res = Invoke-RestMethod -Uri $uploadUrl -Headers $headers -Method POST -Body $bytes
        $publicUrl = "$supabaseUrl/storage/v1/object/public/$bucket/$storagePath"
        Write-Host "   -> Uploaded: $storagePath ($cType)"
        $uploadedMedia += @{
          id = "m-$($p.slug)-$idx"
          type = "image"
          url = $publicUrl
          dataUrl = $publicUrl
          src = $publicUrl
          isCover = $m.isCover
          caption = $m.caption
          alt = $m.caption
        }
      } catch {
        Write-Host "   [ERR] Upload failed for $($m.path): $($_.Exception.Message)"
      }
      $idx++
    } else {
      Write-Host "   [SKIP] File not found: $($m.path)"
    }
  }

  # Build payload for Supabase projects table
  $projPayload = @{
    stt = $p.stt
    slug = $p.slug
    title = $p.title
    subtitle = $p.subtitle
    description = $p.description
    published = $true
    collections = $p.collections
    basic_info = @(
      @{ label = "Category"; value = $p.collections[0] },
      @{ label = "Year"; value = "2024 - 2026" },
      @{ label = "Author"; value = "Baro Nguyen" }
    )
    media = $uploadedMedia
    seo = @{
      metaTitle = "$($p.title) | Baropholio"
      metaDescription = $p.description
      slug = $p.slug
    }
    updated_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
  }

  # Upsert into Supabase REST API
  $upsertHeaders = @{
    "apikey" = $anonKey
    "Authorization" = "Bearer $anonKey"
    "Content-Type" = "application/json"
    "Prefer" = "resolution=merge-duplicates"
  }
  $bodyJson = $projPayload | ConvertTo-Json -Depth 5
  try {
    Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/projects" -Headers $upsertHeaders -Method POST -Body $bodyJson | Out-Null
    Write-Host "   -> Synced to Supabase database [OK]"
  } catch {
    Write-Host "   [ERR] DB Upsert error: $($_.Exception.Message)"
  }

  $processedProjects += $projPayload
}

# Update projects_master.json locally
$masterJsonPath = "e:\WORK\Baropholio web\02.Project\projects_master.json"
$masterData = @{
  _canonical = "Authoritative 10 Core Projects of Baropholio"
  last_synced = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
  projects = $processedProjects
}
$masterData | ConvertTo-Json -Depth 6 | Set-Content -Path $masterJsonPath -Encoding UTF8
Write-Host ""
Write-Host "Updated 02.Project/projects_master.json with all cloud URLs!"
Write-Host "=== AUTOMATION COMPLETE! ==="

