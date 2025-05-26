using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Web.Areas.Api.Models;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/contact")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;

        public ContactController(IUnitOfWork unitOfWork, IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _emailService = emailService;
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

            // Mark as read if not already read
            if (!message.IsRead)
            {
                message.IsRead = true;
                message.ReadAt = DateTime.UtcNow;
                await _unitOfWork.ContactMessages.UpdateAsync(message);
            }

            return message;
        }

        // POST: api/contact
        [HttpPost]
        public async Task<ActionResult<ContactMessage>> SubmitContactForm(ContactFormModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var message = new ContactMessage
            {
                Name = model.Name,
                Email = model.Email,
                Subject = model.Subject,
                Message = model.Message,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _unitOfWork.ContactMessages.AddAsync(message);

            // Send notification email to admin about new contact message
            try
            {
                await _emailService.SendContactNotificationAsync(message);
            }
            catch (Exception)
            {
                // Log error but don't return it to client
                // Message is still saved in the database
            }

            return CreatedAtAction(nameof(GetMessage), new { id = message.Id }, message);
        }

        // PUT: api/contact/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateMessage(int id, ContactMessage contactMessage)
        {
            if (id != contactMessage.Id)
            {
                return BadRequest();
            }

            var exists = await _unitOfWork.ContactMessages.ExistsAsync(id);
            if (!exists)
            {
                return NotFound();
            }

            await _unitOfWork.ContactMessages.UpdateAsync(contactMessage);

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

            return NoContent();
        }
    }
}
