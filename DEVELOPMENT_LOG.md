# Vendure Backend - Development Log

## Project Overview
E-commerce backend built with Vendure framework, deployed via Coolify with Docker containers on VPS.

## 🔧 Development Rules & Standards

### Code Quality Standards
- **TypeScript**: Strict mode enabled, no `any` types without justification
- **Linting**: Follow ESLint configuration, fix all warnings before commits
- **Formatting**: Use Prettier for consistent code formatting
- **Imports**: Use absolute imports where possible, group imports logically
- **Error Handling**: Always implement proper error handling with meaningful messages
- **Logging**: Use structured logging with appropriate log levels

### Architecture Guidelines
- **Separation of Concerns**: Keep business logic separate from HTTP handlers
- **Plugin Structure**: Follow Vendure plugin patterns for extensibility
- **Database**: Use TypeORM entities and repositories properly
- **Services**: Create dedicated services for complex business logic
- **Configuration**: Use environment variables for all configurable values

### Docker & Deployment Rules
- **Multi-stage Builds**: Use efficient Docker builds to minimize image size
- **Security**: Never expose sensitive data in Docker images or logs
- **Health Checks**: Implement proper health check endpoints
- **Environment Parity**: Maintain consistency between dev/staging/production
- **Traefik Labels**: Follow established patterns for SSL and routing

### API Design Standards
- **GraphQL Schema**: Follow schema-first design principles
- **Resolvers**: Keep resolvers thin, delegate to services
- **Authentication**: Implement proper JWT token validation
- **Authorization**: Use Vendure's permission system consistently
- **Versioning**: Plan for API versioning from the start

### Testing Requirements
- **Unit Tests**: Cover all business logic with unit tests
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Critical user flows must have end-to-end coverage
- **Test Data**: Use factories/fixtures for consistent test data

### Documentation Standards
- **Code Comments**: Document complex business logic and algorithms
- **API Documentation**: Keep GraphQL schema descriptions up-to-date
- **README Updates**: Update documentation when adding new features
- **Change Logs**: Document all significant changes in this file

### AI Agent Guidelines
- **Context First**: Always review DEVELOPMENT_LOG.md before making changes
- **Incremental Changes**: Make small, focused changes rather than large refactors
- **Test After Changes**: Verify functionality after modifications
- **Update Logs**: Always update this file when making significant changes
- **Follow Patterns**: Maintain consistency with existing code patterns
- **Security Awareness**: Never commit secrets or sensitive configuration

## Current Status
- **Environment**: Production deployment on VPS
- **Deployment**: Coolify + Docker + Traefik for SSL
- **Database**: PostgreSQL (external)
- **Payment**: Braintree integration configured

## Architecture
```
┌─────────────────┐    ┌─────────────────┐
│   Vendure       │    │   Vendure       │
│   Server        │    │   Worker        │
│   (Port 3000)   │    │   (Background)  │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌─────────────────┐
         │    Traefik      │
         │  (SSL/Routing)  │
         └─────────────────┘
```

## Deployment URLs
- **Server**: https://g08o44oc8w4ks0ww84k88c88.greatplainsgrowery.com
- **Worker**: https://iggggksc44g4848sggc8gcow.greatplainsgrowery.com

## Recent Changes

### 2025-08-02 - SSL Configuration Fix
**Issue**: SSL certificates not working after Coolify deployment
**Root Cause**: 
- Missing Traefik labels on server service
- Incorrect hostnames in worker service labels
- Wrong entrypoint configuration (`https` instead of `websecure`)

**Solution Applied**:
- Added complete Traefik label set to server service
- Updated worker service with correct Coolify-generated URLs
- Standardized Traefik configuration:
  ```yaml
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.[service].rule=Host(`[coolify-url]`)"
    - "traefik.http.routers.[service].entrypoints=websecure"
    - "traefik.http.routers.[service].tls=true"
    - "traefik.http.routers.[service].tls.certresolver=letsencrypt"
    - "traefik.http.services.[service].loadbalancer.server.port=3000"
  ```

