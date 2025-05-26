# EF Core SQL Server Migration Troubleshooting Guide

## Common Error: "Cannot open database requested by the login"

### Problem
```
Cannot open database 'SunMovementDB' requested by the login. The login failed.
Login failed for user 'DOMAIN\Username'.
```

### Solutions
1. **Ensure SQL Server is running**
   ```cmd
   sc query MSSQL$SQLEXPRESS
   ```

2. **Check if the database exists:**
   ```sql
   SELECT name FROM sys.databases;
   ```

3. **Verify your connection string:**
   - Check `appsettings.json`
   - Make sure the SQL Server instance name is correct
   - Ensure Windows Authentication is enabled if using `Trusted_Connection=True`

4. **Create the database manually if needed:**
   ```sql
   CREATE DATABASE SunMovementDB;
   GO
   ```

---

## Common Error: "Migration X has already been applied to the database"

### Problem
```
The migration 'YourMigrationName' has already been applied to the database. Revert it and try again.
```

### Solutions
1. **Remove the migration and recreate it:**
   ```cmd
   dotnet ef migrations remove --project SunMovement.Infrastructure --startup-project SunMovement.Web
   ```

2. **Update database to a previous migration:**
   ```cmd
   dotnet ef database update PreviousMigrationName --project SunMovement.Infrastructure --startup-project SunMovement.Web
   ```

3. **Or, if you want to apply changes without a new migration:**
   ```cmd
   dotnet ef database update --project SunMovement.Infrastructure --startup-project SunMovement.Web
   ```

---

## Common Error: "The entity type requires a primary key to be defined"

### Problem
```
The entity type 'YourEntityName' requires a primary key to be defined.
```

### Solution
Ensure your entity has a key defined:

```csharp
public class YourEntity
{
    [Key]
    public int Id { get; set; }
    
    // Other properties...
}
```

Or use the Fluent API in your DbContext:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<YourEntity>()
        .HasKey(e => e.Id);
}
```

---

## Common Error: "Unable to track an entity because another entity with the same key value is already being tracked"

### Problem
```
Unable to track an entity of type 'Entity' because another entity of the same key value is already being tracked.
```

### Solution
Clear your DbContext's change tracker before adding new entities:

```csharp
dbContext.ChangeTracker.Clear();
```

Or use `AsNoTracking()` for queries that don't need tracking:

```csharp
var items = await dbContext.Items
    .AsNoTracking()
    .ToListAsync();
```

---

## Common Error: "The database provider attempted to roll back the transaction, but failed"

### Problem
```
The database provider attempted to roll back the transaction, but failed.
```

### Solution
1. **Check for open connections/transactions:**
   ```sql
   SELECT * FROM sys.sysprocesses WHERE dbid = DB_ID('YourDatabaseName')
   ```

2. **Kill any blocking processes if necessary:**
   ```sql
   KILL [process_id];
   ```

3. **Verify your SQL Server has sufficient permissions**

---

## Common Error: "No database provider has been configured"

### Problem
```
No database provider has been configured for this DbContext.
```

### Solution
Ensure you've configured the DbContext with a database provider:

```csharp
// In Program.cs or Startup.cs
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
```

---

## Common Error: "Multiple context types were found"

### Problem
```
More than one DbContext was found. Specify which one to use.
```

### Solution
Specify the context when running the EF Core command:

```cmd
dotnet ef migrations add YourMigrationName --project SunMovement.Infrastructure --startup-project SunMovement.Web --context ApplicationDbContext
```

---

## Common Error: "Method not found: 'Void Microsoft.EntityFrameworkCore...'"

### Problem
```
Method not found: 'Void Microsoft.EntityFrameworkCore.[MethodName]'
```

### Solution
This usually indicates version mismatches between EF Core packages. Ensure all EF Core packages have the same version:

1. Check your .csproj files
2. Update all EF Core packages to the same version:
   ```cmd
   dotnet add package Microsoft.EntityFrameworkCore --version 9.0.4
   dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 9.0.4
   dotnet add package Microsoft.EntityFrameworkCore.Tools --version 9.0.4
   dotnet add package Microsoft.EntityFrameworkCore.Design --version 9.0.4
   ```
