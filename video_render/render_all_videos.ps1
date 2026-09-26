[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

$renderDir = "C:\Users\ThinkPad\Desktop\web\teklimakan\video_render"
$desktopDir = "C:\Users\ThinkPad\Desktop\تەكلىماكان"
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

Write-Host ">>> 1. Generating Scene HTML Templates..." -ForegroundColor Cyan

# Common CSS & Fonts
$cssBase = @"
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;600;700;800;900&family=Scheherazade+New:wght@600;700&display=swap');
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 0; width: 1920px; height: 1080px; overflow: hidden;
    background: radial-gradient(circle at center, #111a33 0%, #060913 100%);
    font-family: 'Noto Naskh Arabic', 'Scheherazade New', 'Microsoft Uighur', serif;
    direction: rtl; color: #ffffff;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: relative;
  }
  .bg-overlay {
    position: absolute; top: 0; left: 0; width: 1920px; height: 1080px;
    background-image: radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.12) 0%, transparent 60%),
                      radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }
  .gold-title {
    font-size: 88px; font-weight: 900; color: #fbbf24;
    text-shadow: 0 0 45px rgba(251, 191, 36, 0.65), 0 6px 20px rgba(0,0,0,0.9);
    margin: 0 0 15px 0; text-align: center; line-height: 1.3;
  }
  .cyan-title {
    font-size: 82px; font-weight: 900; color: #38bdf8;
    text-shadow: 0 0 45px rgba(56, 189, 248, 0.65), 0 6px 20px rgba(0,0,0,0.9);
    margin: 0 0 15px 0; text-align: center; line-height: 1.3;
  }
  .subtitle {
    font-size: 38px; color: #e2e8f0; font-weight: 600;
    text-shadow: 0 4px 15px rgba(0,0,0,0.9); margin: 0 0 25px 0; text-align: center;
  }
  .badge-pill {
    display: inline-flex; align-items: center; gap: 12px;
    background: rgba(245, 158, 11, 0.18); border: 2px solid #f59e0b;
    border-radius: 9999px; padding: 12px 35px; color: #fef08a; font-size: 26px; font-weight: 700;
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
  }
  .cards-row {
    display: flex; gap: 40px; align-items: center; justify-content: center;
    margin-top: 30px;
  }
  .product-card {
    background: linear-gradient(145deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.95));
    border: 2px solid rgba(245, 158, 11, 0.4); border-radius: 28px;
    padding: 24px; display: flex; flex-direction: column; align-items: center;
    box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(245, 158, 11, 0.15);
    width: 420px;
  }
  .product-img {
    width: 320px; height: 260px; object-fit: cover; border-radius: 18px;
    border: 2px solid rgba(255,255,255,0.1);
  }
  .product-tag {
    margin-top: 18px; font-size: 28px; font-weight: 800; color: #fef08a;
  }
</style>
"@

# Helper to write UTF-8 HTML
function Write-SceneHtml($filename, $bodyContent) {
  $fullHtml = @"
<!DOCTYPE html>
<html dir="rtl" lang="ug">
<head>
  <meta charset="utf-8">
  $cssBase
</head>
<body>
  <div class="bg-overlay"></div>
  $bodyContent
</body>
</html>
"@
  [System.IO.File]::WriteAllText($filename, $fullHtml, [System.Text.Encoding]::UTF8)
}

# --- SCENE 1: Brand Reveal ---
# With Text
Write-SceneHtml "$renderDir\s1_text.html" @"
  <img src="file:///C:/Users/ThinkPad/Desktop/تەكلىماكان/teklimakan_logo_final.png" style="width: 260px; height: 260px; border-radius: 50%; border: 4px solid #f59e0b; box-shadow: 0 0 60px rgba(245, 158, 11, 0.6); margin-bottom: 25px;">
  <div class="gold-title">تەكلىماكان سودا تورى</div>
  <div class="subtitle">سۈپەتلىك، گۈزەل، ئىشەنچلىك ئۇيغۇرچە تور سودا سۇپىڭىز</div>
  <div class="badge-pill">👑 رەسمىي ئېلان قىلىندى • 100% سۈپەت كاپالىتى</div>
