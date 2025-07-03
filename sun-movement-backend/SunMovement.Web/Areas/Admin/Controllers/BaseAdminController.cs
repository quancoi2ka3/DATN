using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public abstract class BaseAdminController : SunMovement.Web.Controllers.BaseController
    {
        // Các phương thức tiện ích riêng cho phần Admin có thể được thêm vào đây
    }
}
