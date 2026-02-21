$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$htmlFiles = Get-ChildItem -Path $root -Recurse -Filter '*.html' -File
$attrs = @('href', 'src')
$broken = @()

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

    $baseRel = ''
    $baseMatch = [regex]::Match($content, '<base\s+href="([^"]+)"', 'IgnoreCase')
    if ($baseMatch.Success) {
        $baseRel = $baseMatch.Groups[1].Value.Trim()
    }

    $baseDir = if ($baseRel) { Join-Path $file.DirectoryName $baseRel } else { $file.DirectoryName }

    foreach ($attr in $attrs) {
        $pattern = $attr + '\s*=\s*"([^"]+)"'
        $matches = [regex]::Matches($content, $pattern, 'IgnoreCase')

        foreach ($m in $matches) {
            $raw = $m.Groups[1].Value.Trim()
            if (-not $raw) { continue }

            if ($raw -match '^(https?:|mailto:|tel:|data:|javascript:|#)') { continue }
            if ($raw -match '^(//)') { continue }
            if ($raw -match '^\$\{') { continue }

            $clean = ($raw -split '#')[0]
            $clean = ($clean -split '\?')[0]
            if (-not $clean) { continue }

            if ($clean.StartsWith('/')) {
                $target = Join-Path $root $clean.TrimStart('/')
            }
            else {
                $target = Join-Path $baseDir $clean
            }

            if (-not (Test-Path -LiteralPath $target)) {
                $broken += [PSCustomObject]@{
                    File = $file.FullName.Substring($root.Length + 1)
                    Attr = $attr
                    Link = $raw
                    Base = $(if ($baseRel) { $baseRel } else { '.' })
                    Resolved = $target.Substring($root.Length + 1)
                }
            }
        }
    }
}

if ($broken.Count -gt 0) {
    Write-Host "Broken links found: $($broken.Count)" -ForegroundColor Red
    $broken | Sort-Object File, Link | Format-Table -AutoSize | Out-String -Width 500 | Write-Host
    exit 1
}

Write-Host 'No broken local links found.' -ForegroundColor Green
exit 0
