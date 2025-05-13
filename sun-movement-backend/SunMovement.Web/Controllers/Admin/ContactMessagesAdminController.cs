using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Admin")]
    [Area("Admin")]
    [Route("admin/messages")]
    public class ContactMessagesAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public ContactMessagesAdminController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("")]
        public async Task<IActionResult> Index()
        {
            var messages = await _unitOfWork.ContactMessages.GetAllAsync();
            return View(messages);
        }

        [HttpGet("details/{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var message = await _unitOfWork.ContactMessages.GetByIdAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            // Mark as read if it's not already
            if (!message.IsRead)
            {
                message.IsRead = true;
                await _unitOfWork.ContactMessages.UpdateAsync(message);
                await _unitOfWork.CompleteAsync();
            }

            return View(message);
        }

        [HttpPost("mark-read/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var message = await _unitOfWork.ContactMessages.GetByIdAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            message.IsRead = true;
            await _unitOfWork.ContactMessages.UpdateAsync(message);
            await _unitOfWork.CompleteAsync();
            
            return RedirectToAction(nameof(Index));
        }

        [HttpGet("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var message = await _unitOfWork.ContactMessages.GetByIdAsync(id);
            if (message == null)
            {
                return NotFound();
            }
            return View(message);
        }

        [HttpPost("delete/{id}")]
        [ValidateAntiForgeryToken]
        [ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var message = await _unitOfWork.ContactMessages.GetByIdAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            await _unitOfWork.ContactMessages.DeleteAsync(message);
            await _unitOfWork.CompleteAsync();
            
            return RedirectToAction(nameof(Index));
        }
    }
}