"@
# Without Text
Write-SceneHtml "$renderDir\s1_notext.html" @"
  <img src="file:///C:/Users/ThinkPad/Desktop/تەكلىماكان/teklimakan_logo_final.png" style="width: 360px; height: 360px; border-radius: 50%; border: 6px solid #f59e0b; box-shadow: 0 0 90px rgba(245, 158, 11, 0.7);">
"@

# --- SCENE 2: Luxury Products ---
# With Text
Write-SceneHtml "$renderDir\s2_text.html" @"
  <div class="gold-title">تاللانغان ئەڭ ئېسىل مەھسۇلاتلار</div>
  <div class="subtitle">💎 خوتەن قاشتېشى • نەپىس ئەتلەس • تېبابەت پىننە گۈلقەنتى</div>
  <div class="cards-row">
    <div class="product-card">
      <img src="file:///C:/Users/ThinkPad/Desktop/web/teklimakan/images/products/PRD-122.jpg" class="product-img">
      <div class="product-tag">خوتەن ساپ قاشتېشى</div>
    </div>
    <div class="product-card" style="border-color: #38bdf8;">
      <img src="file:///C:/Users/ThinkPad/Desktop/تەكلىماكان/پىننەگۈلقەنت/Pinne_Gulkenti_Tall_Jar_Transparent.png" class="product-img" style="object-fit: contain;">
      <div class="product-tag" style="color: #38bdf8;">پىننە گۈلقەنتى</div>
    </div>
    <div class="product-card">
      <img src="file:///C:/Users/ThinkPad/Desktop/web/teklimakan/images/products/PRD-103.jpg" class="product-img">
      <div class="product-tag">مىللىي ئەتلەس شايى</div>
    </div>
  </div>
"@
# Without Text
Write-SceneHtml "$renderDir\s2_notext.html" @"
  <div class="cards-row" style="margin-top: 0;">
    <div class="product-card" style="width: 480px; padding: 30px;">
      <img src="file:///C:/Users/ThinkPad/Desktop/web/teklimakan/images/products/PRD-122.jpg" class="product-img" style="width: 400px; height: 360px;">
    </div>
    <div class="product-card" style="width: 480px; padding: 30px; border-color: #38bdf8;">
      <img src="file:///C:/Users/ThinkPad/Desktop/تەكلىماكان/پىننەگۈلقەنت/Pinne_Gulkenti_Tall_Jar_Transparent.png" class="product-img" style="width: 400px; height: 360px; object-fit: contain;">
    </div>
    <div class="product-card" style="width: 480px; padding: 30px;">
      <img src="file:///C:/Users/ThinkPad/Desktop/web/teklimakan/images/products/PRD-103.jpg" class="product-img" style="width: 400px; height: 360px;">
    </div>
  </div>
"@

# --- SCENE 3: Natural Specialties ---
# With Text
Write-SceneHtml "$renderDir\s3_text.html" @"
  <div class="gold-title">ساپ، تەبىئىي، ئورگانىك يۇرت تەملىرى</div>
  <div class="subtitle">🌿 ئەڭ ئېسىل ئاقسۇ قەغەز ياڭىقى ۋە جۇرجان چىلىنى</div>
  <div class="cards-row">
    <div class="product-card" style="width: 460px;">
      <img src="file:///C:/Users/ThinkPad/Desktop/web/teklimakan/images/products/PRD-100.jpg" class="product-img" style="width: 400px; height: 320px;">
      <div class="product-tag">ئاقسۇ نېپىز پوستلۇق ياڭاق</div>
    </div>
    <div class="product-card" style="width: 460px; border-color: #ec4899;">
      <img src="file:///C:/Users/ThinkPad/Desktop/web/teklimakan/images/products/PRD-130.png" class="product-img" style="width: 400px; height: 320px; object-fit: contain;">
      <div class="product-tag" style="color: #f472b6;">چوڭ دانىلىق جۇرجان چىلىنى</div>
    </div>
  </div>
