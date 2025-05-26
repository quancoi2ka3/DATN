# Sun Movement Backend

This is the backend API and admin interface for the Sun Movement application. It provides all the necessary functionality to power the Sun Movement frontend, including user authentication, product management, service management, orders, events, FAQs, and contact messaging.

## Project Structure (Updated)

The project now follows a clean, standardized ASP.NET Core MVC architecture with improved organization:

```
SunMovement.Web/ - Main web application
├── Areas/ - Feature-based areas of the application
│   ├── Admin/ - Admin features
│   │   ├── Controllers/ - Admin-specific controllers
│   │   ├── Models/ - Admin-specific view models
│   │   └── Views/ - Admin-specific views with dedicated layouts
│   └── Api/ - API endpoints
│       ├── Controllers/ - API controllers with [Area] attributes
│       └── Models/ - API request/response models and mock services
├── Controllers/ - Main application controllers (non-area)
├── Models/ - Shared view models
├── Views/ - MVC views
└── wwwroot/ - Static assets

SunMovement.Core/ - Core domain models and business logic
├── DTOs/ - Data Transfer Objects
├── Interfaces/ - Service and repository interfaces
├── Models/ - Domain models
└── Services/ - Business logic services

SunMovement.Infrastructure/ - Data access and external services
├── Data/ - Database context and configuration
├── Migrations/ - EF Core migrations
└── Repositories/ - Repository implementations

SunMovement.Tests/ - Contains unit tests for the application
```

### Areas

The application is organized into areas for better separation of concerns:

#### Admin Area

Contains all admin-related functionality for managing the site:
- Dashboard for analytics and monitoring
- Products administration
- Services administration
- Orders management
- Events management
- FAQs management
- Contact message management
- Admin dashboard

#### API Area

Contains all API controllers for the frontend:
- Authentication API
- Products API
- Services API
- Orders API
- Events API
- FAQs API
- Contact API
- Uploads API

## Features

- **Authentication**: JWT-based authentication for securing API endpoints
- **User Management**: User registration, login, and role-based authorization
- **Product Management**: CRUD operations for products, categorized as Sportswear and Supplements
- **Service Management**: CRUD operations for services, categorized as Yoga, Strength, and Calisthenics
- **Order Processing**: Order creation, updating, and tracking
- **Event Management**: Creation and management of events
- **FAQ Management**: Creation and management of FAQs
- **Contact Messaging**: Handling of contact form submissions
- **File Upload**: Image upload functionality for products, services, and events
- **Email Notifications**: Email notifications for orders and contact messages

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and receive JWT token

### Products

- `GET /api/products`: Get all products
- `GET /api/products/{id}`: Get product by ID
- `GET /api/products/category/{category}`: Get products by category (Sportswear, Supplements)
- `GET /api/products/featured`: Get featured products
- `GET /api/products/search?q={query}`: Search products
- `POST /api/products`: Create a new product (Admin only)
- `PUT /api/products/{id}`: Update a product (Admin only)
- `DELETE /api/products/{id}`: Delete a product (Admin only)

### Services

- `GET /api/services`: Get all services
- `GET /api/services/{id}`: Get service by ID
- `GET /api/services/{id}/schedules`: Get service with schedules
- `GET /api/services/type/{type}`: Get services by type (Yoga, Strength, Calisthenics)
- `POST /api/services`: Create a new service (Admin only)
- `PUT /api/services/{id}`: Update a service (Admin only)
- `DELETE /api/services/{id}`: Delete a service (Admin only)

### Orders

- `GET /api/orders`: Get all orders (Admin) or user's orders (Customer)
- `GET /api/orders/{id}`: Get order by ID
- `POST /api/orders`: Create a new order
- `PUT /api/orders/{id}/status`: Update order status (Admin only)
- `PUT /api/orders/{id}/tracking`: Update tracking number (Admin only)
- `PUT /api/orders/{id}/payment`: Update payment information (Admin only)

### Events

- `GET /api/events`: Get all events
- `GET /api/events/{id}`: Get event by ID
- `GET /api/events/featured`: Get featured events
- `GET /api/events/upcoming`: Get upcoming events
- `POST /api/events`: Create a new event (Admin only)
- `PUT /api/events/{id}`: Update an event (Admin only)
- `DELETE /api/events/{id}`: Delete an event (Admin only)

### FAQs

