# CAI News - Java Backend

## Overview
Spring Boot 3.3.4 backend providing high-performance game leaderboard, achievement tracking, and news intelligence services.

## Technology Stack
- **Java**: 17
- **Framework**: Spring Boot 3.3.4
- **Database**: PostgreSQL (JPA/Hibernate)
- **Cache**: Caffeine
- **Build Tool**: Maven

## Project Structure
```
backend-java/
├── src/
│   ├── main/
│   │   ├── java/com/caio/websiteai/
│   │   │   ├── WebsiteAiApplication.java    # Main application
│   │   │   ├── config/                      # Configuration
│   │   │   │   ├── DatabaseConfig.java
│   │   │   │   ├── CacheConfig.java
│   │   │   │   └── HttpConfig.java
│   │   │   ├── game/                        # Game module
│   │   │   │   ├── entity/                  # JPA entities
│   │   │   │   ├── repository/              # Data access
│   │   │   │   ├── service/                 # Business logic
│   │   │   │   └── web/                     # REST controllers
│   │   │   ├── news/                        # News module
│   │   │   │   ├── dto/
│   │   │   │   └── web/
│   │   │   ├── ai/                          # AI services
│   │   │   └── common/                      # Shared utilities
│   │   └── resources/
│   │       └── application.properties
│   └── test/                                # Unit tests
├── pom.xml                                  # Maven configuration
└── Dockerfile                               # Container configuration
```

## Key Features

### Game System
- **Leaderboard**: Real-time player rankings
- **Achievements**: Track and award player accomplishments
- **Scores**: High-performance score tracking
- **Submissions**: Game submission management

### News Intelligence
- **Country News**: Country-specific news aggregation
- **AI Analysis**: Intelligent news processing
- **Caching**: High-performance data caching

## API Endpoints

### Game Endpoints (Port 8080)
```
GET  /api/game/leaderboard          # Get top players
POST /api/game/submit                # Submit game result
GET  /api/game/achievements          # Get achievements
GET  /api/game/scores/:userId        # Get user scores
```

### News Endpoints
```
GET  /api/news/country/:country      # Get country news
GET  /api/news/intelligence          # AI-processed news
```

## Configuration

### Database Setup
Create `src/main/resources/application.properties`:
```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/cainews
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Cache
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=1000,expireAfterWrite=10m
```

### Environment Variables
```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/cainews
export DATABASE_USERNAME=your_username
export DATABASE_PASSWORD=your_password
export SERVER_PORT=8080
```

## Build & Run

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+

### Build
```bash
cd backend-java
mvn clean package
```

### Run
```bash
# Development mode
mvn spring-boot:run

# Or run the JAR
java -jar target/website-project-ai-java-0.0.1-SNAPSHOT.jar
```

### Run with Profile
```bash
# Development profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Production profile
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## Docker Deployment

### Build Image
```bash
docker build -t cainews-java-backend .
```

### Run Container
```bash
docker run -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/cainews \
  -e DATABASE_USERNAME=your_username \
  -e DATABASE_PASSWORD=your_password \
  cainews-java-backend
```

## Testing

### Run Tests
```bash
mvn test
```

### Test Coverage
```bash
mvn test jacoco:report
```

## Database Schema

### Game Tables
```sql
-- Game scores
CREATE TABLE game_scores (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements
CREATE TABLE game_achievements (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points INTEGER DEFAULT 0
);

-- User achievements
CREATE TABLE user_achievements (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    achievement_id BIGINT REFERENCES game_achievements(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game submissions
CREATE TABLE game_submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    game_data JSONB,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Performance Optimization

### Caching Strategy
- **Caffeine Cache**: In-memory caching for frequently accessed data
- **TTL**: 10 minutes default
- **Max Size**: 1000 entries

### Database Optimization
- **Connection Pooling**: HikariCP (default in Spring Boot)
- **Lazy Loading**: JPA lazy fetch for relationships
- **Indexes**: Optimized queries with proper indexing

## Integration with Node.js Backend

### Communication Pattern
```javascript
// Frontend calls Java backend for game features
const response = await fetch('http://localhost:8080/api/game/leaderboard');

// Frontend calls Node.js backend for news
const news = await fetch('http://localhost:3000/api/news');
```

### CORS Configuration
Java backend is configured to accept requests from:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (Node.js backend)
- Production domains (configure in HttpConfig.java)

## Monitoring

### Health Check
```bash
curl http://localhost:8080/actuator/health
```

### Metrics
```bash
curl http://localhost:8080/actuator/metrics
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check credentials in application.properties
3. Ensure database exists: `createdb cainews`

### Build Failures
```bash
# Clean and rebuild
mvn clean install -U

# Skip tests if needed
mvn clean install -DskipTests
```

## Development Tips

### Hot Reload
Spring Boot DevTools is included for automatic restart on code changes.

### Debugging
```bash
# Run with debug enabled
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

### Logging
Adjust logging in application.properties:
```properties
logging.level.com.caio.websiteai=DEBUG
logging.level.org.springframework.web=INFO
```

## Contributing
When adding new features:
1. Follow Spring Boot best practices
2. Add unit tests
3. Update API documentation
4. Maintain backward compatibility

## License
Proprietary - CAI News Project