"@
# Without Text
Write-SceneHtml "$renderDir\s3_notext.html" @"
  <div class="cards-row" style="margin-top: 0;">
    <div class="product-card" style="width: 580px; padding: 35px;">
      <img src="file:///C:/Users/ThinkPad/Desktop/web/teklimakan/images/products/PRD-100.jpg" class="product-img" style="width: 500px; height: 420px;">
    </div>
    <div class="product-card" style="width: 580px; padding: 35px; border-color: #ec4899;">
      <img src="file:///C:/Users/ThinkPad/Desktop/web/teklimakan/images/products/PRD-130.png" class="product-img" style="width: 500px; height: 420px; object-fit: contain;">
    </div>
  </div>
"@

# --- SCENE 4: Smart Shopping & Delivery ---
# With Text
Write-SceneHtml "$renderDir\s4_text.html" @"
  <div class="cyan-title">زامانىۋى، بىخەتەر ۋە قولايلىق سودا</div>
  <div class="subtitle">📱 ئەقلىي يانفون سۇپىسى • دەل ۋاقتىدا تېز كاپالەت</div>
  <div class="cards-row" style="gap: 30px;">
    <div style="background: rgba(30, 41, 59, 0.9); border: 2px solid #38bdf8; border-radius: 24px; padding: 35px 40px; text-align: center; width: 340px; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
      <div style="font-size: 60px; margin-bottom: 15px;">📱</div>
      <div style="font-size: 26px; font-weight: 800; color: #ffffff;">ئۆلچەملىك ئۇيغۇرچە</div>
      <div style="font-size: 20px; color: #94a3b8; margin-top: 8px;">تولۇق كۆچمە سۇپا</div>
    </div>
    <div style="background: rgba(30, 41, 59, 0.9); border: 2px solid #10b981; border-radius: 24px; padding: 35px 40px; text-align: center; width: 340px; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
      <div style="font-size: 60px; margin-bottom: 15px;">⚡</div>
      <div style="font-size: 26px; font-weight: 800; color: #ffffff;">1 سېكۇنتتا زاكاز</div>
      <div style="font-size: 20px; color: #94a3b8; margin-top: 8px;">تېز ۋە سىلىق سېۋەت</div>
    </div>
    <div style="background: rgba(30, 41, 59, 0.9); border: 2px solid #f59e0b; border-radius: 24px; padding: 35px 40px; text-align: center; width: 340px; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
      <div style="font-size: 60px; margin-bottom: 15px;">🚚</div>
      <div style="font-size: 26px; font-weight: 800; color: #ffffff;">كارگو ئىز قوغلاش</div>
      <div style="font-size: 20px; color: #94a3b8; margin-top: 8px;">ھەر بىر قەدەم ئېنىق</div>
    </div>
    <div style="background: rgba(30, 41, 59, 0.9); border: 2px solid #a855f7; border-radius: 24px; padding: 35px 40px; text-align: center; width: 340px; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
      <div style="font-size: 60px; margin-bottom: 15px;">💵</div>
      <div style="font-size: 26px; font-weight: 800; color: #ffffff;">كۆپ پۇل بىرلىكى</div>
      <div style="font-size: 20px; color: #94a3b8; margin-top: 8px;">Lira (₺) & Dollar ($)</div>
    </div>
  </div>
"@
# Without Text
Write-SceneHtml "$renderDir\s4_notext.html" @"
  <div class="cards-row" style="gap: 40px; margin-top: 0;">
    <div style="background: rgba(30, 41, 59, 0.9); border: 3px solid #38bdf8; border-radius: 30px; padding: 50px; text-align: center; width: 380px;">
      <div style="font-size: 90px; margin-bottom: 15px;">📱</div>
      <div style="font-size: 60px;">✨</div>
    </div>
    <div style="background: rgba(30, 41, 59, 0.9); border: 3px solid #10b981; border-radius: 30px; padding: 50px; text-align: center; width: 380px;">
      <div style="font-size: 90px; margin-bottom: 15px;">⚡</div>
      <div style="font-size: 60px;">🛒</div>
    </div>
    <div style="background: rgba(30, 41, 59, 0.9); border: 3px solid #f59e0b; border-radius: 30px; padding: 50px; text-align: center; width: 380px;">
      <div style="font-size: 90px; margin-bottom: 15px;">🚚</div>
      <div style="font-size: 60px;">📦</div>
    </div>
  </div>
