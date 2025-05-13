using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Admin")]
    [Area("Admin")]
    [Route("admin/faqs")]
    public class FAQsAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public FAQsAdminController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("")]
        public async Task<IActionResult> Index()
        {
            var faqs = await _unitOfWork.FAQs.GetAllAsync();
            return View(faqs);
        }

        [HttpGet("create")]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost("create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(FAQ faq)
        {
            if (ModelState.IsValid)
            {
                faq.CreatedAt = System.DateTime.UtcNow;
                await _unitOfWork.FAQs.AddAsync(faq);
                await _unitOfWork.CompleteAsync();
                
                return RedirectToAction(nameof(Index));
            }
            return View(faq);
        }

        [HttpGet("edit/{id}")]
        public async Task<IActionResult> Edit(int id)
        {
            var faq = await _unitOfWork.FAQs.GetByIdAsync(id);
            if (faq == null)
            {
                return NotFound();
            }
            return View(faq);
        }

        [HttpPost("edit/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, FAQ faq)
        {
            if (id != faq.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    faq.UpdatedAt = System.DateTime.UtcNow;
                    await _unitOfWork.FAQs.UpdateAsync(faq);
                    await _unitOfWork.CompleteAsync();
                    
                    return RedirectToAction(nameof(Index));
                }
                catch (System.Exception)
                {
                    if (!await FAQExists(faq.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return View(faq);
        }

        [HttpGet("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var faq = await _unitOfWork.FAQs.GetByIdAsync(id);
            if (faq == null)
            {
                return NotFound();
            }
            return View(faq);
        }

        [HttpPost("delete/{id}")]
        [ValidateAntiForgeryToken]
        [ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var faq = await _unitOfWork.FAQs.GetByIdAsync(id);
            if (faq == null)
            {
                return NotFound();
            }

            await _unitOfWork.FAQs.DeleteAsync(faq);
            await _unitOfWork.CompleteAsync();
            
            return RedirectToAction(nameof(Index));
        }

        private async Task<bool> FAQExists(int id)
        {
            var faq = await _unitOfWork.FAQs.GetByIdAsync(id);
            return faq != null;
        }
    }
}
