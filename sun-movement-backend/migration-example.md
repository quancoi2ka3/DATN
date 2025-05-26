# Migration Example: Adding a Featured Flag to Products

This example demonstrates how to add a "Featured" flag to the Product entity and update your database accordingly.

## Step 1: Modify the Product Entity

First, update your `Product.cs` file to add the new property:

```csharp
// In SunMovement.Core/Models/Product.cs

namespace SunMovement.Core.Models
{
    public class Product
    {
        // ... existing properties ...
        
        // Add this new property
        public bool IsFeatured { get; set; } = false;
    }
}
```

## Step 2: Create a Migration

Open a command prompt and run:

```cmd
cd d:\SunMoveMent\DATN\sun-movement-backend
dotnet ef migrations add AddProductFeaturedFlag --project SunMovement.Infrastructure --startup-project SunMovement.Web
```

This will generate migration files in the `Migrations` folder.

## Step 3: Review the Migration

The generated migration should look something like:

```csharp
public partial class AddProductFeaturedFlag : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<bool>(
            name: "IsFeatured",
            table: "Products",
            nullable: false,
            defaultValue: false);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "IsFeatured",
            table: "Products");
    }
}
```

## Step 4: Apply the Migration to the Database

Run the following command:

```cmd
cd d:\SunMoveMent\DATN\sun-movement-backend
dotnet ef database update --project SunMovement.Infrastructure --startup-project SunMovement.Web
```

This will apply your migration to the database, adding the `IsFeatured` column to the Products table.

## Step 5: Use the New Field in Your Application

You can now use the `IsFeatured` property in your application, for example:

```csharp
// Get all featured products
var featuredProducts = await _unitOfWork.Products.FindAsync(p => p.IsFeatured);
```

---

# Alternative: Using SQL Scripts for Database Changes

If you prefer to use SQL scripts for more complex database changes:

## Generate SQL Script from Migration

```cmd
cd d:\SunMoveMent\DATN\sun-movement-backend
dotnet ef migrations script --project SunMovement.Infrastructure --startup-project SunMovement.Web --output migration-script.sql
```

## Review and Execute Script Manually

1. Review the generated `migration-script.sql` file
2. Connect to your SQL Server using SQL Server Management Studio (SSMS) or Azure Data Studio
3. Execute the script against your database
