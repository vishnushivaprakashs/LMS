# LMS Command Reference

Quick reference for all common commands used in the LMS project.

## 📦 Installation Commands

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

### Install Both (from root)
```bash
cd backend && npm install && cd ../frontend && npm install
```

---

## 🚀 Development Commands

### Start Backend Server
```bash
cd backend
npm run dev          # Development mode (auto-reload)
npm start            # Production mode
```

### Start Frontend Server
```bash
cd frontend
npm run dev          # Development mode (HMR enabled)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Start Both Servers (Windows PowerShell)
```powershell
# Terminal 1
cd backend; npm run dev

# Terminal 2
cd frontend; npm run dev
```

---

## 🗄️ MongoDB Commands

### Windows
```bash
# Start MongoDB service
net start MongoDB

# Stop MongoDB service
net stop MongoDB

# Run MongoDB manually
mongod --dbpath "C:\data\db"
```

### macOS
```bash
# Start MongoDB
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community

# Check status
brew services list
```

### Linux
```bash
# Start MongoDB
sudo systemctl start mongod

# Stop MongoDB
sudo systemctl stop mongod

# Check status
sudo systemctl status mongod
```

### MongoDB Shell
```bash
# Connect to MongoDB
mongo

# Or with newer versions
mongosh

# Use LMS database
use lms

# Show all users
db.users.find().pretty()

# Count users
db.users.count()

# Delete all users
db.users.deleteMany({})

# Drop database
db.dropDatabase()
```

---

## 🧪 Testing Commands

### cURL API Tests

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"role\":\"student\"}"
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### PowerShell API Tests

**Signup:**
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    role = "student"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -Body $body -ContentType "application/json"
```

**Login:**
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

---

## 🔧 Environment Setup Commands

### Create .env Files

**Backend:**
```bash
cd backend
cp .env.example .env       # macOS/Linux
copy .env.example .env     # Windows
```

**Frontend:**
```bash
cd frontend
cp .env.example .env       # macOS/Linux
copy .env.example .env     # Windows
```

---

## 🧹 Cleanup Commands

### Remove Dependencies
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json    # macOS/Linux
rmdir /s node_modules && del package-lock.json    # Windows

# Frontend
cd frontend
rm -rf node_modules package-lock.json    # macOS/Linux
rmdir /s node_modules && del package-lock.json    # Windows
```

### Clear Build Files
```bash
# Frontend
cd frontend
rm -rf dist .vite           # macOS/Linux
rmdir /s dist .vite         # Windows
```

### Reset Database
```bash
# MongoDB Shell
mongo
use lms
db.dropDatabase()
exit
```

---

## 🐛 Debugging Commands

### Check Running Processes

**Windows:**
```powershell
# Check port 5000 (backend)
netstat -ano | findstr :5000

# Check port 5173 (frontend)
netstat -ano | findstr :5173

# Kill process by PID
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Check port 5000
lsof -i :5000

# Check port 5173
lsof -i :5173

# Kill process
kill -9 <PID>

# Or kill by port
lsof -ti:5000 | xargs kill
```

### View Logs

**Backend:**
```bash
cd backend
npm run dev    # Logs appear in terminal
```

**Frontend:**
```bash
cd frontend
npm run dev    # Logs appear in terminal and browser console
```

---

## 📊 Package Management

### Update Dependencies

**Check for updates:**
```bash
npm outdated
```

**Update all packages:**
```bash
npm update
```

**Update specific package:**
```bash
npm update <package-name>
```

**Install latest version:**
```bash
npm install <package-name>@latest
```

### Add New Packages

**Backend:**
```bash
cd backend
npm install <package-name>
npm install --save-dev <package-name>    # Dev dependency
```

**Frontend:**
```bash
cd frontend
npm install <package-name>
npm install --save-dev <package-name>    # Dev dependency
```

---

## 🔍 Useful Git Commands

### Initialize Repository
```bash
git init
git add .
git commit -m "Initial commit: Phase 1 & 2 complete"
```

### Create .gitignore
Already created! Located at root: `.gitignore`

### Check Status
```bash
git status
git log --oneline
```

### Branching
```bash
# Create new branch for Phase 3
git checkout -b phase-3-course-management

# Switch branches
git checkout main

# List branches
git branch
```

---

## 🌐 Browser Commands

### Open Application
```bash
# Windows
start http://localhost:5173

# macOS
open http://localhost:5173

# Linux
xdg-open http://localhost:5173
```

### Clear Browser Data
- **Chrome/Edge:** `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (macOS)
- **Firefox:** `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (macOS)

### Open DevTools
- **All browsers:** `F12` or `Ctrl+Shift+I` (Windows) or `Cmd+Option+I` (macOS)

---

## 📝 Code Quality Commands

### Format Code (if using Prettier)
```bash
npx prettier --write .
```

### Lint Code (if using ESLint)
```bash
npx eslint .
npx eslint . --fix    # Auto-fix issues
```

---

## 🔐 Security Commands

### Generate JWT Secret
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -base64 64
```

### Hash Password (for testing)
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('password123', 10).then(console.log)"
```

---

## 📦 Production Build Commands

### Build Frontend
```bash
cd frontend
npm run build
```

### Preview Production Build
```bash
cd frontend
npm run preview
```

### Start Backend in Production
```bash
cd backend
NODE_ENV=production npm start
```

---

## 🎯 Quick Workflows

### Fresh Start (Reset Everything)
```bash
# Stop all servers (Ctrl+C in terminals)

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Frontend (new terminal)
cd frontend
rm -rf node_modules package-lock.json dist
npm install
npm run dev
```

### Daily Development Workflow
```bash
# 1. Start MongoDB (if local)
net start MongoDB    # Windows
brew services start mongodb-community    # macOS

# 2. Start Backend
cd backend
npm run dev

# 3. Start Frontend (new terminal)
cd frontend
npm run dev

# 4. Open browser
# http://localhost:5173
```

### Deploy Preparation
```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Test production build
npm run preview

# 3. Set production environment
cd ../backend
# Update .env with production values

# 4. Start backend in production mode
NODE_ENV=production npm start
```

---

## 🆘 Emergency Commands

### Kill All Node Processes

**Windows:**
```powershell
taskkill /F /IM node.exe
```

**macOS/Linux:**
```bash
killall node
```

### Reset Everything
```bash
# 1. Kill all Node processes
# 2. Stop MongoDB
# 3. Delete node_modules in both folders
# 4. Delete database
# 5. Reinstall dependencies
# 6. Recreate .env files
# 7. Start fresh
```

---

## 📚 Help Commands

### NPM Help
```bash
npm help
npm help <command>
```

### Node Version
```bash
node --version
npm --version
```

### MongoDB Version
```bash
mongo --version
mongod --version
```

---

## 💡 Tips

### Run Multiple Commands
```bash
# Sequential (one after another)
npm install && npm run dev

# Background (Linux/macOS)
npm run dev &

# Parallel (using npm-run-all)
npm install -g npm-run-all
npm-run-all --parallel dev:*
```

### Environment Variables
```bash
# Windows PowerShell
$env:NODE_ENV="production"

# macOS/Linux
export NODE_ENV=production

# One-time use
NODE_ENV=production npm start
```

---

**Quick Access:**
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- API Health: http://localhost:5000/api/health
- MongoDB: mongodb://localhost:27017
