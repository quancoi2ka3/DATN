using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Models;
using SunMovement.Core.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class SuppliersAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<SuppliersAdminController> _logger;

        public SuppliersAdminController(IUnitOfWork unitOfWork, ILogger<SuppliersAdminController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        // GET: Admin/SuppliersAdmin
        public async Task<IActionResult> Index(int page = 1, int pageSize = 10, string searchTerm = "")
        {
            try
            {
                var suppliersQuery = await _unitOfWork.Suppliers.GetAllAsync();
                
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    suppliersQuery = suppliersQuery.Where(s => 
                        s.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                        s.ContactPerson.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                        s.Email.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));
                }

                var totalCount = suppliersQuery.Count();
                var suppliers = suppliersQuery
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                ViewBag.CurrentPage = page;
                ViewBag.PageSize = pageSize;
                ViewBag.TotalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);
                ViewBag.SearchTerm = searchTerm;
                ViewBag.TotalCount = totalCount;

                return View(suppliers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading suppliers list");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải danh sách nhà cung cấp.";
                return View(new List<Supplier>());
            }
        }

        // GET: Admin/SuppliersAdmin/Details/5
        public async Task<IActionResult> Details(int id)
        {
            try
            {
                var supplier = await _unitOfWork.Suppliers.GetByIdAsync(id);
                if (supplier == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy nhà cung cấp.";
                    return RedirectToAction(nameof(Index));
                }

                // Load related products
                var productSuppliers = await _unitOfWork.ProductSuppliers.GetProductsBySupplierIdAsync(id);
                ViewBag.SuppliedProducts = productSuppliers;

                return View(supplier);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading supplier details for ID: {SupplierId}", id);
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải thông tin nhà cung cấp.";
                return RedirectToAction(nameof(Index));
            }
        }

        // GET: Admin/SuppliersAdmin/Create
        public IActionResult Create()
        {
            return View(new Supplier());
        }

        // POST: Admin/SuppliersAdmin/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Supplier supplier)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    // Check if supplier with same name already exists
                    var existingSupplier = await _unitOfWork.Suppliers.GetByNameAsync(supplier.Name);
                    if (existingSupplier != null)
                    {
                        ModelState.AddModelError("Name", "Đã tồn tại nhà cung cấp với tên này.");
                        return View(supplier);
                    }

                    supplier.CreatedAt = DateTime.Now;
                    supplier.UpdatedAt = DateTime.Now;
                    supplier.IsActive = true;

                    await _unitOfWork.Suppliers.AddAsync(supplier);
                    await _unitOfWork.CommitAsync();

                    TempData["SuccessMessage"] = "Thêm nhà cung cấp thành công!";
                    return RedirectToAction(nameof(Index));
                }

                return View(supplier);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating supplier");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi thêm nhà cung cấp.";
                return View(supplier);
            }
        }

        // GET: Admin/SuppliersAdmin/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            try
            {
                var supplier = await _unitOfWork.Suppliers.GetByIdAsync(id);
                if (supplier == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy nhà cung cấp.";
                    return RedirectToAction(nameof(Index));
                }

                return View(supplier);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading supplier for edit: {SupplierId}", id);
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải thông tin nhà cung cấp.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/SuppliersAdmin/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Supplier supplier)
        {
            if (id != supplier.Id)
            {
                TempData["ErrorMessage"] = "ID không hợp lệ.";
                return RedirectToAction(nameof(Index));
            }

            try
            {
                if (ModelState.IsValid)
                {
                    // Check if another supplier with same name exists
                    var existingSupplier = await _unitOfWork.Suppliers.GetByNameAsync(supplier.Name);
                    if (existingSupplier != null && existingSupplier.Id != id)
                    {
                        ModelState.AddModelError("Name", "Đã tồn tại nhà cung cấp với tên này.");
                        return View(supplier);
                    }

                    var originalSupplier = await _unitOfWork.Suppliers.GetByIdAsync(id);
                    if (originalSupplier == null)
                    {
                        TempData["ErrorMessage"] = "Không tìm thấy nhà cung cấp.";
                        return RedirectToAction(nameof(Index));
                    }

                    // Update fields
                    originalSupplier.Name = supplier.Name;
                    originalSupplier.ContactPerson = supplier.ContactPerson;
                    originalSupplier.Email = supplier.Email;
                    originalSupplier.Phone = supplier.Phone;
                    originalSupplier.Address = supplier.Address;
                    originalSupplier.Website = supplier.Website;
                    originalSupplier.Description = supplier.Description;
                    originalSupplier.IsActive = supplier.IsActive;
                    originalSupplier.UpdatedAt = DateTime.Now;

                    await _unitOfWork.Suppliers.UpdateAsync(originalSupplier);
                    await _unitOfWork.CommitAsync();

                    TempData["SuccessMessage"] = "Cập nhật nhà cung cấp thành công!";
                    return RedirectToAction(nameof(Index));
                }

                return View(supplier);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating supplier: {SupplierId}", id);
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi cập nhật nhà cung cấp.";
                return View(supplier);
            }
        }

        // GET: Admin/SuppliersAdmin/Delete/5
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var supplier = await _unitOfWork.Suppliers.GetByIdAsync(id);
                if (supplier == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy nhà cung cấp.";
                    return RedirectToAction(nameof(Index));
                }

                // Check if supplier has products
                var hasProducts = await _unitOfWork.ProductSuppliers.HasProductsAsync(id);
                ViewBag.HasProducts = hasProducts;

                return View(supplier);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading supplier for delete: {SupplierId}", id);
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải thông tin nhà cung cấp.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/SuppliersAdmin/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var supplier = await _unitOfWork.Suppliers.GetByIdAsync(id);
                if (supplier == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy nhà cung cấp.";
                    return RedirectToAction(nameof(Index));
                }

                // Check if supplier has products
                var hasProducts = await _unitOfWork.ProductSuppliers.HasProductsAsync(id);
                if (hasProducts)
                {
                    TempData["ErrorMessage"] = "Không thể xóa nhà cung cấp đang có sản phẩm. Vui lòng xóa các sản phẩm trước.";
                    return RedirectToAction(nameof(Index));
                }

                await _unitOfWork.Suppliers.DeleteAsync(supplier);
                await _unitOfWork.CommitAsync();

                TempData["SuccessMessage"] = "Xóa nhà cung cấp thành công!";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting supplier: {SupplierId}", id);
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi xóa nhà cung cấp.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/SuppliersAdmin/ToggleStatus/5
        [HttpPost]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            try
            {
                var supplier = await _unitOfWork.Suppliers.GetByIdAsync(id);
                if (supplier == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy nhà cung cấp." });
                }

                supplier.IsActive = !supplier.IsActive;
                supplier.UpdatedAt = DateTime.Now;

                await _unitOfWork.Suppliers.UpdateAsync(supplier);
                await _unitOfWork.CommitAsync();

                return Json(new { 
                    success = true, 
                    message = supplier.IsActive ? "Kích hoạt nhà cung cấp thành công!" : "Vô hiệu hóa nhà cung cấp thành công!",
                    isActive = supplier.IsActive
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling supplier status: {SupplierId}", id);
                return Json(new { success = false, message = "Có lỗi xảy ra khi thay đổi trạng thái nhà cung cấp." });
            }
        }

        // GET: Admin/SuppliersAdmin/GetSupplierProducts/5
        public async Task<IActionResult> GetSupplierProducts(int id)
        {
            try
            {
                var products = await _unitOfWork.ProductSuppliers.GetProductsBySupplierIdAsync(id);
                return Json(new { success = true, data = products });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting supplier products: {SupplierId}", id);
                return Json(new { success = false, message = "Có lỗi xảy ra khi tải danh sách sản phẩm." });
            }
        }
    }
}
