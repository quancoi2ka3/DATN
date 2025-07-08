using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CouponCampaignController : BaseAdminController
    {
        private readonly ICouponService _couponService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CouponCampaignController> _logger;

        public CouponCampaignController(
            ICouponService couponService,
            IUnitOfWork unitOfWork,
            ILogger<CouponCampaignController> logger)
        {
            _couponService = couponService;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        // GET: Admin/CouponCampaign
        public async Task<IActionResult> Index()
        {
            try
            {
                var coupons = await _couponService.GetAllActiveCouponsAsync();
                ViewBag.ActiveCoupons = coupons;
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading coupon campaign page");
                TempData["ErrorMessage"] = "Có lỗi khi tải trang chiến dịch email.";
                return RedirectToAction("Index", "CouponsAdmin");
            }
        }

        // POST: Admin/CouponCampaign/SendWelcomeCoupon
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendWelcomeCoupon([Required] string email, [Required] string customerName)
        {
            if (!ModelState.IsValid)
            {
                TempData["ErrorMessage"] = "Email và tên khách hàng không được để trống.";
                return RedirectToAction(nameof(Index));
            }

            try
            {
                var success = await _couponService.SendWelcomeCouponEmailAsync(email, customerName);
                
                if (success)
                {
                    TempData["SuccessMessage"] = $"✅ Đã gửi email mã giảm giá chào mừng đến {email}";
                }
                else
                {
                    TempData["ErrorMessage"] = "❌ Có lỗi khi gửi email. Vui lòng thử lại.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending welcome coupon to {Email}", email);
                TempData["ErrorMessage"] = "❌ Có lỗi khi gửi email: " + ex.Message;
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: Admin/CouponCampaign/SendSeasonalCampaign
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendSeasonalCampaign([Required] string occasion, [Required] string customerEmails)
        {
            if (!ModelState.IsValid)
            {
                TempData["ErrorMessage"] = "Vui lòng nhập đầy đủ thông tin chiến dịch.";
                return RedirectToAction(nameof(Index));
            }

            try
            {
                // Parse email list
                var emailList = customerEmails
                    .Split(new char[] { ',', ';', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(email => email.Trim())
                    .Where(email => !string.IsNullOrEmpty(email) && email.Contains("@"))
                    .ToList();

                if (!emailList.Any())
                {
                    TempData["ErrorMessage"] = "❌ Không tìm thấy email hợp lệ nào.";
                    return RedirectToAction(nameof(Index));
                }

                var success = await _couponService.SendSeasonalCouponCampaignAsync(occasion, emailList);
                
                if (success)
                {
                    TempData["SuccessMessage"] = $"✅ Đã gửi chiến dịch ưu đãi '{occasion}' đến {emailList.Count} khách hàng";
                }
                else
                {
                    TempData["ErrorMessage"] = "❌ Có lỗi khi gửi chiến dịch email.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending seasonal campaign for {Occasion}", occasion);
                TempData["ErrorMessage"] = "❌ Có lỗi khi gửi chiến dịch: " + ex.Message;
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: Admin/CouponCampaign/SendBirthdayCoupon
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendBirthdayCoupon([Required] string email, [Required] string customerName)
        {
            if (!ModelState.IsValid)
            {
                TempData["ErrorMessage"] = "Email và tên khách hàng không được để trống.";
                return RedirectToAction(nameof(Index));
            }

            try
            {
                var success = await _couponService.SendBirthdayCouponEmailAsync(email, customerName);
                
                if (success)
                {
                    TempData["SuccessMessage"] = $"🎂 Đã gửi email chúc mừng sinh nhật đến {customerName} ({email})";
                }
                else
                {
                    TempData["ErrorMessage"] = "❌ Có lỗi khi gửi email sinh nhật.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending birthday coupon to {Email}", email);
                TempData["ErrorMessage"] = "❌ Có lỗi khi gửi email sinh nhật: " + ex.Message;
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: Admin/CouponCampaign/SendLoyaltyCoupon
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendLoyaltyCoupon(
            [Required] string email, 
            [Required] string customerName, 
            [Range(1, 1000)] int orderCount, 
            [Range(0, double.MaxValue)] decimal totalSpent)
        {
            if (!ModelState.IsValid)
            {
                TempData["ErrorMessage"] = "Vui lòng nhập đầy đủ và chính xác thông tin khách hàng.";
                return RedirectToAction(nameof(Index));
            }

            try
            {
                var success = await _couponService.SendLoyaltyRewardCouponAsync(email, customerName, orderCount, totalSpent);
                
                if (success)
                {
                    TempData["SuccessMessage"] = $"💎 Đã gửi email tri ân khách hàng VIP đến {customerName} ({email})";
                }
                else
                {
                    TempData["ErrorMessage"] = "❌ Có lỗi khi gửi email tri ân.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending loyalty coupon to {Email}", email);
                TempData["ErrorMessage"] = "❌ Có lỗi khi gửi email tri ân: " + ex.Message;
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: Admin/CouponCampaign/SendAbandonedCartCoupon
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendAbandonedCartCoupon(
            [Required] string email, 
            [Required] string customerName, 
            [Range(0, double.MaxValue)] decimal cartValue)
        {
            if (!ModelState.IsValid)
            {
                TempData["ErrorMessage"] = "Vui lòng nhập đầy đủ thông tin giỏ hàng.";
                return RedirectToAction(nameof(Index));
            }

            try
            {
                var success = await _couponService.SendAbandonedCartCouponAsync(email, customerName, cartValue);
                
                if (success)
                {
                    TempData["SuccessMessage"] = $"🛒 Đã gửi email nhắc nhở giỏ hàng đến {customerName} ({email})";
                }
                else
                {
                    TempData["ErrorMessage"] = "❌ Có lỗi khi gửi email nhắc nhở.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending abandoned cart coupon to {Email}", email);
                TempData["ErrorMessage"] = "❌ Có lỗi khi gửi email nhắc nhở: " + ex.Message;
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: Admin/CouponCampaign/SendCustomCampaign
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendCustomCampaign(
            [Required] int couponId, 
            [Required] string campaignName, 
            [Required] string campaignDescription, 
            [Required] string customerEmails)
        {
            if (!ModelState.IsValid)
            {
                TempData["ErrorMessage"] = "Vui lòng nhập đầy đủ thông tin chiến dịch.";
                return RedirectToAction(nameof(Index));
            }

            try
            {
                // Parse email list
                var emailList = customerEmails
                    .Split(new char[] { ',', ';', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(email => email.Trim())
                    .Where(email => !string.IsNullOrEmpty(email) && email.Contains("@"))
                    .ToList();

                if (!emailList.Any())
                {
                    TempData["ErrorMessage"] = "❌ Không tìm thấy email hợp lệ nào.";
                    return RedirectToAction(nameof(Index));
                }

                var success = await _couponService.SendCustomCouponCampaignAsync(
                    couponId, emailList, campaignName, campaignDescription);
                
                if (success)
                {
                    TempData["SuccessMessage"] = $"✅ Đã gửi chiến dịch '{campaignName}' đến {emailList.Count} khách hàng";
                }
                else
                {
                    TempData["ErrorMessage"] = "❌ Có lỗi khi gửi chiến dịch email.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending custom campaign {CampaignName}", campaignName);
                TempData["ErrorMessage"] = "❌ Có lỗi khi gửi chiến dịch: " + ex.Message;
            }

            return RedirectToAction(nameof(Index));
        }

        // GET: Admin/CouponCampaign/TestEmail
        public IActionResult TestEmail()
        {
            return View();
        }

        // POST: Admin/CouponCampaign/SendTestEmail
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendTestEmail([Required] string email)
        {
            if (!ModelState.IsValid)
            {
                TempData["ErrorMessage"] = "Email không hợp lệ.";
                return RedirectToAction(nameof(TestEmail));
            }

            try
            {
                // Send a test welcome coupon
                var success = await _couponService.SendWelcomeCouponEmailAsync(email, "Khách hàng test");
                
                if (success)
                {
                    TempData["SuccessMessage"] = $"✅ Đã gửi email test thành công đến {email}";
                }
                else
                {
                    TempData["ErrorMessage"] = "❌ Có lỗi khi gửi email test.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending test email to {Email}", email);
                TempData["ErrorMessage"] = "❌ Có lỗi khi gửi email test: " + ex.Message;
            }

            return RedirectToAction(nameof(TestEmail));
        }
    }
}
