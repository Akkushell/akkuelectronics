param(
    [string]$SiteRoot = ".",
    [string]$BaseUrl = "https://akkuelectronics.in",
    [string]$ReportDir = "reports"
)

$ErrorActionPreference = "Stop"

function Test-Pattern {
    param(
        [string]$Content,
        [string]$Pattern
    )
    return [bool]([regex]::IsMatch($Content, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase))
}

$resolvedRoot = (Resolve-Path $SiteRoot).Path
$resolvedReportDir = Join-Path $resolvedRoot $ReportDir
if (-not (Test-Path $resolvedReportDir)) {
    New-Item -ItemType Directory -Path $resolvedReportDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$csvPath = Join-Path $resolvedReportDir "seo-audit-$timestamp.csv"
$mdPath = Join-Path $resolvedReportDir "seo-audit-$timestamp.md"

$htmlFiles = Get-ChildItem -Path $resolvedRoot -Recurse -Filter *.html | Sort-Object FullName
$results = @()

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $relative = $file.FullName.Replace($resolvedRoot + [System.IO.Path]::DirectorySeparatorChar, "").Replace("\\", "/")

    $checks = [ordered]@{
        title               = Test-Pattern -Content $content -Pattern '<title>.*?</title>'
        meta_description    = Test-Pattern -Content $content -Pattern '<meta[^>]+name=["'']description["''][^>]*>'
        canonical           = Test-Pattern -Content $content -Pattern '<link[^>]+rel=["'']canonical["''][^>]*>'
        h1                  = Test-Pattern -Content $content -Pattern '<h1\b[^>]*>.*?</h1>'
        og_title            = Test-Pattern -Content $content -Pattern '<meta[^>]+property=["'']og:title["''][^>]*>'
        og_description      = Test-Pattern -Content $content -Pattern '<meta[^>]+property=["'']og:description["''][^>]*>'
        og_image            = Test-Pattern -Content $content -Pattern '<meta[^>]+property=["'']og:image["''][^>]*>'
        og_url              = Test-Pattern -Content $content -Pattern '<meta[^>]+property=["'']og:url["''][^>]*>'
        twitter_card        = Test-Pattern -Content $content -Pattern '<meta[^>]+name=["'']twitter:card["''][^>]*>'
        twitter_title       = Test-Pattern -Content $content -Pattern '<meta[^>]+name=["'']twitter:title["''][^>]*>'
        twitter_description = Test-Pattern -Content $content -Pattern '<meta[^>]+name=["'']twitter:description["''][^>]*>'
        twitter_image       = Test-Pattern -Content $content -Pattern '<meta[^>]+name=["'']twitter:image["''][^>]*>'
        jsonld              = Test-Pattern -Content $content -Pattern '<script[^>]+type=["'']application/ld\+json["'']'
        viewport            = Test-Pattern -Content $content -Pattern '<meta[^>]+name=["'']viewport["''][^>]*>'
        lang                = Test-Pattern -Content $content -Pattern '<html[^>]+lang=["''][^"'']+["'']'
    }

    $missing = @($checks.GetEnumerator() | Where-Object { -not $_.Value } | ForEach-Object { $_.Key })

    $results += [PSCustomObject]@{
        file                = $relative
        url                 = ($BaseUrl.TrimEnd('/') + '/' + $relative)
        missing_count       = $missing.Count
        missing_fields      = if ($missing.Count -gt 0) { $missing -join '|' } else { '' }
        title               = $checks.title
        meta_description    = $checks.meta_description
        canonical           = $checks.canonical
        h1                  = $checks.h1
        og_title            = $checks.og_title
        og_description      = $checks.og_description
        og_image            = $checks.og_image
        og_url              = $checks.og_url
        twitter_card        = $checks.twitter_card
        twitter_title       = $checks.twitter_title
        twitter_description = $checks.twitter_description
        twitter_image       = $checks.twitter_image
        jsonld              = $checks.jsonld
        viewport            = $checks.viewport
        lang                = $checks.lang
    }
}

$results | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8

$total = $results.Count
$withIssues = @($results | Where-Object { $_.missing_count -gt 0 })
$issueCount = $withIssues.Count
$okCount = $total - $issueCount

$fieldStats = @{}
$fields = @(
    'title','meta_description','canonical','h1','og_title','og_description','og_image','og_url',
    'twitter_card','twitter_title','twitter_description','twitter_image','jsonld','viewport','lang'
)

foreach ($field in $fields) {
    $missingForField = @($results | Where-Object { -not $_.$field }).Count
    $fieldStats[$field] = $missingForField
}

$md = @()
$md += "# SEO Audit Report"
$md += ""
$md += "- Run Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$md += "- Site Root: $resolvedRoot"
$md += "- Base URL: $BaseUrl"
$md += "- Total HTML Files: $total"
$md += "- Pages With Issues: $issueCount"
$md += "- Pages Passing All Checks: $okCount"
$md += ""
$md += "## Missing Field Counts"
$md += ""
$md += "| Field | Missing Pages |"
$md += "|---|---:|"
foreach ($field in $fields) {
    $md += "| $field | $($fieldStats[$field]) |"
}

$md += ""
$md += "## Pages With Issues"
$md += ""
if ($issueCount -eq 0) {
    $md += "All pages passed all checks."
} else {
    $md += "| File | Missing Fields |"
    $md += "|---|---|"
    foreach ($row in $withIssues) {
        $md += "| $($row.file) | $($row.missing_fields) |"
    }
}

$md | Set-Content -Path $mdPath -Encoding UTF8

Write-Host "SEO audit completed."
Write-Host "CSV report: $csvPath"
Write-Host "Markdown report: $mdPath"
Write-Host "Pages with issues: $issueCount / $total"

if ($issueCount -gt 0) {
    Write-Host "\nTop issue pages:" -ForegroundColor Yellow
    $withIssues | Sort-Object missing_count -Descending | Select-Object -First 10 file, missing_count, missing_fields | Format-Table -AutoSize
}
