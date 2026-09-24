param(
  [string]$BaseUrl = "https://www.teklimakan.com"
)

$rootDir = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $rootDir "p"
$imgDir = Join-Path $rootDir "images\products"

if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
if (-not (Test-Path $imgDir)) { New-Item -ItemType Directory -Path $imgDir -Force | Out-Null }

$sbFile = Join-Path $rootDir "js\supabase.js"
$anonKey = (Get-Content $sbFile | Select-String -Pattern "anonKey:\s*'([^']+)'").Matches.Groups[1].Value

Write-Host "🔄 Supabase بۇلۇت ئامبىرىدىن ئەڭ يېڭى ھەقىقىي مەھسۇلاتلار ئېلىنماقتا..."
$products = Invoke-RestMethod -Uri "https://hvvxnnnpukgpmwexcniq.supabase.co/rest/v1/products?select=*" -Headers @{ "apikey" = $anonKey; "Authorization" = "Bearer $anonKey" }

Write-Host "📦 جەمئىي $($products.Count) دانە مەھسۇلات ئوقۇلدى..."

$generatedCount = 0

foreach ($p in $products) {
  $id = $p.id
  $name = $p.name
  if ($p.translations -and $p.translations.ug -and $p.translations.ug.name) {
    $name = $p.translations.ug.name
  }
  $price = $p.price
  $desc = if ($p.description) { $p.description } else { "" }
  if ($p.translations -and $p.translations.ug -and $p.translations.ug.description) {
    $desc = $p.translations.ug.description
  }

  $imgUrl = ""
  if ($p.image -match "^data:image/([a-zA-Z]+);base64,(.+)$") {
    $ext = $matches[1]
    if ($ext -eq "jpeg") { $ext = "jpg" }
    $base64 = $matches[2]
    $bytes = [System.Convert]::FromBase64String($base64)
    $localImgFile = Join-Path $imgDir "$id.$ext"
    [System.IO.File]::WriteAllBytes($localImgFile, $bytes)
    $imgUrl = "$BaseUrl/images/products/$id.$ext"
  } elseif ($p.image -match "^https?://") {
    $imgUrl = $p.image
  } elseif ($p.image) {
    $cleanPath = $p.image.TrimStart("/\").Replace("\", "/")
    $imgUrl = "$BaseUrl/$cleanPath"
  } else {
    $imgUrl = "$BaseUrl/images/og-share-cover.jpg"
  }

  $safeName = $name.Replace('"', '&quot;').Trim()
  $safeDesc = $desc.Replace('"', '&quot;').Replace("'", '&#39;').Trim()
  if ($safeDesc.Length -gt 160) {
    $safeDesc = $safeDesc.Substring(0, 157) + "..."
  }

  $htmlContent = @"
<!DOCTYPE html>
<html lang="ug" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$safeName — تەكلىماكان سودا تورى</title>
  
  <!-- 🌐 مەھسۇلات رەسمىي Open Graph ۋە Twitter Cards بەلگىسى (WhatsApp، Telegram، Facebook) -->
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="تەكلىماكان سودا تورى">
  <meta property="og:title" content="$safeName — تەكلىماكان">
  <meta property="og:description" content="باھاسى: $price ₺ | $safeDesc">
  <meta property="og:image" content="$imgUrl">
  <meta property="og:image:secure_url" content="$imgUrl">
  <meta property="og:url" content="$BaseUrl/p/$id.html">
  
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="$safeName">
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
    <img src="$imgUrl" alt="$safeName" style="max-width: 100%; height: 260px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;">
    <h2 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">$safeName</h2>
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

Write-Host "✅ مۇۋەپپەقىيەتلىك ھالدا $generatedCount دانە مەھسۇلات Supabase تىن ئوقۇلۇپ p/ بەتلىرى يېڭىلاندى!"
