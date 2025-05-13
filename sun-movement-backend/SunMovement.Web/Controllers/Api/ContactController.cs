using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Controllers.Api
{
    [Route("api/contact")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ContactController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/contact
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ContactMessage>>> GetMessages()
        {
            var messages = await _unitOfWork.ContactMessages.GetAllAsync();
            return Ok(messages);
        }

        // GET: api/contact/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ContactMessage>> GetMessage(int id)
        {
            var message = await _unitOfWork.ContactMessages.GetByIdAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            // Mark as read if not already
            if (!message.IsRead)
            {
                message.IsRead = true;
                message.ReadAt = DateTime.UtcNow;
                await _unitOfWork.ContactMessages.UpdateAsync(message);
                await _unitOfWork.CompleteAsync();
            }

            return Ok(message);
        }

        // GET: api/contact/unread
        [HttpGet("unread")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ContactMessage>>> GetUnreadMessages()
        {
            var messages = await _unitOfWork.ContactMessages.FindAsync(m => !m.IsRead);
            return Ok(messages);
        }

        // POST: api/contact
        [HttpPost]
        public async Task<ActionResult<ContactMessage>> SendMessage(ContactMessage message)
        {
            message.CreatedAt = DateTime.UtcNow;
            message.IsRead = false;
            message.ReadAt = null;

            await _unitOfWork.ContactMessages.AddAsync(message);
            await _unitOfWork.CompleteAsync();

            return CreatedAtAction(nameof(GetMessage), new { id = message.Id }, message);
        }

        // PUT: api/contact/5/read
        [HttpPut("{id}/read")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var message = await _unitOfWork.ContactMessages.GetByIdAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            message.IsRead = true;
            message.ReadAt = DateTime.UtcNow;
            await _unitOfWork.ContactMessages.UpdateAsync(message);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // DELETE: api/contact/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _unitOfWork.ContactMessages.GetByIdAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            await _unitOfWork.ContactMessages.DeleteAsync(message);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}
