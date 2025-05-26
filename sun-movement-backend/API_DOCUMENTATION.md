# Sun Movement API Documentation

## Project Structure

```
SunMovement.Web/
├── Areas/
│   ├── Admin/
│   │   ├── Controllers/
│   │   │   └── AdminDashboardController.cs
│   │   ├── Models/
│   │   │   └── AdminDashboardViewModel.cs
│   │   └── Views/
│   │       └── AdminDashboard/
│   │           └── Index.cshtml
│   └── Api/
│       ├── Controllers/
│       │   ├── AuthController.cs
│       │   ├── ContactController.cs
│       │   ├── EventsController.cs
│       │   ├── FAQsController.cs
│       │   ├── OrdersController.cs
│       │   ├── ProductsController.cs
│       │   ├── ServicesController.cs
│       │   └── UploadsController.cs
│       └── Models/
│           ├── AuthModels.cs
│           ├── ContactModels.cs
│           ├── MockFileUploadService.cs
│           ├── MockServices.cs
│           ├── OrderModels.cs
│           ├── ProductModels.cs
│           └── UploadModels.cs
├── Controllers/
│   ├── AccountController.cs
│   ├── HomeController.cs
│   └── [other MVC controllers]
└── Views/
    ├── Home/
    │   └── Index.cshtml
    └── [other MVC views]
```

## API Endpoints

### Auth API

- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- GET `/api/auth/current-user` - Get current logged-in user info

### Products API

- GET `/api/products` - Get all products
- GET `/api/products/{id}` - Get a specific product
- POST `/api/products` - Create a new product (admin)
- PUT `/api/products/{id}` - Update a product (admin)
- DELETE `/api/products/{id}` - Delete a product (admin)
- PUT `/api/products/{id}/stock` - Update product stock (admin)

### Services API

- GET `/api/services` - Get all services
- GET `/api/services/{id}` - Get a specific service
- POST `/api/services` - Create a new service (admin)
- PUT `/api/services/{id}` - Update a service (admin)
- DELETE `/api/services/{id}` - Delete a service (admin)

### Contact API

- POST `/api/contact` - Submit a contact form message

### Orders API

- GET `/api/orders` - Get all orders (admin)
- GET `/api/orders/{id}` - Get a specific order
- POST `/api/orders` - Create a new order
- PUT `/api/orders/{id}/status` - Update order status (admin)

### FAQs API

- GET `/api/faqs` - Get all FAQs
- POST `/api/faqs` - Create a new FAQ entry (admin)
- PUT `/api/faqs/{id}` - Update a FAQ entry (admin)
- DELETE `/api/faqs/{id}` - Delete a FAQ entry (admin)

### Events API

- GET `/api/events` - Get all events
- GET `/api/events/{id}` - Get a specific event
- POST `/api/events` - Create a new event (admin)
- PUT `/api/events/{id}` - Update an event (admin)
- DELETE `/api/events/{id}` - Delete an event (admin)

### Uploads API

- POST `/api/uploads/product-image` - Upload a product image (admin)
- POST `/api/uploads/service-image` - Upload a service image (admin)
- POST `/api/uploads/event-image` - Upload an event image (admin)
- DELETE `/api/uploads/{id}` - Delete an uploaded file (admin)

## Authentication

API endpoints are secured using JWT Bearer tokens. Most GET endpoints are publicly accessible, while POST, PUT, and DELETE endpoints typically require authentication and proper authorization.

### Getting a JWT Token

```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

Response will include a JWT token to be used in subsequent requests:

```
{
  "token": "eyJhbG...",
  "expiresAt": "2023-05-20T14:30:00Z"
}
```

### Using the JWT Token

Include the token in the Authorization header of subsequent requests:

```
Authorization: Bearer eyJhbG...
```

## API Development Notes

### Testing in Development

In development, mock services are used for certain operations:
- `NoOpEmailService` for email operations
- `MockFileUploadService` for file uploads

These allow API testing without sending real emails or uploading actual files.

### Production Configuration

When deployed to production, the application uses:
- Real `EmailService` for sending emails
- Real `FileUploadService` for file uploads
