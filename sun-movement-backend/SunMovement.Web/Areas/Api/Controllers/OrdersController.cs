using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Web.Areas.Api.Models;
using SunMovement.Infrastructure.Data;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;
        private readonly IVNPayService _vnPayService;

        public OrdersController(IUnitOfWork unitOfWork, IEmailService emailService, IVNPayService vnPayService)
        {
            _unitOfWork = unitOfWork;
            _emailService = emailService;
            _vnPayService = vnPayService;
        }

        // POST: api/orders/checkout
        [HttpPost("checkout")]
        [AllowAnonymous] // Allow anonymous access for testing
        public async Task<ActionResult<object>> ProcessCheckout(CheckoutCreateModel checkoutModel)
        {
            try
            {
                Console.WriteLine("[CHECKOUT DEBUG] ProcessCheckout started");
                
                if (!ModelState.IsValid)
                {
                    Console.WriteLine("[CHECKOUT DEBUG] ModelState invalid");
                    return BadRequest(ModelState);
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                string cartUserId = userId ?? "guest-session"; // Use guest session for cart
                string? orderUserId = userId; // Keep null for order if anonymous
                
                // Debug logging
                Console.WriteLine($"[CHECKOUT DEBUG] UserId: {userId}");
                Console.WriteLine($"[CHECKOUT DEBUG] CartUserId: {cartUserId}");
                Console.WriteLine($"[CHECKOUT DEBUG] OrderUserId: {orderUserId}");

                // Get user's cart
                var cartService = HttpContext.RequestServices.GetRequiredService<IShoppingCartService>();
                var cart = await cartService.GetCartWithItemsAsync(cartUserId);
                
                if (cart == null || !cart.Items.Any())
                {
                    Console.WriteLine("[CHECKOUT DEBUG] Cart is empty");
                    return BadRequest("Cart is empty");
                }

                Console.WriteLine($"[CHECKOUT DEBUG] Cart has {cart.Items.Count} items");                // Validate product availability and calculate total
                decimal totalAmount = 0;
                var orderItems = new List<OrderItem>();

                foreach (var cartItem in cart.Items)
                {
                    if (cartItem.ProductId.HasValue)
                    {
                        var product = await _unitOfWork.Products.GetByIdAsync(cartItem.ProductId.Value);
                        
                        if (product == null)
                        {
                            Console.WriteLine($"[CHECKOUT DEBUG] Product not found: {cartItem.ProductId}");
                            return BadRequest($"Product with ID {cartItem.ProductId} not found");
                        }

                        var unitPrice = product.DiscountPrice ?? product.Price;
                        var subtotal = unitPrice * cartItem.Quantity;
                        totalAmount += subtotal;                        orderItems.Add(new OrderItem
                        {
                            ProductId = cartItem.ProductId.Value,
                            ProductName = product.Name,
                            Quantity = cartItem.Quantity,
                            UnitPrice = unitPrice,
                            Subtotal = subtotal
                        });
                    }
                }                // Create the order first (without items)
                var order = new Order
                {
                    UserId = orderUserId,
                    Email = checkoutModel.ContactInfo.Email,
                    PhoneNumber = checkoutModel.ContactInfo.Phone,
                    ShippingAddress = $"{checkoutModel.ShippingAddress.AddressLine1}, {checkoutModel.ShippingAddress.AddressLine2}, {checkoutModel.ShippingAddress.City}, {checkoutModel.ShippingAddress.Province}",
                    OrderDate = DateTime.UtcNow,
                    Status = OrderStatus.Pending,
                    TotalAmount = totalAmount,
                    PaymentMethod = checkoutModel.PaymentMethod,
                    Notes = checkoutModel.ContactInfo.Notes,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                Console.WriteLine($"[CHECKOUT DEBUG] Order created with {orderItems.Count} items, total: {totalAmount}");                // Add and save order first to get ID using direct DbContext approach
                var dbContext = HttpContext.RequestServices.GetRequiredService<ApplicationDbContext>();
                dbContext.Orders.Add(order);
                await dbContext.SaveChangesAsync();
                
                Console.WriteLine($"[CHECKOUT DEBUG] Order saved with ID: {order.Id}");

                // Now add OrderItems with the correct OrderId
                foreach (var item in orderItems)
                {
                    item.OrderId = order.Id;
                }
                
                dbContext.OrderItems.AddRange(orderItems);
                await dbContext.SaveChangesAsync();
                
                Console.WriteLine($"[CHECKOUT DEBUG] Order and items saved successfully");

                // Clear the cart after successful order
                await cartService.ClearCartAsync(cartUserId);

                Console.WriteLine($"[CHECKOUT DEBUG] Payment method: {checkoutModel.PaymentMethod}");

                // Handle VNPay payment
                if (checkoutModel.PaymentMethod.Equals("vnpay", StringComparison.OrdinalIgnoreCase) || 
                    checkoutModel.PaymentMethod.Equals("vnpay_qr", StringComparison.OrdinalIgnoreCase))
                {
                    try
                    {
                        Console.WriteLine("[CHECKOUT DEBUG] Creating VNPay payment URL");
                        var paymentUrl = await _vnPayService.CreatePaymentUrl(order, HttpContext);
                        Console.WriteLine($"[CHECKOUT DEBUG] VNPay payment URL created: {paymentUrl}");
                        
                        // Send confirmation email (optional)
                        try
                        {
                            await _emailService.SendOrderConfirmationAsync(order);
                            Console.WriteLine("[CHECKOUT DEBUG] Confirmation email sent");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"[EMAIL ERROR] {ex.Message}");
                        }

                        return Ok(new { 
                            success = true, 
                            order = order,
                            paymentUrl = paymentUrl
                        });
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[VNPAY ERROR] {ex.Message}");
                        return StatusCode(500, new { 
                            success = false, 
                            error = "Failed to create VNPay payment URL", 
                            message = ex.Message 
                        });
                    }
                }

                // Send confirmation email (optional)
                try
                {
                    await _emailService.SendOrderConfirmationAsync(order);
                    Console.WriteLine("[CHECKOUT DEBUG] Confirmation email sent");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[EMAIL ERROR] {ex.Message}");
                }

                Console.WriteLine("[CHECKOUT DEBUG] Returning success response");
                return Ok(new { success = true, order = order });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CHECKOUT ERROR] {ex.Message}");
                Console.WriteLine($"[CHECKOUT ERROR] StackTrace: {ex.StackTrace}");
                return StatusCode(500, new { 
                    success = false, 
                    error = "Internal server error", 
                    message = ex.Message 
                });
            }
        }        // POST: api/orders/test-checkout
        [HttpPost("test-checkout")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> TestCheckout(TestCheckoutModel testModel)
        {
            try
            {
                Console.WriteLine("[TEST CHECKOUT] Starting test checkout");
                
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create test order items with navigation property approach
                var orderItems = new List<OrderItem>
                {
                    new OrderItem
                    {
                        ProductId = 1,
                        ProductName = "Test Product 1",
                        Quantity = 1,
                        UnitPrice = 299000,
                        Subtotal = 299000
                    },
                    new OrderItem
                    {
                        ProductId = 2,
                        ProductName = "Test Product 2", 
                        Quantity = 1,
                        UnitPrice = 199000,
                        Subtotal = 199000
                    }
                };

                decimal totalAmount = orderItems.Sum(x => x.Subtotal);

                // Create the order with items using navigation property
                var order = new Order
                {
                    UserId = null, // Test order
                    Email = testModel.ContactInfo.Email,
                    PhoneNumber = testModel.ContactInfo.Phone,
                    ShippingAddress = $"{testModel.ShippingAddress.AddressLine1}, {testModel.ShippingAddress.City}, {testModel.ShippingAddress.Province}",
                    OrderDate = DateTime.UtcNow,
                    Status = OrderStatus.Pending,
                    TotalAmount = totalAmount,
                    PaymentMethod = testModel.PaymentMethod,
                    Notes = testModel.ContactInfo.Notes + " [TEST ORDER]",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Items = orderItems
                };

                // Add order (EF will handle OrderItems automatically through navigation property)
                await _unitOfWork.Orders.AddAsync(order);
                await _unitOfWork.CompleteAsync();
                
                Console.WriteLine($"[TEST CHECKOUT] Order saved with ID: {order.Id}");

                // Handle VNPay payment
                if (testModel.PaymentMethod.Equals("vnpay", StringComparison.OrdinalIgnoreCase))
                {
                    try
                    {
                        Console.WriteLine("[TEST CHECKOUT] Creating VNPay payment URL");
                        var paymentUrl = await _vnPayService.CreatePaymentUrl(order, HttpContext);
                        Console.WriteLine($"[TEST CHECKOUT] VNPay payment URL created: {paymentUrl}");
                        
                        return Ok(new { 
                            success = true, 
                            order = new {
                                id = order.Id,
                                totalAmount = order.TotalAmount,
                                status = order.Status.ToString()
                            },
                            paymentUrl = paymentUrl
                        });
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[TEST VNPAY ERROR] {ex.Message}");
                        return StatusCode(500, new { 
                            success = false, 
                            error = "Failed to create VNPay payment URL", 
                            message = ex.Message 
                        });
                    }
                }

                Console.WriteLine("[TEST CHECKOUT] Returning success response");
                return Ok(new { success = true, order = new {
                    id = order.Id,
                    totalAmount = order.TotalAmount,
                    status = order.Status.ToString()
                }});
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[TEST CHECKOUT ERROR] {ex.Message}");
                return StatusCode(500, new { 
                    success = false, 
                    error = "Internal server error", 
                    message = ex.Message 
                });
            }
        }

        // GET: api/orders/vnpay-return
        [HttpGet("vnpay-return")]
        [AllowAnonymous]
        public async Task<IActionResult> VNPayReturn()
        {
            try
            {
                Console.WriteLine("[VNPAY RETURN] Processing VNPay return callback");
                
                var result = await _vnPayService.ProcessPaymentReturn(Request.Query);
                
                Console.WriteLine($"[VNPAY RETURN] Payment result: {result.IsSuccess}, OrderId: {result.OrderId}");
                
                if (result.IsSuccess && int.TryParse(result.OrderId, out var orderId))
                {                    // Update order status
                    var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
                    if (order != null)
                    {
                        order.Status = OrderStatus.Paid;
                        order.PaymentDate = result.PaymentDate;
                        order.TransactionId = result.TransactionId;
                        order.IsPaid = true;
                        
                        await _unitOfWork.CompleteAsync();
                        
                        Console.WriteLine($"[VNPAY RETURN] Order {orderId} updated to Paid status");
                    }
                    
                    // Redirect to success page
                    return Redirect($"http://localhost:3000/checkout/success?orderId={orderId}&paymentMethod=vnpay");
                }
                else
                {
                    Console.WriteLine($"[VNPAY RETURN] Payment failed: {result.Message}");
                    // Redirect to failure page
                    return Redirect($"http://localhost:3000/checkout/failed?error={Uri.EscapeDataString(result.Message)}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[VNPAY RETURN ERROR] {ex.Message}");
                return Redirect($"http://localhost:3000/checkout/failed?error={Uri.EscapeDataString("Payment processing error")}");
            }
        }

        // POST: api/orders/vnpay-ipn
        [HttpPost("vnpay-ipn")]
        [AllowAnonymous]
        public async Task<IActionResult> VNPayIPN()
        {
            try
            {
                Console.WriteLine("[VNPAY IPN] Processing VNPay IPN callback");
                
                // Validate the callback
                var isValid = await _vnPayService.ValidatePaymentCallback(Request.Query);
                
                if (!isValid)
                {
                    Console.WriteLine("[VNPAY IPN] Invalid callback signature");
                    return Ok(new { RspCode = "97", Message = "Invalid signature" });
                }
                
                // Process the payment result
                var result = await _vnPayService.ProcessPaymentReturn(Request.Query);
                
                Console.WriteLine($"[VNPAY IPN] Payment result: {result.IsSuccess}, OrderId: {result.OrderId}");
                
                if (result.IsSuccess && int.TryParse(result.OrderId, out var orderId))
                {
                    // Update order status
                    var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
                    if (order != null)
                    {                        if (order.Status == OrderStatus.Pending)
                        {
                            order.Status = OrderStatus.Paid;
                            order.PaymentDate = result.PaymentDate;
                            order.TransactionId = result.TransactionId;
                            order.IsPaid = true;
                            
                            await _unitOfWork.CompleteAsync();
                            
                            Console.WriteLine($"[VNPAY IPN] Order {orderId} updated to Paid status");
                            
                            return Ok(new { RspCode = "00", Message = "Confirm Success" });
                        }
                        else
                        {
                            Console.WriteLine($"[VNPAY IPN] Order {orderId} already processed");
                            return Ok(new { RspCode = "02", Message = "Order already confirmed" });
                        }
                    }
                    else
                    {
                        Console.WriteLine($"[VNPAY IPN] Order {orderId} not found");
                        return Ok(new { RspCode = "01", Message = "Order not found" });
                    }
                }
                else
                {
                    Console.WriteLine($"[VNPAY IPN] Payment failed: {result.Message}");
                    return Ok(new { RspCode = "00", Message = "Payment failed but confirmed" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[VNPAY IPN ERROR] {ex.Message}");
                return Ok(new { RspCode = "99", Message = "Unknown error" });
            }
        }

        // GET: api/orders/vnpay-ipn (VNPay also sends GET requests for IPN)
        [HttpGet("vnpay-ipn")]
        [AllowAnonymous]
        public async Task<IActionResult> VNPayIPNGet()
        {
            return await VNPayIPN();
        }

        // GET: api/orders/test-endpoint
        [HttpGet("test-endpoint")]
        [AllowAnonymous]
        public IActionResult TestEndpoint()
        {
            return Ok(new { 
                message = "Orders API is working", 
                timestamp = DateTime.UtcNow,
                vnpayConfigured = _vnPayService != null
            });
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<object>> GetUserOrders()
        {
            try
            {
                Console.WriteLine("[ORDERS API] GetUserOrders called");
                
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                if (string.IsNullOrEmpty(userId))
                {
                    Console.WriteLine("[ORDERS API] User not authenticated");
                    return BadRequest(new { success = false, error = "User not authenticated" });
                }

                Console.WriteLine($"[ORDERS API] Getting orders for user: {userId}");

                var dbContext = HttpContext.RequestServices.GetRequiredService<ApplicationDbContext>();
                var orders = await dbContext.Orders
                    .Where(o => o.UserId == userId)
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

                Console.WriteLine($"[ORDERS API] Found {orders.Count} orders");

                var orderDtos = orders.Select(order => new
                {
                    orderId = order.Id.ToString(),
                    orderDate = order.OrderDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    status = order.Status.ToString().ToLower(),
                    totalAmount = order.TotalAmount,
                    email = order.Email,
                    phoneNumber = order.PhoneNumber,
                    shippingAddress = order.ShippingAddress,
                    paymentMethod = order.PaymentMethod,
                    paymentStatus = order.PaymentStatus.ToString().ToLower(),
                    trackingNumber = order.TrackingNumber,
                    notes = order.Notes,
                    orderItems = order.OrderItems.Select(item => new
                    {
                        id = item.Id.ToString(),
                        productId = item.ProductId,
                        productName = item.ProductName,
                        quantity = item.Quantity,
                        unitPrice = item.UnitPrice,
                        subtotal = item.Subtotal,
                        size = (string?)null, // Add these fields to OrderItem model if needed
                        color = (string?)null // Add these fields to OrderItem model if needed
                    }).ToList()
                }).ToList();

                return Ok(new { success = true, orders = orderDtos });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ORDERS API ERROR] {ex.Message}");
                return StatusCode(500, new { success = false, error = "Internal server error" });
            }
        }

        // GET: api/orders/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetOrderById(string id)
        {
            try
            {
                Console.WriteLine($"[ORDER DETAIL API] GetOrderById called with ID: {id}");
                
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                if (string.IsNullOrEmpty(userId))
                {
                    Console.WriteLine("[ORDER DETAIL API] User not authenticated");
                    return BadRequest(new { success = false, error = "User not authenticated" });
                }

                if (!int.TryParse(id, out int orderId))
                {
                    Console.WriteLine($"[ORDER DETAIL API] Invalid order ID format: {id}");
                    return BadRequest(new { success = false, error = "Invalid order ID" });
                }

                var dbContext = HttpContext.RequestServices.GetRequiredService<ApplicationDbContext>();
                var order = await dbContext.Orders
                    .Where(o => o.Id == orderId && o.UserId == userId)
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .FirstOrDefaultAsync();

                if (order == null)
                {
                    Console.WriteLine($"[ORDER DETAIL API] Order not found: {orderId}");
                    return NotFound(new { success = false, error = "Order not found" });
                }

                Console.WriteLine($"[ORDER DETAIL API] Order found: {orderId}");

                var orderDto = new
                {
                    orderId = order.Id.ToString(),
                    orderDate = order.OrderDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    status = order.Status.ToString().ToLower(),
                    totalAmount = order.TotalAmount,
                    email = order.Email,
                    phoneNumber = order.PhoneNumber,
                    shippingAddress = order.ShippingAddress,
                    paymentMethod = order.PaymentMethod,
                    paymentStatus = order.PaymentStatus.ToString().ToLower(),
                    trackingNumber = order.TrackingNumber,
                    notes = order.Notes,
                    customerName = $"{order.Email}", // You might want to add a proper customer name field
                    estimatedDelivery = (string?)null, // Add if you have this field
                    orderItems = order.OrderItems.Select(item => new
                    {
                        id = item.Id.ToString(),
                        productId = item.ProductId,
                        productName = item.ProductName,
                        quantity = item.Quantity,
                        unitPrice = item.UnitPrice,
                        subtotal = item.Subtotal,
                        size = (string?)null, // Add these fields to OrderItem model if needed
                        color = (string?)null // Add these fields to OrderItem model if needed
                    }).ToList()
                };

                return Ok(new { success = true, order = orderDto });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ORDER DETAIL API ERROR] {ex.Message}");
                return StatusCode(500, new { success = false, error = "Internal server error" });
            }
        }

        // POST: api/orders/simple-test
        [HttpPost("simple-test")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> SimpleTest()
        {
            try
            {
                Console.WriteLine("[SIMPLE TEST] Creating simple order without items");
                
                var order = new Order
                {
                    UserId = null,
                    Email = "test@example.com",
                    PhoneNumber = "0123456789",
                    ShippingAddress = "123 Test Street, Test City",
                    OrderDate = DateTime.UtcNow,
                    Status = OrderStatus.Pending,
                    TotalAmount = 100000,
                    PaymentMethod = "cod",
                    Notes = "Simple test order",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _unitOfWork.Orders.AddAsync(order);
                await _unitOfWork.CompleteAsync();
                
                Console.WriteLine($"[SIMPLE TEST] Order created with ID: {order.Id}");
                
                return Ok(new { 
                    success = true, 
                    orderId = order.Id,
                    message = "Simple order created successfully"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SIMPLE TEST ERROR] {ex.Message}");
                Console.WriteLine($"[SIMPLE TEST ERROR] Inner Exception: {ex.InnerException?.Message}");
                return StatusCode(500, new { 
                    success = false, 
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }

        // POST: api/orders/debug-checkout
        [HttpPost("debug-checkout")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> DebugCheckout(TestCheckoutModel testModel)
        {
            try
            {
                Console.WriteLine("[DEBUG CHECKOUT] Starting debug checkout");
                
                // Get DbContext directly for debugging
                var dbContext = HttpContext.RequestServices.GetRequiredService<ApplicationDbContext>();
                
                // Create order first
                var order = new Order
                {
                    UserId = null,
                    Email = testModel.ContactInfo.Email,
                    PhoneNumber = testModel.ContactInfo.Phone,
                    ShippingAddress = $"{testModel.ShippingAddress.AddressLine1}, {testModel.ShippingAddress.City}",
                    OrderDate = DateTime.UtcNow,
                    Status = OrderStatus.Pending,
                    TotalAmount = 498000,
                    PaymentMethod = testModel.PaymentMethod,
                    Notes = testModel.ContactInfo.Notes + " [DEBUG]",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                // Add order and save to get ID
                dbContext.Orders.Add(order);
                await dbContext.SaveChangesAsync();
                
                Console.WriteLine($"[DEBUG CHECKOUT] Order created with ID: {order.Id}");                // Get actual product IDs from database
                var products = await dbContext.Products.Take(1).ToListAsync();
                if (products.Count < 1)
                {
                    return BadRequest("No products in database for testing");
                }

                Console.WriteLine($"[DEBUG CHECKOUT] Using product: {products[0].Id}");

                // Create order items with real ProductIds
                var orderItems = new List<OrderItem>
                {
                    new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = products[0].Id,
                        ProductName = products[0].Name,
                        Quantity = 2,
                        UnitPrice = products[0].DiscountPrice ?? products[0].Price,
                        Subtotal = (products[0].DiscountPrice ?? products[0].Price) * 2
                    }
                };// Update order total amount
                order.TotalAmount = orderItems.Sum(x => x.Subtotal);
                dbContext.Orders.Update(order);

                // Add order items
                dbContext.OrderItems.AddRange(orderItems);
                await dbContext.SaveChangesAsync();
                
                Console.WriteLine($"[DEBUG CHECKOUT] Order items saved: {orderItems.Count}");

                return Ok(new { 
                    success = true, 
                    orderId = order.Id,
                    itemCount = orderItems.Count,
                    message = "Debug checkout completed successfully"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DEBUG CHECKOUT ERROR] {ex.Message}");
                Console.WriteLine($"[DEBUG CHECKOUT ERROR] Inner: {ex.InnerException?.Message}");
                Console.WriteLine($"[DEBUG CHECKOUT ERROR] Stack: {ex.StackTrace}");
                return StatusCode(500, new { 
                    success = false, 
                    error = ex.Message,
                    innerError = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        // POST: api/orders/debug-vnpay-url
        [HttpPost("debug-vnpay-url")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> DebugVNPayUrl(TestCheckoutModel testModel)
        {
            try
            {
                Console.WriteLine("[DEBUG VNPAY] Creating test order for VNPay URL debug");
                
                // Create a test order
                var testOrder = new Order
                {
                    Id = 999, // Test ID
                    UserId = null,
                    Email = testModel.ContactInfo.Email,
                    PhoneNumber = testModel.ContactInfo.Phone,
                    ShippingAddress = $"{testModel.ShippingAddress.AddressLine1}, {testModel.ShippingAddress.City}",
                    OrderDate = DateTime.UtcNow,
                    Status = OrderStatus.Pending,
                    TotalAmount = 100000, // 100,000 VND
                    PaymentMethod = "vnpay",
                    Notes = "Debug VNPay URL Test",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                Console.WriteLine($"[DEBUG VNPAY] Test order created: {testOrder.Id}, Amount: {testOrder.TotalAmount}");

                // Get VNPay configuration for debugging
                var vnpayConfig = new
                {
                    TmnCode = HttpContext.RequestServices.GetRequiredService<IConfiguration>()["VNPay:TmnCode"],
                    BaseUrl = HttpContext.RequestServices.GetRequiredService<IConfiguration>()["VNPay:BaseUrl"],
                    ReturnUrl = HttpContext.RequestServices.GetRequiredService<IConfiguration>()["VNPay:ReturnUrl"],
                    HashSecret = HttpContext.RequestServices.GetRequiredService<IConfiguration>()["VNPay:HashSecret"]?.Substring(0, 10) + "...", // Hide full secret
                    IpnUrl = HttpContext.RequestServices.GetRequiredService<IConfiguration>()["VNPay:IpnUrl"]
                };

                Console.WriteLine($"[DEBUG VNPAY] VNPay Config: {System.Text.Json.JsonSerializer.Serialize(vnpayConfig)}");

                // Create VNPay URL
                var paymentUrl = await _vnPayService.CreatePaymentUrl(testOrder, HttpContext);
                
                Console.WriteLine($"[DEBUG VNPAY] Payment URL created: {paymentUrl}");

                // Parse URL to show parameters
                var uri = new Uri(paymentUrl);
                var queryParams = HttpUtility.ParseQueryString(uri.Query);
                var urlParams = new Dictionary<string, string>();
                
                foreach (string key in queryParams.Keys)
                {
                    if (key != null)
                    {
                        urlParams[key] = queryParams[key] ?? "";
                    }
                }

                return Ok(new
                {
                    success = true,
                    paymentUrl = paymentUrl,
                    vnpayConfig = vnpayConfig,
                    urlParameters = urlParams,
                    testOrder = new
                    {
                        id = testOrder.Id,
                        amount = testOrder.TotalAmount,
                        amountInCents = (long)(testOrder.TotalAmount * 100)
                    },
                    debugInfo = new
                    {
                        clientIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
                        userAgent = HttpContext.Request.Headers["User-Agent"].ToString(),
                        timestamp = DateTime.Now.ToString("yyyyMMddHHmmss")
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DEBUG VNPAY ERROR] {ex.Message}");
                Console.WriteLine($"[DEBUG VNPAY ERROR] Stack: {ex.StackTrace}");
                return StatusCode(500, new
                {
                    success = false,
                    error = ex.Message,
                    innerError = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }
    }
}
