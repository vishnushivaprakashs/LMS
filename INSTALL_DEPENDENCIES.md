# 📦 Install All Dependencies

## Quick Installation

Run these commands to install all required dependencies for both backend and frontend.

### Option 1: Manual Installation

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### Option 2: PowerShell Script (Windows)

Create a file `install.ps1` in the root directory:

```powershell
Write-Host "Installing Backend Dependencies..." -ForegroundColor Green
Set-Location backend
npm install

Write-Host "`nInstalling Frontend Dependencies..." -ForegroundColor Green
Set-Location ../frontend
npm install

Write-Host "`nAll dependencies installed successfully!" -ForegroundColor Green
Set-Location ..
```

Run with:
```bash
.\install.ps1
```

## New Dependencies Added

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| pdfkit | ^0.13.0 | PDF certificate generation |
| qrcode | ^1.5.3 | QR code generation for certificates |
| cloudinary | ^1.41.0 | Video upload service |
| multer | ^1.4.5-lts.1 | File upload middleware |

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| react-hot-toast | ^2.4.1 | Enhanced toast notifications |

## Verify Installation

After installation, verify all packages are installed:

```bash
# Backend
cd backend
npm list pdfkit qrcode cloudinary multer

# Frontend
cd ../frontend
npm list react-hot-toast
```

## Environment Setup

1. **Backend:** Copy `.env.example` to `.env` and fill in values
2. **Frontend:** Copy `.env.example` to `.env` (or create with `VITE_API_URL=http://localhost:5000`)

## Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Troubleshooting

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Permission errors on Windows

**Solution:** Run PowerShell as Administrator

### Issue: Port already in use

**Solution:**
```bash
# Backend (port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (port 5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## Next Steps

After installation, follow the [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for configuration and testing.
