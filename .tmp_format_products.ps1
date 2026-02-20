Set-Location "c:\github repositories\akkuelectronics"

function Format-JsonValue {
    param(
        [Parameter(Mandatory = $true)]
        $Value,
        [int]$Indent = 0
    )

    if ($null -eq $Value) { return 'null' }

    if ($Value -is [string]) {
        return (ConvertTo-Json $Value -Compress)
    }

    if ($Value -is [bool]) {
        return $Value.ToString().ToLowerInvariant()
    }

    if ($Value -is [byte] -or $Value -is [int16] -or $Value -is [int32] -or $Value -is [int64] -or
        $Value -is [single] -or $Value -is [double] -or $Value -is [decimal]) {
        return [string]::Format([System.Globalization.CultureInfo]::InvariantCulture, '{0}', $Value)
    }

    if (($Value -is [System.Collections.IEnumerable]) -and -not ($Value -is [string])) {
        $items = @($Value)
        if ($items.Count -eq 0) { return '[]' }

        $itemLines = foreach ($item in $items) {
            (' ' * ($Indent + 2)) + (Format-JsonValue -Value $item -Indent ($Indent + 2))
        }

        return "[`n$($itemLines -join ',`n')`n$(' ' * $Indent)]"
    }

    $props = $Value.PSObject.Properties
    if ($props.Count -eq 0) { return '{}' }

    $propLines = foreach ($p in $props) {
        (' ' * ($Indent + 2)) + (ConvertTo-Json $p.Name -Compress) + ': ' + (Format-JsonValue -Value $p.Value -Indent ($Indent + 2))
    }

    return "{`n$($propLines -join ',`n')`n$(' ' * $Indent)}"
}

$path = "products.json"
$obj = Get-Content $path -Raw | ConvertFrom-Json
$formatted = Format-JsonValue -Value $obj -Indent 0
[System.IO.File]::WriteAllText((Resolve-Path $path), $formatted, [System.Text.UTF8Encoding]::new($false))
Write-Output "Formatted products.json"