"@

# --- SCENE 5: Coupon & Free Shipping ---
# With Text
Write-SceneHtml "$renderDir\s5_text.html" @"
  <div class="gold-title">🎉 ئېچىلىش كاتتا سوۋغىسى!</div>
  <div class="subtitle">ھازىرلا كىرىپ مەخسۇس ئالتۇن ئېتىبارغا ئېرىشىڭ</div>
  <div style="display: flex; gap: 40px; margin-top: 30px;">
    <!-- Gold Coupon -->
    <div style="background: linear-gradient(135deg, #b45309, #78350f); border: 3px dashed #fcd34d; border-radius: 28px; padding: 35px 50px; text-align: center; width: 620px; box-shadow: 0 20px 50px rgba(245, 158, 11, 0.4);">
      <div style="font-size: 32px; font-weight: 800; color: #fef08a; margin-bottom: 15px;">🎁 50 ₺ نەق پۇل كۇپونى</div>
      <div style="font-family: monospace; font-size: 64px; font-weight: 900; background: #ffffff; color: #b45309; border-radius: 16px; padding: 12px 30px; letter-spacing: 4px; display: inline-block;">TEKLIMAKAN50</div>
      <div style="font-size: 24px; color: #fde68a; margin-top: 15px;">زاكازدا دەرھال 50 لىرا ئېتىبار كېمەيتىلىدۇ</div>
    </div>
    <!-- Free Shipping -->
    <div style="background: linear-gradient(135deg, #065f46, #064e3b); border: 3px solid #34d399; border-radius: 28px; padding: 35px 50px; text-align: center; width: 620px; box-shadow: 0 20px 50px rgba(16, 185, 129, 0.4);">
      <div style="font-size: 65px; margin-bottom: 10px;">🚚</div>
      <div style="font-size: 40px; font-weight: 900; color: #a7f3d0; margin-bottom: 10px;">ھەقسىز يەتكۈزۈش!</div>
      <div style="font-size: 26px; color: #d1fae5;">1000 لىرادىن ئاشقان بارلىق زاكازلاردا</div>
    </div>
  </div>
"@
# Without Text
Write-SceneHtml "$renderDir\s5_notext.html" @"
  <div style="display: flex; gap: 50px; margin-top: 0;">
    <div style="background: linear-gradient(135deg, #b45309, #78350f); border: 4px dashed #fcd34d; border-radius: 35px; padding: 50px 70px; text-align: center; width: 680px; box-shadow: 0 20px 60px rgba(245, 158, 11, 0.5);">
      <div style="font-size: 90px; margin-bottom: 20px;">🎁</div>
      <div style="font-size: 70px; font-weight: 900; color: #fef08a;">50 ₺</div>
    </div>
    <div style="background: linear-gradient(135deg, #065f46, #064e3b); border: 4px solid #34d399; border-radius: 35px; padding: 50px 70px; text-align: center; width: 680px; box-shadow: 0 20px 60px rgba(16, 185, 129, 0.5);">
      <div style="font-size: 90px; margin-bottom: 20px;">🚚 📦</div>
      <div style="font-size: 70px; font-weight: 900; color: #a7f3d0;">1000 ₺</div>
    </div>
  </div>
"@

# --- SCENE 6: Grand Finale & CTA ---
# With Text
Write-SceneHtml "$renderDir\s6_text.html" @"
  <img src="file:///C:/Users/ThinkPad/Desktop/تەكلىماكان/teklimakan_logo_final.png" style="width: 240px; height: 240px; border-radius: 50%; border: 4px solid #f59e0b; box-shadow: 0 0 60px rgba(245, 158, 11, 0.7); margin-bottom: 20px;">
  <div class="gold-title">تەكلىماكان سودا تورى</div>
  <div class="subtitle" style="font-size: 44px; color: #38bdf8; font-weight: 800; margin-bottom: 25px;">🌐 www.teklimakan.com</div>
  <div style="display: flex; gap: 30px; align-items: center;">
    <div style="background: #16a34a; color: white; padding: 16px 45px; border-radius: 9999px; font-size: 32px; font-weight: 800; display: flex; align-items: center; gap: 15px; box-shadow: 0 10px 30px rgba(22, 163, 74, 0.5);">
      <span>📱 WhatsApp: 0555 160 99 99</span>
    </div>
    <div style="background: linear-gradient(135deg, #eab308, #ca8a04); color: #0f172a; padding: 16px 45px; border-radius: 9999px; font-size: 32px; font-weight: 900; box-shadow: 0 10px 30px rgba(234, 179, 8, 0.5);">
      <span>🛒 ھازىرلا سېتىۋېلىڭ!</span>
    </div>
  </div>
