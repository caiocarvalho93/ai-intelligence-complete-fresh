# CAI News - Complete Startup Guide

## System Architecture

Your application now has a **unified dual-backend architecture**:

```
┌──────────────────────────────────────────────────────┐
│                  Frontend (React)                     │
│              http://localhost:5173                    │
└───────────────────┬──────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼────────┐
│ Node.js Backend│    │  Java Backend   │
│  Port: 3000    │    │   Port: 8080    │
│   (Express)    │    │  (Spring Boot)  │
└───────┬────────┘    └────────┬────────┘
        │                      │
        └──────────┬───────────┘
                   │
        ┌──────────▼──────────┐
        │   PostgreSQL DB     │
        │    Port: 5432       │
        └─────────────────────┘
```

## Prerequisites

### Required Software
- **Node.js**: 18.x or higher
- **npm**: 9.0.0 or higher
- **Java**: JDK 17 or higher
- **Maven**: 3.6+ (for Java backend)
- **PostgreSQL**: 12+ (database)

### Check Installations
```bash
node --version    # Should be v18.x or higher
npm --version     # Should be 9.x or higher
java --version    # Should be 17 or higher
mvn --version     # Should be 3.6 or higher
psql --version    # Should be 12 or higher
```

## Step 1: Database Setup

### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cainews;

# Create user (if needed)
CREATE USER cainews_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE cainews TO cainews_user;

# Exit
\q
```

### Initialize Schema
```bash
# Run Node.js backend database setup
cd backend
node setup-local-postgres.js
```

## Step 2: Environment Configuration

### Backend Node.js (.env)
Create/update `backend/.env`:
```env
# Database
DATABASE_URL=postgresql://localhost:5432/cainews
DATABASE_USER=cainews_user
DATABASE_PASSWORD=your_secure_password

# Server
PORT=3000
NODE_ENV=development

# API Keys
NEWSAPI_KEY=your_newsapi_key
NEWSDATA_API_KEY=your_newsdata_key
OPENAI_API_KEY=your_openai_key

# Optional Services
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
COINGECKO_API_KEY=your_coingecko_key
```

### Backend Java (application.properties)
Create `backend-java/src/main/resources/application.properties`:
```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/cainews
spring.datasource.username=cainews_user
spring.datasource.password=your_secure_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Cache Configuration
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=1000,expireAfterWrite=10m

# Actuator
management.endpoints.web.exposure.include=health,metrics
```

## Step 3: Install Dependencies

### Root Dependencies
```bash
# From cainews root directory
npm install
```

### Backend Node.js Dependencies
```bash
cd backend
npm install
cd ..
```

### Backend Java Dependencies
```bash
cd backend-java
mvn clean install
cd ..
```

### CAI Chat Dependencies (Optional)
```bash
cd backend/cai
npm install
cd ../..
```

## Step 4: Build Java Backend

```bash
cd backend-java
mvn clean package
cd ..
```

This creates: `backend-java/target/website-project-ai-java-0.0.1-SNAPSHOT.jar`

## Step 5: Start Services

### Option A: Start All Services Separately

#### Terminal 1: Node.js Backend
```bash
cd backend
npm start
# Or for development with auto-reload:
npm run dev
```
✓ Running on http://localhost:3000

#### Terminal 2: Java Backend
```bash
cd backend-java
mvn spring-boot:run
# Or run the JAR:
# java -jar target/website-project-ai-java-0.0.1-SNAPSHOT.jar
```
✓ Running on http://localhost:8080

#### Terminal 3: Frontend
```bash
npm run dev
```
✓ Running on http://localhost:5173

#### Terminal 4: CAI Chat (Optional)
```bash
npm run cai:start
```

### Option B: Start with Concurrently (Recommended)
```bash
# Start both backends
npm run start:all

# In another terminal, start frontend
npm run dev
```

## Step 6: Verify Installation

### Check Node.js Backend
```bash
curl http://localhost:3000/api/health
# Should return: {"status":"ok"}
```

### Check Java Backend
```bash
curl http://localhost:8080/actuator/health
# Should return: {"status":"UP"}
```

### Check Frontend
Open browser: http://localhost:5173
- Should see the CAI News interface
- Check browser console for errors

### Check Database Connection
```bash
psql -U cainews_user -d cainews -c "SELECT version();"
```

## Step 7: Test Integration

### Test Node.js API
```bash
# Get news
curl http://localhost:3000/api/news

