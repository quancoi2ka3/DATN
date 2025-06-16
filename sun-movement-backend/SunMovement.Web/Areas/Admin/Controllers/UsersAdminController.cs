using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Models;
using SunMovement.Web.ViewModels;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class UsersAdminController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public UsersAdminController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
        }

        // GET: Admin/UsersAdmin
        public async Task<IActionResult> Index()
        {
            try
            {
                var users = _userManager.Users.ToList();
                var userViewModels = new List<UserAdminViewModel>();

                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);                    userViewModels.Add(new UserAdminViewModel
                    {
                        Id = user.Id ?? string.Empty,
                        UserName = user.UserName ?? string.Empty,
                        Email = user.Email ?? string.Empty,
                        FirstName = user.FirstName ?? string.Empty,
                        LastName = user.LastName ?? string.Empty,
                        PhoneNumber = user.PhoneNumber ?? string.Empty,
                        EmailConfirmed = user.EmailConfirmed,
                        LockoutEnd = user.LockoutEnd,
                        IsLockedOut = user.LockoutEnd.HasValue && user.LockoutEnd > DateTimeOffset.UtcNow,
                        Roles = roles.ToList(),
                        CreatedAt = user.CreatedAt
                    });
                }

                return View(userViewModels.OrderBy(u => u.UserName));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UsersAdmin Index: {ex.Message}");
                TempData["Error"] = "Có lỗi xảy ra khi tải danh sách người dùng.";
                return View(new List<UserAdminViewModel>());
            }
        }

        // GET: Admin/UsersAdmin/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var roles = await _userManager.GetRolesAsync(user);            var model = new UserAdminViewModel
            {
                Id = user.Id ?? string.Empty,
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName ?? string.Empty,
                LastName = user.LastName ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                EmailConfirmed = user.EmailConfirmed,
                LockoutEnd = user.LockoutEnd,
                IsLockedOut = user.LockoutEnd.HasValue && user.LockoutEnd > DateTimeOffset.UtcNow,
                Roles = roles.ToList(),
                CreatedAt = user.CreatedAt
            };

            return View(model);
        }

        // GET: Admin/UsersAdmin/Create
        public async Task<IActionResult> Create()
        {
            var model = new CreateUserViewModel();
              // Get all roles for the dropdown
            var roles = await _roleManager.Roles.ToListAsync();
            model.AvailableRoles = roles.Select(r => new Microsoft.AspNetCore.Mvc.Rendering.SelectListItem
            {
                Value = r.Name ?? string.Empty,
                Text = r.Name ?? string.Empty
            }).ToList();

            return View(model);
        }

        // POST: Admin/UsersAdmin/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateUserViewModel model)
        {
            if (ModelState.IsValid)
            {                var user = new ApplicationUser
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    FirstName = model.FirstName ?? string.Empty,
                    LastName = model.LastName ?? string.Empty,
                    PhoneNumber = model.PhoneNumber ?? string.Empty,
                    EmailConfirmed = true, // Auto-confirm for admin created users
                    CreatedAt = DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    // Add user to selected roles
                    if (model.SelectedRoles != null && model.SelectedRoles.Any())
                    {
                        await _userManager.AddToRolesAsync(user, model.SelectedRoles);
                    }

                    TempData["Success"] = "Người dùng đã được tạo thành công.";
                    return RedirectToAction(nameof(Index));
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }            // Reload available roles if validation fails
            var roles = await _roleManager.Roles.ToListAsync();
            model.AvailableRoles = roles.Select(r => new Microsoft.AspNetCore.Mvc.Rendering.SelectListItem
            {
                Value = r.Name ?? string.Empty,
                Text = r.Name ?? string.Empty
            }).ToList();

            return View(model);
        }

        // GET: Admin/UsersAdmin/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            var allRoles = await _roleManager.Roles.ToListAsync();            var model = new EditUserViewModel
            {
                Id = user.Id ?? string.Empty,
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName ?? string.Empty,
                LastName = user.LastName ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                EmailConfirmed = user.EmailConfirmed,
                SelectedRoles = userRoles.ToList(),
                AvailableRoles = allRoles.Select(r => new Microsoft.AspNetCore.Mvc.Rendering.SelectListItem
                {
                    Value = r.Name ?? string.Empty,
                    Text = r.Name ?? string.Empty,
                    Selected = userRoles.Contains(r.Name ?? string.Empty)
                }).ToList()
            };

            return View(model);
        }

        // POST: Admin/UsersAdmin/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, EditUserViewModel model)
        {
            if (id != model.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return NotFound();
                }                user.UserName = model.UserName;
                user.Email = model.Email;
                user.FirstName = model.FirstName ?? string.Empty;
                user.LastName = model.LastName ?? string.Empty;
                user.PhoneNumber = model.PhoneNumber ?? string.Empty;
                user.EmailConfirmed = model.EmailConfirmed;

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    // Update roles
                    var currentRoles = await _userManager.GetRolesAsync(user);
                    var selectedRoles = model.SelectedRoles ?? new List<string>();

                    // Remove roles that are no longer selected
                    var rolesToRemove = currentRoles.Except(selectedRoles);
                    if (rolesToRemove.Any())
                    {
                        await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
                    }

                    // Add new roles
                    var rolesToAdd = selectedRoles.Except(currentRoles);
                    if (rolesToAdd.Any())
                    {
                        await _userManager.AddToRolesAsync(user, rolesToAdd);
                    }

                    TempData["Success"] = "Thông tin người dùng đã được cập nhật thành công.";
                    return RedirectToAction(nameof(Index));
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }            // Reload available roles if validation fails
            var allRoles = await _roleManager.Roles.ToListAsync();
            model.AvailableRoles = allRoles.Select(r => new Microsoft.AspNetCore.Mvc.Rendering.SelectListItem
            {
                Value = r.Name ?? string.Empty,
                Text = r.Name ?? string.Empty
            }).ToList();

            return View(model);
        }

        // POST: Admin/UsersAdmin/LockUser/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> LockUser(string id, int lockoutDays = 7)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var lockoutEnd = DateTimeOffset.UtcNow.AddDays(lockoutDays);
            var result = await _userManager.SetLockoutEndDateAsync(user, lockoutEnd);

            if (result.Succeeded)
            {
                TempData["Success"] = $"Người dùng {user.UserName} đã bị khóa đến {lockoutEnd:dd/MM/yyyy}.";
            }
            else
            {
                TempData["Error"] = "Có lỗi xảy ra khi khóa người dùng.";
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: Admin/UsersAdmin/UnlockUser/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UnlockUser(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.SetLockoutEndDateAsync(user, null);

            if (result.Succeeded)
            {
                TempData["Success"] = $"Người dùng {user.UserName} đã được mở khóa.";
            }
            else
            {
                TempData["Error"] = "Có lỗi xảy ra khi mở khóa người dùng.";
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: Admin/UsersAdmin/ResetPassword/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(string id, string newPassword)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrEmpty(newPassword))
            {
                TempData["Error"] = "Thông tin không hợp lệ.";
                return RedirectToAction(nameof(Index));
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, resetToken, newPassword);

            if (result.Succeeded)
            {
                TempData["Success"] = $"Mật khẩu của người dùng {user.UserName} đã được đặt lại.";
            }
            else
            {
                TempData["Error"] = "Có lỗi xảy ra khi đặt lại mật khẩu: " + string.Join(", ", result.Errors.Select(e => e.Description));
            }

            return RedirectToAction(nameof(Index));
        }

        // GET: Admin/UsersAdmin/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var roles = await _userManager.GetRolesAsync(user);            var model = new UserAdminViewModel
            {
                Id = user.Id ?? string.Empty,
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName ?? string.Empty,
                LastName = user.LastName ?? string.Empty,
                Roles = roles.ToList(),
                CreatedAt = user.CreatedAt
            };

            return View(model);
        }

        // POST: Admin/UsersAdmin/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Don't allow deleting the current user
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser != null && currentUser.Id == user.Id)
            {
                TempData["Error"] = "Bạn không thể xóa tài khoản của chính mình.";
                return RedirectToAction(nameof(Index));
            }

            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                TempData["Success"] = $"Người dùng {user.UserName} đã được xóa thành công.";
            }
            else
            {
                TempData["Error"] = "Có lỗi xảy ra khi xóa người dùng.";
            }

            return RedirectToAction(nameof(Index));
        }
    }
}
