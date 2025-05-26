# SQL Server Migration Guide for SunMovement Project

This guide walks you through the process of working with Entity Framework Core migrations for SQL Server in the SunMovement project.

## Prerequisites

- SQL Server Express installed on your machine
- .NET SDK installed
- All required NuGet packages (already installed in the project):
  - Microsoft.EntityFrameworkCore.Design
  - Microsoft.EntityFrameworkCore.SqlServer
  - Microsoft.EntityFrameworkCore.Tools

## Your Current Connection String

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=SunMovementDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
```

## Existing Migrations

Your project already has the following migrations:
1. `20250511130210_InitialMigration`
2. `20250512043106_UpdateModels`

## Steps for Working with Migrations

### 1. Creating a New Migration

When you need to update your database schema:

```cmd
cd d:\SunMoveMent\DATN\sun-movement-backend
dotnet ef migrations add YourMigrationName --project SunMovement.Infrastructure --startup-project SunMovement.Web
```

### 2. Applying Migrations to the Database

To apply your migrations to the database:

```cmd
cd d:\SunMoveMent\DATN\sun-movement-backend
dotnet ef database update --project SunMovement.Infrastructure --startup-project SunMovement.Web
```

### 3. Rolling Back to a Specific Migration

If you need to roll back to a previous migration:

```cmd
cd d:\SunMoveMent\DATN\sun-movement-backend
dotnet ef database update MigrationName --project SunMovement.Infrastructure --startup-project SunMovement.Web
```

Replace `MigrationName` with the name of the migration you want to roll back to.

### 4. Removing the Latest Migration

If you made a mistake and want to remove the latest migration (only if it hasn't been applied to the database):

```cmd
cd d:\SunMoveMent\DATN\sun-movement-backend
dotnet ef migrations remove --project SunMovement.Infrastructure --startup-project SunMovement.Web
```

### 5. Generating SQL Script

If you want to generate a SQL script for all migrations:

```cmd
cd d:\SunMoveMent\DATN\sun-movement-backend
dotnet ef migrations script --project SunMovement.Infrastructure --startup-project SunMovement.Web --output migrate.sql
```

Or generate a script for migrating from one version to another:

```cmd
cd d:\SunMoveMent\DATN\sun-movement-backend
dotnet ef migrations script 20250511130210_InitialMigration 20250512043106_UpdateModels --project SunMovement.Infrastructure --startup-project SunMovement.Web --output migrate_specific.sql
```

## Common Issues and Solutions

### 1. Cannot Connect to SQL Server

- Ensure SQL Server Express is running
- Verify the connection string in `appsettings.json`
- Check if Windows Authentication is enabled

### 2. Migration Failed

- Check if there are any pending changes in the database
- Verify that your model changes are valid
- Look for detailed error messages in the console output

### 3. DbContext Not Found

- Make sure the `--project` and `--startup-project` parameters are correct
- Ensure your DbContext is properly registered in `Program.cs`
