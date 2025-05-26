# Sun Movement Application - Troubleshooting Guide

## Common Issues and Solutions

### Error After Login

If you encounter an error after login that shows:

```
An error occurred while processing your request.
Request ID: 00-3b41828048324a9c2ca6b7d9a9581c73-18ee73c2828b3049-00
```

This is likely caused by one of these issues:

1. **JWT Token Configuration**: There might be issues with the JWT token generation or validation.
2. **Environment Configuration**: Your application might not be running in Development mode, which hides detailed error information.

### Solution

We've made the following improvements to fix these issues:

1. **Enhanced JWT Token Handling**:
   - Added proper null checking in token generation
   - Implemented better error handling during authentication
   - Improved token validation parameters

2. **Better Error Handling**:
   - Added detailed error pages for common status codes
   - Improved logging for authentication failures
   - Added try/catch blocks around critical authentication code

3. **Development Environment Support**:
   - Created a `run-dev.bat` script to easily run the application in Development mode
   - This shows detailed error information to help with debugging

## Running the Application

### Development Mode

To run the application in development mode with detailed error information:

1. Open a command prompt in the project root directory
2. Run `run-dev.bat`
3. The application will start with full error details visible

### Production Mode

For production deployments, make sure to properly configure your environment:

1. Set `ASPNETCORE_ENVIRONMENT` to `Production`
2. Ensure all JWT configuration settings are properly set in appsettings.json
3. Make sure your database connection string is correct

## Troubleshooting Steps

If you continue to experience issues:

1. Check the application logs for detailed error information
2. Verify database connection and migrations are up-to-date
3. Ensure JWT settings are correctly configured in appsettings.json
4. Make sure user accounts and roles are properly set up in the database

## JWT Configuration

Your JWT configuration should look like this in appsettings.json:

```json
"Jwt": {
  "Key": "YourSecretKeyHere",
  "Issuer": "SunMovement.Web",
  "Audience": "SunMovement.Client",
  "DurationInMinutes": 60
}
```
