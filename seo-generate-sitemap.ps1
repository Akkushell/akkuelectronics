param(
    [string]$SiteRoot = ".",
    [string]$BaseUrl = "https://akkuelectronics.in",
    [string]$OutputFile = "sitemap.xml"
)

$ErrorActionPreference = "Stop"

$resolvedRoot = (Resolve-Path $SiteRoot).Path
$outputPath = Join-Path $resolvedRoot $OutputFile

$htmlFiles = Get-ChildItem -Path $resolvedRoot -Recurse -Filter *.html |
    Where-Object {
        $_.FullName -notmatch "\\node_modules\\" -and
        $_.FullName -notmatch "\\reports\\"
    } |
    Sort-Object FullName

$urls = New-Object System.Collections.Generic.List[object]

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw

    if ($content -match '<meta[^>]+name=["'']robots["''][^>]*content=["''][^"'']*noindex') {
        continue
    }

    $relative = $file.FullName.Replace($resolvedRoot + [System.IO.Path]::DirectorySeparatorChar, "")
    $relative = $relative -replace '\\', '/'

    if ($relative -eq "index.html") {
        $url = $BaseUrl.TrimEnd('/') + "/"
        $priority = "1.0"
        $changefreq = "weekly"
    }
    else {
        $url = $BaseUrl.TrimEnd('/') + "/" + $relative
        $priority = "0.7"
        $changefreq = "monthly"

        if ($relative -eq "services.html" -or $relative -eq "shop.html" -or $relative -eq "firmwares.html") {
            $priority = "0.9"
            $changefreq = "weekly"
        }
        elseif ($relative -eq "blog/index.html") {
            $priority = "0.8"
            $changefreq = "weekly"
        }
        elseif ($relative -match "^blog/") {
            $priority = "0.7"
            $changefreq = "monthly"
        }
        elseif ($relative -eq "privacy-policy.html") {
            $priority = "0.4"
            $changefreq = "yearly"
        }
    }

    $lastmod = (Get-Item $file.FullName).LastWriteTime.ToString("yyyy-MM-dd")

    $urls.Add([PSCustomObject]@{
        loc = $url
        lastmod = $lastmod
        changefreq = $changefreq
        priority = $priority
        path = $relative
    })
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$sw = New-Object System.IO.StreamWriter($outputPath, $false, $utf8NoBom)

try {
    $sw.WriteLine('<?xml version="1.0" encoding="UTF-8"?>')
    $sw.WriteLine('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    foreach ($item in $urls) {
        $sw.WriteLine('  <url>')
        $sw.WriteLine("    <loc>$($item.loc)</loc>")
        $sw.WriteLine("    <lastmod>$($item.lastmod)</lastmod>")
        $sw.WriteLine("    <changefreq>$($item.changefreq)</changefreq>")
        $sw.WriteLine("    <priority>$($item.priority)</priority>")
        $sw.WriteLine('  </url>')
    }

    $sw.WriteLine('</urlset>')
}
finally {
    $sw.Close()
}

Write-Host "Sitemap generated: $outputPath"
Write-Host "Indexed URLs: $($urls.Count)"

$excluded = $htmlFiles.Count - $urls.Count
Write-Host "Excluded HTML pages (noindex): $excluded"