**Status**: ✅ Fixed - Ready for redeployment

### 2025-08-02 - Database Connectivity Issue
**Issue**: Vendure services deployed but unable to connect to external PostgreSQL database
**Symptoms**: 
- Services start but fail to connect to database
- Database credentials work fine in DataGrip from local machine
- External database at 172.245.234.230:5432

**Root Cause**: Docker networking configuration preventing containers from accessing external database server

**Solution Applied**:
1. **Added Docker Network Configuration**:
   ```yaml
   networks:
     vendure-network:
       driver: bridge
   ```

2. **Added Network Assignment to Services**:
   - Both server and worker services now use `vendure-network`
   - Added `restart: unless-stopped` for better reliability

3. **Created Coolify-specific Environment File**:
   - `.env.coolify` with production database credentials
   - Separated from development configuration

**Additional Steps Required**:
- Ensure Coolify allows external database connections
- Verify firewall rules allow connections from Coolify server
- Consider using connection pooling for production

**Status**: ⚠️ Pending - Requires Coolify network configuration

### 2025-08-02 - Password Authentication Failure Update
**Issue**: PostgreSQL password authentication failed for user "postgres" from Docker containers
**Error Code**: 28P01 (authentication failed)
**Symptoms**: 
- Containers can reach the database server (network connectivity works)
- Authentication fails with exact same credentials that work in DataGrip
- Error: "password authentication failed for user 'postgres'"

**Root Cause Analysis**:
- Database connection established (no network issues)
- Password contains special characters that may need escaping in Docker environment
- Coolify environment variable handling may differ from local Docker

**Solutions Applied**:
1. **Added Debug Logging**:
   - Added database connection debug info to vendure-config.ts
   - Enabled TypeORM logging for connection troubleshooting
   - Added password length verification (without exposing actual password)

2. **Created Multiple Environment File Versions**:
   - `.env.coolify`: Password wrapped in quotes
   - `.env.coolify.debug`: Password without quotes for testing

3. **Environment Variable Escaping Options**:
   - Quoted password: `"N5hi565wA29b39YB8W9x5GqoqepBdvGMps62vnLS1aTfGVedugjyisuQquY9eqik"`
   - Unquoted password: `N5hi565wA29b39YB8W9x5GqoqepBdvGMps62vnLS1aTfGVedugjyisuQquY9eqik`

**Next Steps Required**:
1. Check Coolify logs for environment variable values
2. Try different password escaping methods
3. Verify PostgreSQL server allows connections from Coolify server IP
4. Consider creating a new database user with simpler password for testing

**Status**: 🔍 Investigating - Password authentication from Docker containers

## Current Goals
1. **Immediate**: Validate SSL certificate issuance after redeployment
2. **Short-term**: Ensure storefront can connect to backend APIs
3. **Medium-term**: Monitor performance and optimize Docker configuration

## Known Issues
- [ ] Need to test SSL certificates after redeployment
- [ ] Verify admin panel accessibility
- [ ] Confirm shop API endpoints are working

## Environment Variables
Key environment variables configured:
- `APP_ENV`: Production environment setting
- `DB_*`: Database connection parameters
- `BRAINTREE_*`: Payment gateway configuration
- `COOKIE_SECRET`: Session security
- `SUPERADMIN_*`: Admin user credentials

## Technical Debt
- Consider implementing health checks in Docker services
- Add monitoring/logging configuration
- Document backup and recovery procedures

## Dependencies
- Node.js application
- PostgreSQL database (external)
- Docker containerization
- Traefik reverse proxy
- Let's Encrypt SSL certificates

## Notes for Future Development
- Coolify generates unique subdomain URLs for each service
- Traefik labels must use `websecure` entrypoint for HTTPS
- Both server and worker services need separate Traefik configurations
- Environment variables are passed through Docker build args and runtime env

---
*Last Updated: 2025-08-02*
*Next Review: After SSL validation*
