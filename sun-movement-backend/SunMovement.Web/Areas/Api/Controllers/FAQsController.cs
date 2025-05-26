using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
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
            var faqs = await _unitOfWork.FAQs.GetAllAsync();
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

            return faq;
        }

        // POST: api/faqs
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<FAQ>> CreateFAQ(FAQ faq)
        {
            await _unitOfWork.FAQs.AddAsync(faq);
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

            var exists = await _unitOfWork.FAQs.ExistsAsync(id);
            if (!exists)
            {
                return NotFound();
            }

            await _unitOfWork.FAQs.UpdateAsync(faq);
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

            await _unitOfWork.FAQs.DeleteAsync(faq);
            return NoContent();
        }
    }
}