"@
# Without Text
Write-SceneHtml "$renderDir\s6_notext.html" @"
  <img src="file:///C:/Users/ThinkPad/Desktop/تەكلىماكان/teklimakan_logo_final.png" style="width: 380px; height: 380px; border-radius: 50%; border: 6px solid #f59e0b; box-shadow: 0 0 100px rgba(245, 158, 11, 0.8);">
"@

Write-Host ">>> 2. Capturing 1080p High-Res Scene Frames via Edge Headless..." -ForegroundColor Cyan

$scenes = @(
  @{ Name = "s1_text"; Html = "$renderDir\s1_text.html"; Png = "$renderDir\s1_text.png" },
  @{ Name = "s1_notext"; Html = "$renderDir\s1_notext.html"; Png = "$renderDir\s1_notext.png" },
  @{ Name = "s2_text"; Html = "$renderDir\s2_text.html"; Png = "$renderDir\s2_text.png" },
  @{ Name = "s2_notext"; Html = "$renderDir\s2_notext.html"; Png = "$renderDir\s2_notext.png" },
  @{ Name = "s3_text"; Html = "$renderDir\s3_text.html"; Png = "$renderDir\s3_text.png" },
  @{ Name = "s3_notext"; Html = "$renderDir\s3_notext.html"; Png = "$renderDir\s3_notext.png" },
  @{ Name = "s4_text"; Html = "$renderDir\s4_text.html"; Png = "$renderDir\s4_text.png" },
  @{ Name = "s4_notext"; Html = "$renderDir\s4_notext.html"; Png = "$renderDir\s4_notext.png" },
  @{ Name = "s5_text"; Html = "$renderDir\s5_text.html"; Png = "$renderDir\s5_text.png" },
  @{ Name = "s5_notext"; Html = "$renderDir\s5_notext.html"; Png = "$renderDir\s5_notext.png" },
  @{ Name = "s6_text"; Html = "$renderDir\s6_text.html"; Png = "$renderDir\s6_text.png" },
  @{ Name = "s6_notext"; Html = "$renderDir\s6_notext.html"; Png = "$renderDir\s6_notext.png" }
)

foreach ($sc in $scenes) {
  Write-Host "Rendering $($sc.Name)..."
  $cmd = "start /wait `"`" `"$edgePath`" --headless --disable-gpu --hide-scrollbars --window-size=1920,1080 --screenshot=`"$($sc.Png)`" `"file:///$($sc.Html -replace '\\', '/')`""
  cmd.exe /c $cmd
  if (-not (Test-Path $sc.Png)) {
    throw "Failed to capture $($sc.Png)"
  }
}

Write-Host ">>> 3. Assembling 1080p Cinema Video with FFmpeg..." -ForegroundColor Cyan

$audioFile = "$renderDir\promo_audio_mixed.aac"

