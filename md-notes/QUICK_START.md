# Quick Start - CAI News

## 🚀 Get Running in 5 Minutes

### Prerequisites Check
```bash
node --version   # Need 18+
java --version   # Need 17+
mvn --version    # Need 3.6+
psql --version   # Need 12+
```

### 1. Database Setup (1 minute)
```bash
createdb cainews
cd backend && node setup-local-postgres.js
```

### 2. Environment Config (1 minute)
```bash
# Copy and edit backend/.env
cp backend/.env.example backend/.env
# Add your API keys

# Create backend-java/src/main/resources/application.properties
# See STARTUP_GUIDE.md for template
```

### 3. Install Dependencies (2 minutes)
```bash
npm install
cd backend && npm install && cd ..
cd backend-java && mvn clean install && cd ..
```

### 4. Start Everything (1 minute)
```bash
# Terminal 1: Backends
npm run start:all

# Terminal 2: Frontend
npm run dev
```

### 5. Verify
- Frontend: http://localhost:5173
- Node.js API: http://localhost:3000
- Java API: http://localhost:8080

## 🎯 Essential Commands

### Start Services
```bash
npm run start:all    # Both backends
npm run dev          # Frontend
npm run java:run     # Java only
```

### Stop Services
```bash
# Press Ctrl+C in each terminal
```

### Verify Integration
```bash
node verify-integration.js
```

### Test APIs
```bash
curl http://localhost:3000/api/health
curl http://localhost:8080/actuator/health
```

## 📁 Key Files

- `STARTUP_GUIDE.md` - Complete setup guide
- `INTEGRATION_LOG.md` - What was integrated
- `INTEGRATION_COMPLETE.md` - Success summary
- `backend-java/README.md` - Java backend docs

## 🆘 Quick Fixes

### Port in use?
```bash
lsof -i :3000  # Node.js
lsof -i :8080  # Java
lsof -i :5173  # Frontend
kill -9 <PID>
```

### Database issues?
```bash
pg_isready
psql -U postgres -c "CREATE DATABASE cainews;"
```

### Build fails?
```bash
rm -rf node_modules package-lock.json
npm install
```

## ✅ Success Checklist

- [ ] All services start without errors
- [ ] Frontend loads at localhost:5173
- [ ] Node.js API responds at localhost:3000
- [ ] Java API responds at localhost:8080
- [ ] No console errors in browser
- [ ] Database connection works

## 🎉 You're Ready!

Your unified CAI News system is now running with:
- Java backend (Spring Boot)
- Node.js backend (Express)
- React frontend (Vite)
- PostgreSQL database

For detailed information, see `STARTUP_GUIDE.md`
