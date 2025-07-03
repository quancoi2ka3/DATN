using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using SunMovement.Core.Models;
using SunMovement.Core.Interfaces;
using SunMovement.Web.ViewModels;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    public class CustomersAdminController : BaseAdminController
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public CustomersAdminController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var customers = new List<ApplicationUser>();
                var allUsers = _userManager.Users.ToList();
                
                foreach (var user in allUsers)
                {
                    if (await _userManager.IsInRoleAsync(user, "Customer"))
                    {
                        customers.Add(user);
                    }
                }

                return View(customers);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CustomersAdmin Index: {ex.Message}");
                TempData["Error"] = "Có lỗi xảy ra khi tải danh sách khách hàng.";
                return View(new List<ApplicationUser>());
            }
        }

        public async Task<IActionResult> Details(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            try
            {
                var customer = await _userManager.FindByIdAsync(id);
                if (customer == null)
                {
                    return NotFound();
                }

                if (!await _userManager.IsInRoleAsync(customer, "Customer"))
                {
                    return NotFound();
                }

                return View(customer);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CustomersAdmin Details: {ex.Message}");
                TempData["Error"] = "Có lỗi xảy ra khi tải thông tin khách hàng.";
                return RedirectToAction(nameof(Index));
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleStatus(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            try
            {
                var customer = await _userManager.FindByIdAsync(id);
                if (customer == null)
                {
                    return NotFound();
                }

                if (!await _userManager.IsInRoleAsync(customer, "Customer"))
                {
                    return NotFound();
                }

                customer.IsActive = !customer.IsActive;
                var result = await _userManager.UpdateAsync(customer);

                if (result.Succeeded)
                {
                    var status = customer.IsActive ? "kích hoạt" : "vô hiệu hóa";
                    TempData["Success"] = $"Đã {status} tài khoản khách hàng thành công.";
                }
                else
                {
                    TempData["Error"] = "Có lỗi xảy ra khi cập nhật trạng thái khách hàng.";
                }

                return RedirectToAction(nameof(Details), new { id });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CustomersAdmin ToggleStatus: {ex.Message}");
                TempData["Error"] = "Có lỗi xảy ra khi cập nhật trạng thái khách hàng.";
                return RedirectToAction(nameof(Index));
            }        }

        public async Task<IActionResult> Analytics()
        {
            try
            {
                var customers = new List<ApplicationUser>();
                var allUsers = _userManager.Users.ToList();
                
                foreach (var user in allUsers)
                {
                    if (await _userManager.IsInRoleAsync(user, "Customer"))
                    {
                        customers.Add(user);
                    }
                }

                var analyticsViewModel = new CustomerAnalyticsViewModel
                {
                    TotalCustomers = customers.Count,
                    ActiveCustomers = customers.Count(c => c.IsActive),
                    InactiveCustomers = customers.Count(c => !c.IsActive),
                    NewCustomersThisMonth = customers.Count(c => c.CreatedAt >= DateTime.UtcNow.AddDays(-30)),
                    NewCustomersThisWeek = customers.Count(c => c.CreatedAt >= DateTime.UtcNow.AddDays(-7)),
                    CustomersWithOrders = GetRandomStat(20, customers.Count),
                    AverageAge = 28,
                    RecentCustomers = customers.OrderByDescending(c => c.CreatedAt).Take(10).ToList(),
                    MonthlyRegistrations = GetMonthlyRegistrations(customers)
                };

                return View(analyticsViewModel);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Analytics: {ex.Message}");
                TempData["Error"] = "Có lỗi xảy ra khi tải thống kê khách hàng.";
                return RedirectToAction(nameof(Index));
            }
        }

        private static List<MonthlyRegistrationData> GetMonthlyRegistrations(List<ApplicationUser> customers)
        {
            var result = new List<MonthlyRegistrationData>();
            var now = DateTime.UtcNow;
            
            for (int i = 11; i >= 0; i--)
            {
                var month = now.AddMonths(-i);
                var monthName = month.ToString("MMM yyyy");
                var count = customers.Count(c => c.CreatedAt.Year == month.Year && c.CreatedAt.Month == month.Month);
                
                result.Add(new MonthlyRegistrationData
                {
                    Month = monthName,
                    Count = count
                });
            }
            
            return result;
        }

        private static int GetRandomStat(int min, int max)
        {
            var random = new Random();
            return random.Next(min, max);
        }

        [HttpGet]
        public async Task<IActionResult> Search(string query, string status, int page = 1, int pageSize = 10)
        {
            try
            {
                var customers = new List<ApplicationUser>();
                var allUsers = _userManager.Users.ToList();
                
                foreach (var user in allUsers)
                {
                    if (await _userManager.IsInRoleAsync(user, "Customer"))
                    {
                        customers.Add(user);
                    }
                }                // Apply search filter
                if (!string.IsNullOrEmpty(query))
                {
                    customers = customers.Where(c => 
                        (c.FirstName?.Contains(query, StringComparison.OrdinalIgnoreCase) ?? false) ||
                        (c.LastName?.Contains(query, StringComparison.OrdinalIgnoreCase) ?? false) ||
                        (c.Email?.Contains(query, StringComparison.OrdinalIgnoreCase) ?? false) ||
                        (c.PhoneNumber?.Contains(query, StringComparison.OrdinalIgnoreCase) ?? false)
                    ).ToList();
                }

                // Apply status filter
                if (!string.IsNullOrEmpty(status))
                {
                    if (status == "active")
                        customers = customers.Where(c => c.IsActive).ToList();
                    else if (status == "inactive")
                        customers = customers.Where(c => !c.IsActive).ToList();
                }

                // Apply pagination
                var totalCount = customers.Count;
                var paginatedCustomers = customers
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var searchResult = new CustomerSearchResultViewModel
                {
                    Customers = paginatedCustomers,
                    CurrentPage = page,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                    TotalCount = totalCount,
                    Query = query,
                    Status = status
                };

                return Json(searchResult);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CustomersAdmin Search: {ex.Message}");
                return Json(new { error = "Có lỗi xảy ra khi tìm kiếm khách hàng." });
            }
        }

        [HttpGet]
        public async Task<IActionResult> Edit(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            try
            {
                var customer = await _userManager.FindByIdAsync(id);
                if (customer == null)
                {
                    return NotFound();
                }

                if (!await _userManager.IsInRoleAsync(customer, "Customer"))
                {
                    return NotFound();
                }                var viewModel = new CustomerEditViewModel
                {
                    Id = customer.Id,
                    FirstName = customer.FirstName ?? string.Empty,
                    LastName = customer.LastName ?? string.Empty,
                    Email = customer.Email ?? string.Empty,
                    PhoneNumber = customer.PhoneNumber ?? string.Empty,
                    Address = customer.Address ?? string.Empty,
                    DateOfBirth = customer.DateOfBirth,
                    IsActive = customer.IsActive
                };

                return View(viewModel);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Edit GET: {ex.Message}");
                TempData["Error"] = "Có lỗi xảy ra khi tải thông tin khách hàng.";
                return RedirectToAction(nameof(Index));
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(CustomerEditViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            try
            {
                var customer = await _userManager.FindByIdAsync(model.Id);
                if (customer == null)
                {
                    return NotFound();
                }

                if (!await _userManager.IsInRoleAsync(customer, "Customer"))
                {
                    return NotFound();
                }                // Update customer properties
                customer.FirstName = model.FirstName;
                customer.LastName = model.LastName;
                customer.Email = model.Email;
                customer.PhoneNumber = model.PhoneNumber;
                customer.Address = model.Address;
                customer.DateOfBirth = model.DateOfBirth ?? DateTime.MinValue;
                customer.IsActive = model.IsActive;

                var result = await _userManager.UpdateAsync(customer);
                if (result.Succeeded)
                {
                    TempData["Success"] = "Thông tin khách hàng đã được cập nhật thành công.";
                    return RedirectToAction(nameof(Details), new { id = model.Id });
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Edit POST: {ex.Message}");
                ModelState.AddModelError("", "Có lỗi xảy ra khi cập nhật thông tin khách hàng.");
            }

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> ActivityHistory(string id, int page = 1, int pageSize = 20)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            try
            {
                var customer = await _userManager.FindByIdAsync(id);
                if (customer == null || !await _userManager.IsInRoleAsync(customer, "Customer"))
                {
                    return NotFound();
                }

                // For now, return a mock activity history view
                // In a real implementation, you would use ICustomerActivityRepository
                var mockActivities = new List<object>
                {
                    new { Type = "Login", Description = "Đăng nhập vào hệ thống", Date = DateTime.Now.AddDays(-1) },
                    new { Type = "ProductView", Description = "Xem sản phẩm: Áo thun nam", Date = DateTime.Now.AddDays(-2) },
                    new { Type = "AddToCart", Description = "Thêm sản phẩm vào giỏ hàng", Date = DateTime.Now.AddDays(-3) }
                };

                ViewBag.Customer = customer;
                ViewBag.CurrentPage = page;
                ViewBag.TotalPages = 1;
                
                return View(mockActivities);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ActivityHistory: {ex.Message}");
                TempData["Error"] = "Có lỗi xảy ra khi tải lịch sử hoạt động.";
                return RedirectToAction(nameof(Details), new { id });
            }
        }

        [HttpGet]
        public async Task<IActionResult> Reviews(string id, int page = 1, int pageSize = 10)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            try
            {
                var customer = await _userManager.FindByIdAsync(id);
                if (customer == null || !await _userManager.IsInRoleAsync(customer, "Customer"))
                {
                    return NotFound();
                }

                // Mock reviews data
                var mockReviews = new List<object>
                {
                    new { 
                        ProductName = "Áo thun nam", 
                        Rating = 5, 
                        Content = "Sản phẩm chất lượng tốt", 
                        Date = DateTime.Now.AddDays(-5),
                        IsApproved = true
                    },
                    new { 
                        ProductName = "Quần jean", 
                        Rating = 4, 
                        Content = "Đẹp, vừa vặn", 
                        Date = DateTime.Now.AddDays(-10),
                        IsApproved = false
                    }
                };

                ViewBag.Customer = customer;
                ViewBag.CurrentPage = page;
                ViewBag.TotalPages = 1;
                
                return View(mockReviews);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Reviews: {ex.Message}");
                TempData["Error"] = "Có lỗi xảy ra khi tải đánh giá của khách hàng.";
                return RedirectToAction(nameof(Details), new { id });
            }
        }        [HttpGet]
        public IActionResult SearchStatistics()
        {
            try
            {
                // Mock search statistics data
                var searchStats = new CustomerSearchStatsViewModel
                {
                    TopSearchTerms = new List<SearchTermData>
                    {
                        new SearchTermData { Term = "áo thun", Count = 150, ClickRate = 75.5 },
                        new SearchTermData { Term = "quần jean", Count = 120, ClickRate = 68.2 },
                        new SearchTermData { Term = "giày", Count = 95, ClickRate = 82.1 },
                        new SearchTermData { Term = "túi xách", Count = 80, ClickRate = 65.0 },
                        new SearchTermData { Term = "đồng hồ", Count = 70, ClickRate = 90.0 }
                    },
                    SearchTrends = new List<SearchTrendData>
                    {
                        new SearchTrendData { Date = DateTime.Now.AddDays(-30), TotalSearches = 1250 },
                        new SearchTrendData { Date = DateTime.Now.AddDays(-23), TotalSearches = 1380 },
                        new SearchTrendData { Date = DateTime.Now.AddDays(-16), TotalSearches = 1420 },
                        new SearchTrendData { Date = DateTime.Now.AddDays(-9), TotalSearches = 1550 },
                        new SearchTrendData { Date = DateTime.Now.AddDays(-2), TotalSearches = 1680 }
                    },
                    TotalSearches = 8250,
                    UniqueSearchers = 2100,
                    AverageClickThroughRate = 73.2,
                    NoResultsSearches = 165
                };

                return View(searchStats);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SearchStatistics: {ex.Message}");
                TempData["Error"] = "Có lỗi xảy ra khi tải thống kê tìm kiếm.";
                return RedirectToAction(nameof(Index));
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> BulkAction(string action, string[] customerIds)
        {
            if (string.IsNullOrEmpty(action) || customerIds == null || customerIds.Length == 0)
            {
                TempData["Error"] = "Vui lòng chọn hành động và ít nhất một khách hàng.";
                return RedirectToAction(nameof(Index));
            }

            try
            {
                int successCount = 0;
                int failCount = 0;

                foreach (var customerId in customerIds)
                {
                    var customer = await _userManager.FindByIdAsync(customerId);
                    if (customer != null && await _userManager.IsInRoleAsync(customer, "Customer"))
                    {
                        switch (action.ToLower())
                        {
                            case "activate":
                                customer.IsActive = true;
                                var activateResult = await _userManager.UpdateAsync(customer);
                                if (activateResult.Succeeded) successCount++;
                                else failCount++;
                                break;

                            case "deactivate":
                                customer.IsActive = false;
                                var deactivateResult = await _userManager.UpdateAsync(customer);
                                if (deactivateResult.Succeeded) successCount++;
                                else failCount++;
                                break;

                            default:
                                failCount++;
                                break;
                        }
                    }
                    else
                    {
                        failCount++;
                    }
                }

                if (successCount > 0)
                {
                    TempData["Success"] = $"Đã xử lý thành công {successCount} khách hàng.";
                }

                if (failCount > 0)
                {
                    TempData["Error"] = $"Không thể xử lý {failCount} khách hàng.";
                }

                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in BulkAction: {ex.Message}");
                TempData["Error"] = "Có lỗi xảy ra khi thực hiện hành động hàng loạt.";
                return RedirectToAction(nameof(Index));
            }        }
    }
}
