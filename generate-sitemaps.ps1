$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$blogDir = Join-Path $root 'blog'
$baseUrl = 'https://akkuelectronics.in'
$today = (Get-Date).ToString('yyyy-MM-dd')

function Get-ArticleTitle {
    param([string]$content)

    $ogMatch = [regex]::Match($content, '<meta\s+property="og:title"\s+content="([^"]+)"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($ogMatch.Success) { return $ogMatch.Groups[1].Value.Trim() }

    $titleMatch = [regex]::Match($content, '<title>(.*?)</title>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($titleMatch.Success) {
        return ($titleMatch.Groups[1].Value -replace '\s+', ' ').Trim()
    }

    return 'Akku Electronics Blog Article'
}

$articles = @()
Get-ChildItem -Path $blogDir -Filter '*.html' -File | ForEach-Object {
    if ($_.Name -eq 'index.html') { return }

    $m = [regex]::Match($_.Name, '^(\d{2})(\d{2})(\d{4})')
    if (-not $m.Success) { return }

    $day = $m.Groups[1].Value
    $month = $m.Groups[2].Value
    $year = $m.Groups[3].Value
    $publicationDate = "$year-$month-$day"

    $content = Get-Content -Path $_.FullName -Raw -Encoding UTF8
    $title = Get-ArticleTitle -content $content

    $articles += [PSCustomObject]@{
        Loc = "$baseUrl/blog/$($_.Name)"
        PublicationDate = $publicationDate
        Title = $title
    }
}

$articles = $articles | Sort-Object PublicationDate -Descending
$blogIndexLastmod = if ($articles.Count -gt 0) { $articles[0].PublicationDate } else { $today }

$mainUrls = @(
    @{ Loc = "$baseUrl/"; Lastmod = '2025-01-09'; Changefreq = 'weekly'; Priority = '1.0' },
    @{ Loc = "$baseUrl/playstation.html"; Lastmod = '2025-01-09'; Changefreq = 'weekly'; Priority = '0.9' },
    @{ Loc = "$baseUrl/xbox.html"; Lastmod = '2025-01-09'; Changefreq = 'weekly'; Priority = '0.9' },
    @{ Loc = "$baseUrl/playstation-5.html"; Lastmod = '2025-01-09'; Changefreq = 'monthly'; Priority = '0.8' },
    @{ Loc = "$baseUrl/playstation-4.html"; Lastmod = '2025-01-09'; Changefreq = 'monthly'; Priority = '0.8' },
    @{ Loc = "$baseUrl/playstation-3.html"; Lastmod = '2025-01-09'; Changefreq = 'monthly'; Priority = '0.8' },
    @{ Loc = "$baseUrl/xbox-series.html"; Lastmod = '2025-01-09'; Changefreq = 'monthly'; Priority = '0.8' },
    @{ Loc = "$baseUrl/xbox-one.html"; Lastmod = '2025-01-09'; Changefreq = 'monthly'; Priority = '0.8' },
    @{ Loc = "$baseUrl/xbox-360.html"; Lastmod = '2025-01-09'; Changefreq = 'monthly'; Priority = '0.8' },
    @{ Loc = "$baseUrl/services.html"; Lastmod = '2025-01-09'; Changefreq = 'monthly'; Priority = '0.9' },
    @{ Loc = "$baseUrl/shop.html"; Lastmod = '2025-01-09'; Changefreq = 'daily'; Priority = '0.9' },
    @{ Loc = "$baseUrl/gamepad-tester.html"; Lastmod = '2025-01-09'; Changefreq = 'monthly'; Priority = '0.7' },
    @{ Loc = "$baseUrl/contact.html"; Lastmod = '2025-01-09'; Changefreq = 'monthly'; Priority = '0.8' },
    @{ Loc = "$baseUrl/blog/index.html"; Lastmod = $blogIndexLastmod; Changefreq = 'weekly'; Priority = '0.8' }
)

foreach ($a in $articles) {
    $mainUrls += @{ Loc = $a.Loc; Lastmod = $a.PublicationDate; Changefreq = 'monthly'; Priority = '0.7' }
}

$mainUrls += @{ Loc = "$baseUrl/blog/guides/index.html"; Lastmod = $today; Changefreq = 'monthly'; Priority = '0.8' }

$mainBuilder = New-Object System.Text.StringBuilder
$null = $mainBuilder.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
$null = $mainBuilder.AppendLine('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
foreach ($u in $mainUrls) {
    $null = $mainBuilder.AppendLine('  <url>')
    $null = $mainBuilder.AppendLine("    <loc>$($u.Loc)</loc>")
    $null = $mainBuilder.AppendLine("    <lastmod>$($u.Lastmod)</lastmod>")
    $null = $mainBuilder.AppendLine("    <changefreq>$($u.Changefreq)</changefreq>")
    $null = $mainBuilder.AppendLine("    <priority>$($u.Priority)</priority>")
    $null = $mainBuilder.AppendLine('  </url>')
}
$null = $mainBuilder.AppendLine('</urlset>')
Set-Content -Path (Join-Path $root 'sitemap.xml') -Value $mainBuilder.ToString() -Encoding UTF8

$newsBuilder = New-Object System.Text.StringBuilder
$null = $newsBuilder.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
$null = $newsBuilder.AppendLine('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">')
foreach ($a in $articles) {
    $null = $newsBuilder.AppendLine('  <url>')
    $null = $newsBuilder.AppendLine("    <loc>$($a.Loc)</loc>")
    $null = $newsBuilder.AppendLine('    <news:news>')
    $null = $newsBuilder.AppendLine('      <news:publication>')
    $null = $newsBuilder.AppendLine('        <news:name>Akku Electronics Blog</news:name>')
    $null = $newsBuilder.AppendLine('        <news:language>en</news:language>')
    $null = $newsBuilder.AppendLine('      </news:publication>')
    $null = $newsBuilder.AppendLine("      <news:publication_date>$($a.PublicationDate)</news:publication_date>")
    $null = $newsBuilder.AppendLine("      <news:title>$($a.Title)</news:title>")
    $null = $newsBuilder.AppendLine('    </news:news>')
    $null = $newsBuilder.AppendLine('  </url>')
}
$null = $newsBuilder.AppendLine('</urlset>')
Set-Content -Path (Join-Path $root 'sitemap-news.xml') -Value $newsBuilder.ToString() -Encoding UTF8

Write-Host "Generated sitemap.xml and sitemap-news.xml with $($articles.Count) blog articles."
