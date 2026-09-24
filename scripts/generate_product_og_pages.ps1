# ==============================================================================
# 🛍️ تەكلىماكان سودا سۇپىسى — مەھسۇلات ھەمبەھىرلەش بەتلىرىنى ھاسىللاش (Product OG Pages Generator)
# ==============================================================================

param(
  [string]$BaseUrl = "https://www.teklimakan.com"
)

$rootDir = Split-Path -Parent $PSScriptRoot
$storePath = Join-Path $rootDir "js\store.js"
$outDir = Join-Path $rootDir "p"

if (-not (Test-Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

if (-not (Test-Path $storePath)) {
  Write-Error "store.js tepilmidi: $storePath"
  exit 1
}

$raw = Get-Content $storePath -Raw -Encoding UTF8
$matches = [regex]::Matches($raw, "id:\s*'(PRD-[^']+)',[\s\S]*?name:\s*'([^']+)',[\s\S]*?price:\s*([0-9.]+),[\s\S]*?image:\s*'([^']+)',[\s\S]*?description:\s*'([^']+)'")

Write-Host "📦 جەمئىي $($matches.Count) دانە مەھسۇلات تېپىلدى..."

$generatedCount = 0

foreach ($m in $matches) {
  $id = $m.Groups[1].Value.Trim()
  $name = $m.Groups[2].Value.Trim()
  $price = $m.Groups[3].Value.Trim()
  $rawImg = $m.Groups[4].Value.Trim()
  $desc = $m.Groups[5].Value.Trim()

  $imgUrl = $rawImg
  if ($rawImg -notmatch "^https?://") {
    $cleanPath = $rawImg.TrimStart("/\").Replace("\", "/")
    $imgUrl = "$BaseUrl/$cleanPath"
  }

  $safeDesc = $desc.Replace('"', '&quot;').Replace("'", '&#39;')
  if ($safeDesc.Length -gt 160) {
    $safeDesc = $safeDesc.Substring(0, 157) + "..."
  }

  $htmlContent = @"
<!DOCTYPE html>
<html lang="ug" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$name — تەكلىماكان سودا تورى</title>
  
  <!-- 🌐 مەھسۇلات رەسمىي Open Graph ۋە Twitter Cards بەلگىسى (WhatsApp، Telegram، Facebook) -->
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="تەكلىماكان سودا تورى">
  <meta property="og:title" content="$name — تەكلىماكان">
  <meta property="og:description" content="باھاسى: $price ₺ | $safeDesc">
  <meta property="og:image" content="$imgUrl">
  <meta property="og:image:secure_url" content="$imgUrl">
  <meta property="og:url" content="$BaseUrl/p/$id.html">
  
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="$name">
  <meta name="twitter:description" content="باھاسى: $price ₺ | تەكلىماكان سودا تورى">
  <meta name="twitter:image" content="$imgUrl">

  <link rel="canonical" href="$BaseUrl/?id=$id">
  <meta http-equiv="refresh" content="0; url=/?id=$id">
  <script>
    window.location.replace('/?id=' + encodeURIComponent('$id'));
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 40px 20px; background: #f8fafc; color: #1e293b; direction: rtl;">
  <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
    <img src="$imgUrl" alt="$name" style="max-width: 100%; height: 260px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;">
    <h2 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">$name</h2>
    <p style="font-size: 1.35rem; font-weight: 900; color: #dc2626; margin-bottom: 16px;">$price ₺</p>
    <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">$safeDesc</p>
    <a href="/?id=$id" style="display: inline-block; background: #1e3a8a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 1rem;">سۇپىدا كۆرۈش ۋە سېتىۋېلىش</a>
  </div>
</body>
</html>
"@

  $filePath = Join-Path $outDir "$id.html"
  [System.IO.File]::WriteAllText($filePath, $htmlContent, [System.Text.Encoding]::UTF8)
  $generatedCount++
}

$indexContent = @"
<!DOCTYPE html>
<html lang="ug" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تەكلىماكان سودا تورى</title>
  <script>
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || params.get('product') || params.get('p');
    if (id) {
      window.location.replace('/?id=' + encodeURIComponent(id));
    } else {
      window.location.replace('/');
    }
  </script>
</head>
<body>
  <p>يۆتكىلىۋاتىدۇ...</p>
</body>
</html>
"@
[System.IO.File]::WriteAllText((Join-Path $outDir "index.html"), $indexContent, [System.Text.Encoding]::UTF8)

Write-Host "✅ مۇۋەپپەقىيەتلىك ھالدا $generatedCount دانە مەھسۇلات ھەمبەھىرلەش بېتى p/ مۇندەرىجىسىگە قۇرۇلدى!"
