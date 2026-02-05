#!/usr/bin/env pwsh

# ==================================
# Chat App - PowerShell Setup Script
# ==================================

Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Anonymous Chat System Setup          ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

# Check Node.js
Write-Host "[*] Checking Node.js..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js not found!" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check npm
Write-Host "[*] Checking npm..." -ForegroundColor Yellow

try {
    $npmVersion = npm --version
    Write-Host "[OK] npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies
Write-Host "`n[*] Installing dependencies..." -ForegroundColor Yellow

npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] npm install failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Success message
Write-Host "`n" -ForegroundColor Green
Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Setup Complete! ✓                    ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Green
Write-Host "`n"

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "`n  1. Start server:" -ForegroundColor White
Write-Host "     npm start" -ForegroundColor Yellow
Write-Host "`n  2. Open browser:" -ForegroundColor White
Write-Host "     http://localhost:3000/chat.html" -ForegroundColor Yellow
Write-Host "`n"

Write-Host "Or for development with auto-reload:" -ForegroundColor Cyan
Write-Host "     npm run dev" -ForegroundColor Yellow
Write-Host "`n"

Read-Host "Press Enter to exit"
