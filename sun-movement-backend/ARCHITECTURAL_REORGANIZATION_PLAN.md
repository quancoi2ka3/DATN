# 🏗️ SUN MOVEMENT BACKEND - ARCHITECTURAL REORGANIZATION PLAN

## **CURRENT ARCHITECTURE ANALYSIS**

### **Issues Identified:**

1. **Project Structure Inconsistencies**
   - `SunMovement.Api` project with only 1 controller (redundant)
   - Mixed API/Web responsibilities across projects
   - Services scattered between Core and Infrastructure without clear boundaries
   - Duplicate interfaces and implementations

2. **Clean Architecture Violations**
   - Business logic mixed with infrastructure concerns
   - Dependency direction violations
   - Repository pattern inconsistencies
   - Service layer confusion

3. **Organizational Problems**
   - Controllers scattered across multiple projects
   - Mixed MVC and API concerns
   - Inconsistent namespacing
   - Missing service interfaces

## **TARGET ARCHITECTURE: CLEAN ARCHITECTURE PATTERN**

```
┌─────────────────────────────────────────────────────────────┐
│                    SunMovement.Web                          │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Areas/Admin   │  │   Areas/Api     │                  │
│  │   (MVC)         │  │   (REST API)    │                  │
│  └─────────────────┘  └─────────────────┘                  │
│  ┌─────────────────────────────────────────┐               │
│  │         Controllers (Main Web)           │               │
│  └─────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                SunMovement.Core                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Domain Models │  │   Interfaces    │                  │
│  └─────────────────┘  └─────────────────┘                  │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   DTOs          │  │  Business Logic │                  │
│  │                 │  │    Services     │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│              SunMovement.Infrastructure                     │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Data Access   │  │  External       │                  │
│  │   Repositories  │  │  Services       │                  │
│  └─────────────────┘  └─────────────────┘                  │
│  ┌─────────────────────────────────────────┐               │
│  │          Database Context               │               │
│  └─────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

## **REORGANIZATION PLAN**

### **PHASE 1: PROJECT CONSOLIDATION**

#### **1.1 Eliminate SunMovement.Api Project**
- [x] Move `ShoppingCartController` to `SunMovement.Web/Areas/Api/Controllers/`
- [ ] Remove `SunMovement.Api` project from solution
- [ ] Update solution file

#### **1.2 Update Solution References**
- [ ] Remove SunMovement.Api project reference
- [ ] Ensure proper dependency chain: Web → Core → Infrastructure

### **PHASE 2: SERVICE LAYER REORGANIZATION**

#### **2.1 Core Services (Business Logic Only)**
**Location:** `SunMovement.Core/Services/`
**Criteria:** Pure business logic, no external dependencies

**Keep in Core:**
- `ProductService.cs` ✅ (Business logic for products)
- `ServiceService.cs` ✅ (Business logic for services)

**Move to Infrastructure:**
- `EmailService.cs` ❌ (Uses SMTP - external dependency)
- `FileUploadService.cs` ❌ (Uses file system - external dependency)
- `CacheService.cs` ❌ (Uses caching infrastructure)

#### **2.2 Infrastructure Services (External Dependencies)**
**Location:** `SunMovement.Infrastructure/Services/`
**Criteria:** Depends on external systems, databases, file systems, email, etc.

**Current Infrastructure Services:**
- `EmailVerificationService.cs` ✅ (Uses database)
- `MemoryCacheService.cs` ✅ (Uses caching)

**Services to Move Here:**
- `EmailService.cs` (SMTP dependency)
- `FileUploadService.cs` (File system dependency)
- `CacheService.cs` (Caching dependency)

### **PHASE 3: INTERFACE ORGANIZATION**

#### **3.1 Core Interfaces**
**Location:** `SunMovement.Core/Interfaces/`
All service interfaces remain in Core regardless of implementation location

**Current Interfaces:**
- `IProductService`
- `IServiceService`
- `IEmailService`
- `IFileUploadService`
- `ICacheService`
- `IEmailVerificationService`

### **PHASE 4: CONTROLLER REORGANIZATION**

#### **4.1 Web Controllers (MVC)**
**Location:** `SunMovement.Web/Controllers/`
**Purpose:** Server-side rendered pages

**Current Controllers:**
- `HomeController.cs` ✅
- `AccountController.cs` ✅
- `ProductsController.cs` ✅
- `ServicesController.cs` ✅
- `CartController.cs` ✅

#### **4.2 API Controllers (REST)**
**Location:** `SunMovement.Web/Areas/Api/Controllers/`
**Purpose:** REST API endpoints for frontend

**Current API Controllers:**
- `AuthController.cs` ✅
- `ProductsController.cs` ✅
- `ContactController.cs` ✅
- `EventsController.cs` ✅
- `FAQsController.cs` ✅
- `OrdersController.cs` ✅
- `ServicesController.cs` ✅
- `UploadsController.cs` ✅
- `ShoppingCartController.cs` ✅ (moved from SunMovement.Api)

#### **4.3 Admin Controllers (MVC)**
**Location:** `SunMovement.Web/Areas/Admin/Controllers/`
**Purpose:** Admin interface

**Current Admin Controllers:**
- `AdminDashboardController.cs` ✅

### **PHASE 5: REPOSITORY PATTERN CLEANUP**

#### **5.1 Repository Interfaces**
**Location:** `SunMovement.Core/Interfaces/`
- `IRepository<T>`
- `IUnitOfWork`
- `IProductRepository`
- `IServiceRepository`

#### **5.2 Repository Implementations**
**Location:** `SunMovement.Infrastructure/Repositories/`
- `Repository<T>`
- `UnitOfWork`
- `ProductRepository`
- `ServiceRepository`
- `OrderRepository`

## **IMPLEMENTATION STEPS**

### **Step 1: Service Migration**
1. Move EmailService to Infrastructure
2. Move FileUploadService to Infrastructure
3. Move CacheService to Infrastructure
4. Update namespaces
5. Update dependency injection in Program.cs

### **Step 2: Remove Redundant Project**
1. Remove SunMovement.Api project
2. Update solution file
3. Fix any remaining references

### **Step 3: Build and Test**
1. Ensure all projects build successfully
2. Test API endpoints
3. Test admin interface
4. Test email verification system

### **Step 4: Documentation Update**
1. Update README.md with new structure
2. Update API documentation
3. Create architectural decision records

## **EXPECTED BENEFITS**

1. **Clear Separation of Concerns**
   - Business logic in Core
   - Infrastructure concerns in Infrastructure
   - Presentation logic in Web

2. **Improved Maintainability**
   - Single project for all web concerns
   - Clear dependency direction
   - Consistent organization

3. **Better Testability**
   - Pure business logic isolated
   - Infrastructure abstractions properly placed
   - Clear interfaces for mocking

4. **Standard .NET Architecture**
   - Follows established patterns
   - Easier for developers to understand
   - Better integration with .NET ecosystem

## **VALIDATION CRITERIA**

✅ **Architecture Compliance**
- Core has no infrastructure dependencies
- Infrastructure implements Core interfaces
- Web depends only on Core interfaces

✅ **Build Success**
- All projects compile without errors
- No circular dependencies
- Proper namespace organization

✅ **Functionality Preservation**
- All API endpoints work
- Admin interface functional
- Email verification system operational
- Shopping cart system functional

✅ **Code Quality**
- No code duplication
- Consistent naming conventions
- Proper error handling
- Clean dependency injection
