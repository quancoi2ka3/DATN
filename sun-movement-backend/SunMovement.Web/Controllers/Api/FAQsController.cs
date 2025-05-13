using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Controllers.Api
{
    [Route("api/faqs")]
    [ApiController]
    public class FAQsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public FAQsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/faqs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FAQ>>> GetFAQs()
        {
            var faqs = await _unitOfWork.FAQs.FindAsync(f => f.IsActive);
            return Ok(faqs);
        }

        // GET: api/faqs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FAQ>> GetFAQ(int id)
        {
            var faq = await _unitOfWork.FAQs.GetByIdAsync(id);
            if (faq == null)
            {
                return NotFound();
            }
            return Ok(faq);
        }

        // GET: api/faqs/category/general
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<FAQ>>> GetFAQsByCategory(string category)
        {
            if (!Enum.TryParse<FAQCategory>(category, true, out var faqCategory))
            {
                return BadRequest("Invalid category");
            }

            var faqs = await _unitOfWork.FAQs.FindAsync(f => f.IsActive && f.Category == faqCategory);
            return Ok(faqs);
        }

        // POST: api/faqs
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<FAQ>> CreateFAQ(FAQ faq)
        {
            faq.CreatedAt = DateTime.UtcNow;
            await _unitOfWork.FAQs.AddAsync(faq);
            await _unitOfWork.CompleteAsync();

            return CreatedAtAction(nameof(GetFAQ), new { id = faq.Id }, faq);
        }

        // PUT: api/faqs/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateFAQ(int id, FAQ faq)
        {
            if (id != faq.Id)
            {
                return BadRequest();
            }

            var existingFAQ = await _unitOfWork.FAQs.GetByIdAsync(id);
            if (existingFAQ == null)
            {
                return NotFound();
            }

            existingFAQ.Question = faq.Question;
            existingFAQ.Answer = faq.Answer;
            existingFAQ.Category = faq.Category;
            existingFAQ.DisplayOrder = faq.DisplayOrder;
            existingFAQ.IsActive = faq.IsActive;
            existingFAQ.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.FAQs.UpdateAsync(existingFAQ);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // DELETE: api/faqs/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFAQ(int id)
        {
            var faq = await _unitOfWork.FAQs.GetByIdAsync(id);
            if (faq == null)
            {
                return NotFound();
            }

            // Soft delete
            faq.IsActive = false;
            faq.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.FAQs.UpdateAsync(faq);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}
