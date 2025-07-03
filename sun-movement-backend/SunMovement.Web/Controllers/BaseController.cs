using Microsoft.AspNetCore.Mvc;

namespace SunMovement.Web.Controllers
{
    /// <summary>
    /// BaseController cung cấp các phương thức tiện ích chung cho tất cả các controller
    /// </summary>
    public abstract class BaseController : Controller
    {
        /// <summary>
        /// Hiển thị thông báo thành công
        /// </summary>
        protected void ShowSuccess(string message)
        {
            TempData["SuccessMessage"] = message;
        }

        /// <summary>
        /// Hiển thị thông báo lỗi
        /// </summary>
        protected void ShowError(string message)
        {
            TempData["ErrorMessage"] = message;
        }

        /// <summary>
        /// Hiển thị thông báo cảnh báo
        /// </summary>
        protected void ShowWarning(string message)
        {
            TempData["WarningMessage"] = message;
        }

        /// <summary>
        /// Hiển thị thông báo thông tin
        /// </summary>
        protected void ShowInfo(string message)
        {
            TempData["InfoMessage"] = message;
        }
    }
}