# Get translation
curl http://localhost:3000/api/translate?text=hello&to=es
```

### Test Java API
```bash
# Get leaderboard
curl http://localhost:8080/api/game/leaderboard

# Get country news
curl http://localhost:8080/api/news/country/USA
```

## Common Issues & Solutions

### Issue: Port Already in Use

**Node.js Backend (3000)**
```bash
lsof -i :3000
kill -9 <PID>
```

**Java Backend (8080)**
```bash
lsof -i :8080
kill -9 <PID>
```

**Frontend (5173)**
```bash
lsof -i :5173
kill -9 <PID>
```

### Issue: Database Connection Failed

1. Check PostgreSQL is running:
```bash
pg_isready
```

2. Verify credentials in .env and application.properties

3. Test connection:
```bash
psql -U cainews_user -d cainews
```

### Issue: Java Build Fails

```bash
# Clear Maven cache
rm -rf ~/.m2/repository

# Rebuild
cd backend-java
mvn clean install -U
```

### Issue: Node Modules Issues

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Do the same for backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Frontend Build Errors

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

## Development Workflow

### Making Changes

**Node.js Backend**:
- Edit files in `backend/`
- Server auto-reloads with nodemon (if using `npm run dev`)

**Java Backend**:
- Edit files in `backend-java/src/`
- Spring Boot DevTools auto-reloads
- Or restart: `mvn spring-boot:run`

**Frontend**:
- Edit files in `src/`
- Vite hot-reloads automatically

### Running Tests

**Node.js Backend**:
```bash
cd backend
npm test
```

**Java Backend**:
```bash
cd backend-java
mvn test
```

## Production Deployment

### Build for Production

**Frontend**:
```bash
npm run build
# Creates: build/ directory
```

**Java Backend**:
```bash
cd backend-java
mvn clean package -DskipTests
# Creates: target/*.jar
```

### Environment Variables for Production

Update all `.env` files and `application.properties` with production values:
- Database URLs (production database)
- API keys (production keys)
- CORS origins (production domains)
- Security settings

## Monitoring

### Node.js Backend Logs
```bash
# View logs
tail -f backend/logs/app.log

# Or if using PM2
pm2 logs backend
```

### Java Backend Logs
```bash
# View logs
tail -f backend-java/logs/spring.log

# Or check console output
```

### Database Monitoring
```bash
# Connect to database
psql -U cainews_user -d cainews

# Check active connections
SELECT * FROM pg_stat_activity;

# Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Cleanup Temporary Files

After verifying everything works:
```bash
# Remove cloned repos
rm -rf temp-java-repo temp-ai-repo

# Remove test files (optional)
rm -rf cache-test-*.html
rm -rf kiro-diagnostic-*.html
```

## Quick Reference

### Start Everything
```bash
# Terminal 1: Backends
npm run start:all

# Terminal 2: Frontend
npm run dev
```

### Stop Everything
```bash
# Press Ctrl+C in each terminal
# Or if using PM2:
pm2 stop all
```

### Restart Services
```bash
# Node.js backend
cd backend && npm restart

# Java backend
cd backend-java && mvn spring-boot:run

# Frontend
npm run dev
```

## Next Steps

1. ✓ Verify all services are running
2. ✓ Test API endpoints
3. ✓ Check database connections
4. Configure production environment
5. Set up monitoring and logging
6. Deploy to production servers

## Support

If you encounter issues:
1. Check logs in each service
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check database connectivity
5. Review INTEGRATION_LOG.md for details

## Success Checklist

- [ ] PostgreSQL database created and accessible
- [ ] Node.js backend running on port 3000
- [ ] Java backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] All API endpoints responding
- [ ] Database tables created
- [ ] No console errors in browser
- [ ] Can fetch news from Node.js backend
- [ ] Can access game leaderboard from Java backend
- [ ] Translation system working

**Congratulations! Your unified CAI News system is now fully operational! 🎉**
