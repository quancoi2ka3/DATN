using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    public class FAQsAdminController : BaseAdminController
    {
        private readonly IUnitOfWork _unitOfWork;

        public FAQsAdminController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: Admin/FAQsAdmin
        public async Task<IActionResult> Index(FAQCategory? category, string searchString)
        {
            try
            {
                var faqs = await _unitOfWork.FAQs.GetAllAsync();

                if (category.HasValue)
                {
                    faqs = faqs.Where(f => f.Category == category.Value);
                }

                if (!string.IsNullOrEmpty(searchString))
                {
                    faqs = faqs.Where(f =>
                        f.Question.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                        f.Answer.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                        f.Category.ToString().Contains(searchString, StringComparison.OrdinalIgnoreCase));
                }

                ViewBag.Categories = Enum.GetValues<FAQCategory>();
                ViewBag.SelectedCategory = category;
                ViewBag.SearchString = searchString;

                return View(faqs.OrderBy(f => f.DisplayOrder).ThenBy(f => f.Category));
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error loading FAQs: " + ex.Message;
                return View(new List<FAQ>());
            }
        }

        // GET: Admin/FAQsAdmin/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                var faq = await _unitOfWork.FAQs.GetByIdAsync(id.Value);
                if (faq == null)
                {
                    return NotFound();
                }

                return View(faq);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error loading FAQ details: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // GET: Admin/FAQsAdmin/Create
        public IActionResult Create()
        {
            ViewBag.Categories = Enum.GetValues<FAQCategory>();
            return View();
        }

        // POST: Admin/FAQsAdmin/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Question,Answer,Category,DisplayOrder,IsActive")] FAQ faq)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    faq.CreatedAt = DateTime.UtcNow;
                    await _unitOfWork.FAQs.AddAsync(faq);
                    await _unitOfWork.CompleteAsync();

                    TempData["Success"] = "FAQ created successfully!";
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Error creating FAQ: " + ex.Message);
                }
            }

            ViewBag.Categories = Enum.GetValues<FAQCategory>();
            return View(faq);
        }

        // GET: Admin/FAQsAdmin/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                var faq = await _unitOfWork.FAQs.GetByIdAsync(id.Value);
                if (faq == null)
                {
                    return NotFound();
                }

                ViewBag.Categories = Enum.GetValues<FAQCategory>();
                return View(faq);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error loading FAQ for editing: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/FAQsAdmin/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Question,Answer,Category,DisplayOrder,IsActive,CreatedAt")] FAQ faq)
        {
            if (id != faq.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    faq.UpdatedAt = DateTime.UtcNow;
                    await _unitOfWork.FAQs.UpdateAsync(faq);
                    await _unitOfWork.CompleteAsync();

                    TempData["Success"] = "FAQ updated successfully!";
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Error updating FAQ: " + ex.Message);
                }
            }

            ViewBag.Categories = Enum.GetValues<FAQCategory>();
            return View(faq);
        }

        // GET: Admin/FAQsAdmin/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                var faq = await _unitOfWork.FAQs.GetByIdAsync(id.Value);
                if (faq == null)
                {
                    return NotFound();
                }

                return View(faq);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error loading FAQ for deletion: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/FAQsAdmin/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var faq = await _unitOfWork.FAQs.GetByIdAsync(id);
                if (faq != null)
                {
                    await _unitOfWork.FAQs.DeleteAsync(faq);
                    await _unitOfWork.CompleteAsync();
                    TempData["Success"] = "FAQ deleted successfully!";
                }
                else
                {
                    TempData["Error"] = "FAQ not found.";
                }
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error deleting FAQ: " + ex.Message;
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: Admin/FAQsAdmin/ToggleActive/5
        [HttpPost]
        public async Task<IActionResult> ToggleActive(int id)
        {
            try
            {
                var faq = await _unitOfWork.FAQs.GetByIdAsync(id);
                if (faq != null)
                {
                    faq.IsActive = !faq.IsActive;
                    faq.UpdatedAt = DateTime.UtcNow;
                    await _unitOfWork.FAQs.UpdateAsync(faq);
                    await _unitOfWork.CompleteAsync();

                    return Json(new { success = true, isActive = faq.IsActive });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

            return Json(new { success = false, message = "FAQ not found" });
        }

        // POST: Admin/FAQsAdmin/UpdateDisplayOrder
        [HttpPost]
        public async Task<IActionResult> UpdateDisplayOrder(int id, int newOrder)
        {
            try
            {
                var faq = await _unitOfWork.FAQs.GetByIdAsync(id);
                if (faq != null)
                {
                    faq.DisplayOrder = newOrder;
                    faq.UpdatedAt = DateTime.UtcNow;
                    await _unitOfWork.FAQs.UpdateAsync(faq);
                    await _unitOfWork.CompleteAsync();

                    return Json(new { success = true });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

            return Json(new { success = false, message = "FAQ not found" });
        }

        // GET: Admin/FAQsAdmin/Search
        [HttpGet]
        public async Task<IActionResult> Search(string query, FAQCategory? category)
        {
            try
            {
                var faqs = await _unitOfWork.FAQs.GetAllAsync();

                if (category.HasValue)
                {
                    faqs = faqs.Where(f => f.Category == category.Value);
                }

                if (!string.IsNullOrEmpty(query))
                {
                    faqs = faqs.Where(f =>
                        f.Question.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        f.Answer.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        f.Category.ToString().Contains(query, StringComparison.OrdinalIgnoreCase));
                }

                return Json(faqs.Select(f => new
                {
                    id = f.Id,
                    question = f.Question,
                    answer = f.Answer,
                    category = f.Category.ToString(),
                    displayOrder = f.DisplayOrder,
                    isActive = f.IsActive
                }));
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message });
            }
        }
    }
}