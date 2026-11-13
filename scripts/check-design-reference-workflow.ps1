$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$catalogPath = Join-Path $root "docs/design-reference-sources.md"
$skillPath = Join-Path $root "skills/design-reference-workflow/SKILL.md"
$architectureSkillPath = Join-Path $root "skills/architecture-diagramming/SKILL.md"
$gameSkillPath = Join-Path $root "skills/game-production/SKILL.md"
$imageSkillPath = Join-Path $root "skills/image-prompt-handoff/SKILL.md"
$casesPath = Join-Path $root "tests/design-workflow-cases.md"

foreach ($path in @($catalogPath, $skillPath, $architectureSkillPath, $gameSkillPath, $imageSkillPath, $casesPath)) {
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        throw "Required workflow file is missing: $path"
    }
}

$catalog = Get-Content -LiteralPath $catalogPath -Raw
$skill = Get-Content -LiteralPath $skillPath -Raw
$architectureSkill = Get-Content -LiteralPath $architectureSkillPath -Raw
$gameSkill = Get-Content -LiteralPath $gameSkillPath -Raw
$imageSkill = Get-Content -LiteralPath $imageSkillPath -Raw
$cases = Get-Content -LiteralPath $casesPath -Raw

$catalogTerms = @("Refero", "Mobbin", "Pinterest", "Behance", "Dribbble", "Awwwards", "SiteInspire", "Land-book", "One Page Love", "Apple Human Interface Guidelines", "Material Design 3")
foreach ($term in $catalogTerms) {
    if ($catalog.IndexOf($term, [StringComparison]::OrdinalIgnoreCase) -lt 0) {
        throw "Source catalog is missing: $term"
    }
}

$skillTerms = @("at most one fallback", "more than three references", "manual", "scrape", "paywall", "canonical URL")
foreach ($term in $skillTerms) {
    if ($skill.IndexOf($term, [StringComparison]::OrdinalIgnoreCase) -lt 0) {
        throw "Reference workflow skill is missing its guard: $term"
    }
}

$caseTerms = @("mobile checkout", "landing page", "moodboard", "Human Interface Guidelines", "Pinterest", "Godot CLI")
foreach ($term in $caseTerms) {
    if ($cases.IndexOf($term, [StringComparison]::OrdinalIgnoreCase) -lt 0) {
        throw "Workflow cases are missing: $term"
    }
}

$architectureTerms = @("user-provided", "Do not install or call an Excalidraw MCP", "concrete edits")
foreach ($term in $architectureTerms) {
    if ($architectureSkill.IndexOf($term, [StringComparison]::OrdinalIgnoreCase) -lt 0) {
        throw "Architecture review skill is missing its boundary: $term"
    }
}

$gameTerms = @("project-scoped scripts", "Meta AI", "Godot CLI", "do not install Godot")
foreach ($term in $gameTerms) {
    if ($gameSkill.IndexOf($term, [StringComparison]::OrdinalIgnoreCase) -lt 0) {
        throw "Game-production skill is missing its boundary: $term"
    }
}

$imageTerms = @("copy-ready prompt", "Never call a paid image API", "local image-generation model")
foreach ($term in $imageTerms) {
    if ($imageSkill.IndexOf($term, [StringComparison]::OrdinalIgnoreCase) -lt 0) {
        throw "Image-prompt skill is missing its boundary: $term"
    }
}

Write-Output "PASS: source routing, Pinterest boundary, Excalidraw review, image-prompt handoff, and script-only game workflow are present."
