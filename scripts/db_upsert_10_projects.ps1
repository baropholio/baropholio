$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYm5mdWp6dHV3dnhtYnp1aG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1MTcyOTEsImV4cCI6MjEwOTA5MzI5MX0.uetQ4iYWvIROWBpXjQMgKjkoX2loZpxEYTR1_w6YEBM"
$supabaseUrl = "https://fgbnfujztuwvxmbzuhmn.supabase.co"
$bucket = "project-media"

$projectsDef = @(
  @{
    stt = "10"
    slug = "me"
    title = "Me"
    subtitle = "Spatial Practice & Architecture Portfolio"
    description = "Archive of spatial design, architectural curation, and urban research by Baro Nguyen."
    collections = @("Orange~", "Photography", "Practice Art")
    mediaFiles = @(
      @{ file = "me-01.jpg"; isCover = $true; caption = "Me - Baro Nguyen" }
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
      @{ file = "the-veil-national-art-museum-of-andorra-01.jpg"; isCover = $true; caption = "Museum Elevation & Perspective" },
      @{ file = "the-veil-national-art-museum-of-andorra-02.jpg"; isCover = $false; caption = "Spatial Section Detail" },
      @{ file = "the-veil-national-art-museum-of-andorra-03.jpg"; isCover = $false; caption = "Structural Framework" },
      @{ file = "the-veil-national-art-museum-of-andorra-04.jpg"; isCover = $false; caption = "Gallery Interior Flow" },
      @{ file = "the-veil-national-art-museum-of-andorra-05.jpg"; isCover = $false; caption = "Site Plan Context" }
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
      @{ file = "rocras-reborn-of-coalmine-restoration-and-sustainability-01.jpg"; isCover = $true; caption = "ROCRAS Masterplan Vision" }
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
      @{ file = "saigon-in-sight-van-don-area-urban-design-guidelines-01.jpg"; isCover = $true; caption = "Van Don Urban Corridor Analysis" },
      @{ file = "saigon-in-sight-van-don-area-urban-design-guidelines-02.jpg"; isCover = $false; caption = "Street Elevation Study" },
      @{ file = "saigon-in-sight-van-don-area-urban-design-guidelines-03.jpg"; isCover = $false; caption = "Public Realm Network" }
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
      @{ file = "sun-of-love-will-to-live-center-01.webp"; isCover = $true; caption = "Center Courtyard Perspective" }
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
      @{ file = "the-reborn-of-water-reservoirs-thuy-dai-01.jpg"; isCover = $true; caption = "Thuy Dai Axonometric" },
      @{ file = "the-reborn-of-water-reservoirs-thuy-dai-02.jpg"; isCover = $false; caption = "Structure Cross-Section" },
      @{ file = "the-reborn-of-water-reservoirs-thuy-dai-03.jpg"; isCover = $false; caption = "Public Floor Plan" }
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
      @{ file = "cu-xa-scomeco-smart-community-and-eco-housing-01.webp"; isCover = $true; caption = "Cư Xá Housing Facade" },
      @{ file = "cu-xa-scomeco-smart-community-and-eco-housing-02.webp"; isCover = $false; caption = "Apartment Floor Plan" },
      @{ file = "cu-xa-scomeco-smart-community-and-eco-housing-03.webp"; isCover = $false; caption = "Courtyard Ventilation Diagram" },
      @{ file = "cu-xa-scomeco-smart-community-and-eco-housing-04.webp"; isCover = $false; caption = "Community Rooftop Garden" },
      @{ file = "cu-xa-scomeco-smart-community-and-eco-housing-05.webp"; isCover = $false; caption = "Construction Detail" }
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
      @{ file = "central-lake-eco-park-01.webp"; isCover = $true; caption = "Eco Park Masterplan" },
      @{ file = "central-lake-eco-park-02.jpg"; isCover = $false; caption = "Wetland Boardwalk Perspective" },
      @{ file = "central-lake-eco-park-03.webp"; isCover = $false; caption = "Riparian Edge Detail" },
      @{ file = "central-lake-eco-park-04.webp"; isCover = $false; caption = "Water Purification Flow" }
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
      @{ file = "windy-hill-neighborhood-01.jpg"; isCover = $true; caption = "Windy Hill Master Plan" },
      @{ file = "windy-hill-neighborhood-02.jpg"; isCover = $false; caption = "Hillside Cluster Section" },
      @{ file = "windy-hill-neighborhood-03.webp"; isCover = $false; caption = "Topographic Contours Study" },
      @{ file = "windy-hill-neighborhood-04.webp"; isCover = $false; caption = "Wind Flow Simulation" }
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
      @{ file = "fish-and-orchard-01.jpg"; isCover = $true; caption = "Brand Identity Cover" },
      @{ file = "fish-and-orchard-02.jpg"; isCover = $false; caption = "Emblem Morphology" },
      @{ file = "fish-and-orchard-03.jpg"; isCover = $false; caption = "Packaging System" }
    )
  }
)

$processed = @()

foreach ($p in $projectsDef) {
  $mediaList = @()
  $idx = 1
  foreach ($m in $p.mediaFiles) {
    $storagePath = "$($p.slug)/$($m.file)"
    $publicUrl = "$supabaseUrl/storage/v1/object/public/$bucket/$storagePath"
    $mediaList += @{
      id = "m-$($p.slug)-$idx"
      type = "image"
      url = $publicUrl
      dataUrl = $publicUrl
      src = $publicUrl
      isCover = $m.isCover
      caption = $m.caption
      alt = $m.caption
    }
    $idx++
  }

  $payload = @{
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
    media = $mediaList
    seo = @{
      metaTitle = "$($p.title) | Baropholio"
      metaDescription = $p.description
      slug = $p.slug
    }
    updated_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
  }

  $upsertHeaders = @{
    "apikey" = $anonKey
    "Authorization" = "Bearer $anonKey"
    "Content-Type" = "application/json"
    "Prefer" = "resolution=merge-duplicates"
  }

  $bodyJson = $payload | ConvertTo-Json -Depth 5
  try {
    # Notice: ?on_conflict=slug ensures merge on conflict
    Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/projects?on_conflict=slug" -Headers $upsertHeaders -Method POST -Body $bodyJson | Out-Null
    Write-Host "[OK] Synced DB for: $($p.title)"
  } catch {
    Write-Host "[ERR] DB sync for $($p.title): $($_.Exception.Message)"
  }

  $processed += $payload
}

# Write master json
$masterJsonPath = "e:\WORK\Baropholio web\02.Project\projects_master.json"
$masterData = @{
  _canonical = "Authoritative 10 Core Projects of Baropholio"
  last_synced = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
  projects = $processed
}
$masterData | ConvertTo-Json -Depth 6 | Set-Content -Path $masterJsonPath -Encoding UTF8
Write-Host "Updated projects_master.json successfully!"