# Function to build 38-second video from 6 scenes using FFmpeg xfade
function Build-Video($s1, $s2, $s3, $s4, $s5, $s6, $outFile, $hasAudio) {
  # 6 scenes: s1 (6.8s), s2 (6.8s), s3 (6.8s), s4 (6.8s), s5 (6.8s), s6 (7.2s)
  # Transitions: 0.8s offset at 6.0s, 12.0s, 18.0s, 24.0s, 30.0s -> total duration = 30.0 + 7.2 = 37.2s (rounds to 38s)
  $vf = @"
[0:v]format=yuv420p,zoompan=z='min(zoom+0.0006,1.08)':d=170:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25[v0];
[1:v]format=yuv420p,zoompan=z='min(zoom+0.0006,1.08)':d=170:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25[v1];
[2:v]format=yuv420p,zoompan=z='min(zoom+0.0006,1.08)':d=170:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25[v2];
[3:v]format=yuv420p,zoompan=z='min(zoom+0.0006,1.08)':d=170:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25[v3];
[4:v]format=yuv420p,zoompan=z='min(zoom+0.0006,1.08)':d=170:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25[v4];
[5:v]format=yuv420p,zoompan=z='min(zoom+0.0006,1.08)':d=190:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25[v5];
[v0][v1]xfade=transition=fade:duration=0.8:offset=6.0[x1];
[x1][v2]xfade=transition=fade:duration=0.8:offset=12.0[x2];
[x2][v3]xfade=transition=fade:duration=0.8:offset=18.0[x3];
[x3][v4]xfade=transition=fade:duration=0.8:offset=24.0[x4];
[x4][v5]xfade=transition=fade:duration=0.8:offset=30.0[vout]
"@ -replace "`r`n", ""

  if ($hasAudio) {
    & ffmpeg -y -loop 1 -t 6.8 -i $s1 `
                -loop 1 -t 6.8 -i $s2 `
                -loop 1 -t 6.8 -i $s3 `
                -loop 1 -t 6.8 -i $s4 `
                -loop 1 -t 6.8 -i $s5 `
                -loop 1 -t 8.0 -i $s6 `
                -i $audioFile `
                -filter_complex $vf `
                -map "[vout]" -map 6:a `
                -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -r 25 -c:a aac -b:a 192k -shortest $outFile
  } else {
    & ffmpeg -y -loop 1 -t 6.8 -i $s1 `
                -loop 1 -t 6.8 -i $s2 `
                -loop 1 -t 6.8 -i $s3 `
                -loop 1 -t 6.8 -i $s4 `
                -loop 1 -t 6.8 -i $s5 `
                -loop 1 -t 8.0 -i $s6 `
                -filter_complex $vf `
                -map "[vout]" -an `
                -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -r 25 -t 37.2 $outFile
  }
}

Write-Host "Rendering Version 1: ئاۋازلىق + خەتلىك..." -ForegroundColor Green
$v1 = "$desktopDir\تەكلىماكان_تونۇشتۇرۇش_فىلىمى_ئاۋازلىق_خەتلىك.mp4"
Build-Video "$renderDir\s1_text.png" "$renderDir\s2_text.png" "$renderDir\s3_text.png" "$renderDir\s4_text.png" "$renderDir\s5_text.png" "$renderDir\s6_text.png" $v1 $true

Write-Host "Rendering Version 2: ئاۋازسىز + خەتلىك..." -ForegroundColor Green
$v2 = "$desktopDir\تەكلىماكان_تونۇشتۇرۇش_فىلىمى_ئاۋازسىز_خەتلىك.mp4"
Build-Video "$renderDir\s1_text.png" "$renderDir\s2_text.png" "$renderDir\s3_text.png" "$renderDir\s4_text.png" "$renderDir\s5_text.png" "$renderDir\s6_text.png" $v2 $false

Write-Host "Rendering Version 3: ئاۋازلىق + خەتسىز..." -ForegroundColor Green
$v3 = "$desktopDir\تەكلىماكان_تونۇشتۇرۇش_فىلىمى_ئاۋازلىق_خەتسىز.mp4"
Build-Video "$renderDir\s1_notext.png" "$renderDir\s2_notext.png" "$renderDir\s3_notext.png" "$renderDir\s4_notext.png" "$renderDir\s5_notext.png" "$renderDir\s6_notext.png" $v3 $true

Write-Host "Rendering Version 4: ئاۋازسىز + خەتسىز..." -ForegroundColor Green
$v4 = "$desktopDir\تەكلىماكان_تونۇشتۇرۇش_فىلىمى_ئاۋازسىز_خەتسىز.mp4"
Build-Video "$renderDir\s1_notext.png" "$renderDir\s2_notext.png" "$renderDir\s3_notext.png" "$renderDir\s4_notext.png" "$renderDir\s5_notext.png" "$renderDir\s6_notext.png" $v4 $false

Write-Host ">>> ALL 4 VIDEOS COMPLETED SUCCESSFULLY!" -ForegroundColor Green