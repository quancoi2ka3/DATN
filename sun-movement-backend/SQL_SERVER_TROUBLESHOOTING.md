# SQL Server Connection Troubleshooting Guide for SunMovement

## Common SQL Server Connection Issues and Solutions

### 1. **SQL Server Express Not Running**

**Problem**: The SQL Server Express service is not started.

**Solution**:
```bash
# Check if SQL Server Express is running
services.msc
# Look for "SQL Server (SQLEXPRESS)" and start if stopped

# Or use command line:
net start MSSQL$SQLEXPRESS
```

### 2. **Incorrect Connection String**

**Current Connection String**:
```json
"Server=localhost\\SQLEXPRESS;Database=SunMovementDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
```

**Alternative Connection Strings**:
```json
# For SQL Server Express with named instance
"Server=.\\SQLEXPRESS;Database=SunMovementDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"

# For SQL Server Express with default instance
"Server=localhost;Database=SunMovementDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"

# With SQL Server Authentication (if using username/password)
"Server=localhost\\SQLEXPRESS;Database=SunMovementDB;User Id=sa;Password=YourPassword;MultipleActiveResultSets=true;TrustServerCertificate=True"

# For LocalDB (alternative to SQL Express)
"Server=(localdb)\\mssqllocaldb;Database=SunMovementDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
```

### 3. **Database Doesn't Exist**

**Problem**: The SunMovementDB database hasn't been created.

**Solution**:
```bash
cd "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"
dotnet ef database update
```

### 4. **Firewall or Network Issues**

**Problem**: Windows Firewall or SQL Server configuration blocks connections.

**Solutions**:
- Enable TCP/IP protocol in SQL Server Configuration Manager
- Start SQL Server Browser service
- Configure Windows Firewall to allow SQL Server

### 5. **Named Pipes vs TCP/IP**

**Problem**: Connection protocol mismatch.

**Solution**:
- Enable both Named Pipes and TCP/IP in SQL Server Configuration Manager
- Use appropriate connection string format

### 6. **Migration Issues**

**Problem**: Database schema is out of sync.

**Solutions**:
```bash
# Check current migrations
dotnet ef migrations list

# Update database
dotnet ef database update

# If needed, drop and recreate database
dotnet ef database drop
dotnet ef database update
```

## Debugging Steps

### Step 1: Test SQL Server Connection
```bash
# Open Command Prompt and test connection
sqlcmd -S localhost\SQLEXPRESS -E
# If this fails, SQL Server Express is not running or not accessible
```

### Step 2: Check Entity Framework Connection
```bash
cd "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"
dotnet ef dbcontext info
```

### Step 3: Run Application with Detailed Logging
Add this to appsettings.Development.json:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information",
      "Microsoft.EntityFrameworkCore.Database.Connection": "Information"
    }
  }
}
```

### Step 4: Test Different Connection String
Update appsettings.json with LocalDB connection:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SunMovementDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

## Quick Fix Commands

```bash
# 1. Ensure SQL Server Express is running
net start MSSQL$SQLEXPRESS

# 2. Navigate to project directory
cd "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"

# 3. Test EF connection
dotnet ef dbcontext info

# 4. Update database
dotnet ef database update

# 5. Run application
dotnet run
```

## Error Code Meanings

- **Error 2**: SQL Server doesn't exist or access denied
- **Error 53**: Network path not found
- **Error 18456**: Login failed
- **Error 40**: Could not open connection to SQL Server
- **Error 26**: Error locating server/instance specified

## Alternative: Use SQLite for Development

If SQL Server continues to cause issues, switch to SQLite for development:

1. Install SQLite package:
```bash
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
```

2. Update connection string:
```json
"DefaultConnection": "Data Source=SunMovement.db"
```

3. Update DbContext registration in Program.cs:
```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));
```
