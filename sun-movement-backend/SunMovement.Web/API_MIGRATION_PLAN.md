# API Migration Plan

## Overview

This document outlines the steps necessary to migrate the remaining API controllers from the `Controllers/Api` folder to the `Areas/Api/Controllers` folder, following the standard ASP.NET Core area structure.

## Controllers to Migrate

The following controllers need to be migrated:

1. ✅ AuthController.cs - Already migrated
2. ✅ ProductsController.cs - Already migrated
3. ContactController.cs
4. EventsController.cs
5. FAQsController.cs
6. OrdersController.cs
7. ServicesController.cs
8. UploadsController.cs

## Migration Steps for Each Controller

For each controller, follow these steps:

1. Open the existing controller file in `Controllers/Api`
2. Create a new file with the same name in `Areas/Api/Controllers` 
3. Copy the content from the original file
4. Change the namespace to `SunMovement.Web.Areas.Api.Controllers`
5. Add the `[Area("Api")]` attribute before the `[ApiController]` attribute
6. Move any model classes to appropriate files in `Areas/Api/Models`
7. Fix any namespace references
8. Test the API endpoints to ensure they still work as expected
9. Once tested, delete the original controller file from `Controllers/Api`

## Example Migration

Here's an example of how to migrate the ServicesController:

### Original
```csharp
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;

namespace SunMovement.Web.Controllers.Api
{
    [Route("api/services")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        // Controller implementation
    }
}
```

### Migrated
```csharp
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/services")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        // Controller implementation
    }
}
```

## Additional Tasks

After migrating all controllers:

1. Move any shared DTOs to appropriate locations
2. Update any references to these controllers from other parts of the application
3. Remove the empty `Controllers/Api` directory
4. Test all API endpoints to ensure they function correctly
5. Update any API documentation to reflect the new structure

## Final Structure

When complete, your API structure should look like this:

```
SunMovement.Web/
└── Areas/
    └── Api/
        ├── Controllers/
        │   ├── AuthController.cs
        │   ├── ContactController.cs
        │   ├── EventsController.cs
        │   ├── FAQsController.cs
        │   ├── OrdersController.cs
        │   ├── ProductsController.cs
        │   ├── ServicesController.cs
        │   └── UploadsController.cs
        └── Models/
            ├── AuthModels.cs
            ├── ContactModels.cs
            └── Other model files...
```
