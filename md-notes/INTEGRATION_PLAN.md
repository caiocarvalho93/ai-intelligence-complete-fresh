# Java Backend Integration Plan

## Current Situation
- **cainews**: Current working project (Node.js backend)
- **temp-java-repo**: Contains working Java Spring Boot backend (37 Java files)
- **temp-ai-repo**: Contains additional features and services missing from cainews

## Integration Strategy

### Phase 1: Java Backend Integration (PRIORITY)
1. Copy complete `backend-java` folder from temp-java-repo to cainews
2. Preserve all Java source files, pom.xml, Dockerfile
3. Ensure Java backend runs independently on different port (8080)

### Phase 2: Missing Node.js Services Integration
From temp-ai-repo, integrate missing services:
- Enhanced AI services (grok-brain, mission-control, etc.)
- Translation system enhancements
- Crypto services
- Job search services
- Country-specific news processors
- All missing routes and middleware

### Phase 3: Frontend Integration
- Merge missing components from temp-ai-repo
- Preserve current working cainews frontend
- Add missing pages and contexts

### Phase 4: Configuration & Dependencies
- Merge package.json dependencies
- Update environment variables
- Configure dual backend setup (Node.js + Java)

## Conflict Resolution Priority
**ALWAYS prioritize cainews current content when conflicts occur**
- If file exists in cainews and temp repos, keep cainews version
- Only add NEW files from temp repos
- Document all additions in INTEGRATION_LOG.md