- `GET /api/faqs`: Get all FAQs
- `GET /api/faqs/{id}`: Get FAQ by ID
- `GET /api/faqs/category/{category}`: Get FAQs by category
- `POST /api/faqs`: Create a new FAQ (Admin only)
- `PUT /api/faqs/{id}`: Update a FAQ (Admin only)
- `DELETE /api/faqs/{id}`: Delete a FAQ (Admin only)

### Contact

- `GET /api/contact`: Get all contact messages (Admin only)
- `GET /api/contact/{id}`: Get contact message by ID (Admin only)
- `GET /api/contact/unread`: Get unread contact messages (Admin only)
- `POST /api/contact`: Send a contact message
- `PUT /api/contact/{id}/read`: Mark a contact message as read (Admin only)
- `DELETE /api/contact/{id}`: Delete a contact message (Admin only)

### Uploads

- `POST /api/uploads/product`: Upload a product image (Admin only)
- `POST /api/uploads/service`: Upload a service image (Admin only)
- `POST /api/uploads/event`: Upload an event image (Admin only)
- `DELETE /api/uploads?filePath={path}`: Delete an uploaded file (Admin only)

## Getting Started

### Prerequisites

- .NET 9.0 SDK
- SQL Server

### Setup

1. Clone the repository
2. Update the connection string in `appsettings.json` if needed
3. Run the following commands:

```
dotnet restore
dotnet ef database update
dotnet run --project SunMovement.Web
```

4. Access the API at `http://localhost:5203`
5. Access the Swagger documentation at `http://localhost:5203/swagger`

## Authentication

The API uses JWT for authentication. To access protected endpoints:

1. Register a user or login with an existing user
2. Get the JWT token from the response
3. Include the token in the `Authorization` header as `Bearer {token}`

## Admin Access

An admin user is automatically created when the database is seeded:

- Email: admin@sunmovement.com
- Password: Admin@123

## Model Management

### Entity Framework Models

The application uses Entity Framework Core with a Code-First approach for database management. Core models are defined in the `SunMovement.Core/Models` directory and mapped to database tables through the `ApplicationDbContext` in `SunMovement.Infrastructure/Data`.

### Making Model Changes

When making changes to model classes, follow these steps to ensure database synchronization:

1. **Modify model classes**
   - Add new properties
   - Rename existing properties (must update all references in views/controllers)
   - Add computed properties using expression bodies (no database impact)

2. **Create new migration**
   ```
   dotnet ef migrations add MigrationName --project SunMovement.Infrastructure --startup-project SunMovement.Web
   ```

3. **Apply migration to database**
   ```
   dotnet ef database update --project SunMovement.Infrastructure --startup-project SunMovement.Web
   ```

4. **Verify view compatibility**
   - Check all views that reference changed model properties
   - Update property references in view files (.cshtml)
   - Add correct null handling for nullable properties

### Common Model Patterns

- **Navigation Properties**: Use `virtual` keyword for Entity Framework navigation properties
- **Default Values**: Set default values in property initialization
- **Computed Properties**: Add non-persisted computed properties using expression-body properties
- **Enum Properties**: Use strongly-typed enums for categorical data

### Handling TimeSpan Properties

When working with TimeSpan properties:
- In model: Use nullable TimeSpan (`TimeSpan?`) if appropriate
- In views: Format using `@value?.ToString(@"hh\:mm")` with escaped format string
- Include null-conditional operators (`?.`) to avoid null reference exceptions

### Enum Handling in Views

When displaying enum values in views:
- Always call `.ToString()` on enum properties
- For dropdown lists, use `Html.GetEnumSelectList<EnumType>()` for proper rendering
- For display purposes, consider helper methods for custom formatting

## Admin UI Guidelines

### Consistent Layout

All admin views should follow a consistent layout:
- **List View**: Display data in a table with actions (View, Edit, Delete)
- **Details View**: Show full item details with Edit/Back/Delete actions
- **Edit View**: Form with validation for updating an item
- **Create View**: Form with validation for creating new items

### View Conventions

- Use proper formatting for model properties (dates, times, currency, etc.)
- Include proper null handling for all nullable values
- Format enum values properly using `.ToString()`
- Use Bootstrap classes consistently for styling

## Running Tests

```
dotnet test SunMovement.Tests
```

## Deployment

This application can be deployed to any server that supports ASP.NET Core, such as Azure App Service, AWS Elastic Beanstalk, or a traditional web server with .NET installed.

## License

This project is licensed under the MIT License.
