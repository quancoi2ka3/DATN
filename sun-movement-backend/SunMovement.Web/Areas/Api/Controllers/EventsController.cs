using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/events")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public EventsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            var events = await _unitOfWork.Events.GetAllAsync();
            return Ok(events);
        }

        // GET: api/events/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var @event = await _unitOfWork.Events.GetByIdAsync(id);

            if (@event == null)
            {
                return NotFound();
            }

            return @event;
        }

        // GET: api/events/upcoming
        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<Event>>> GetUpcomingEvents()
        {
            var today = DateTime.UtcNow.Date;
            var events = await _unitOfWork.Events.FindAsync(e => e.StartDate >= today);
            return Ok(events);
        }

        // POST: api/events
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Event>> CreateEvent(Event @event)
        {
            @event.CreatedAt = DateTime.UtcNow;
            await _unitOfWork.Events.AddAsync(@event);
            return CreatedAtAction(nameof(GetEvent), new { id = @event.Id }, @event);
        }

        // PUT: api/events/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEvent(int id, Event @event)
        {
            if (id != @event.Id)
            {
                return BadRequest();
            }

            var exists = await _unitOfWork.Events.ExistsAsync(id);
            if (!exists)
            {
                return NotFound();
            }

            @event.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.Events.UpdateAsync(@event);
            return NoContent();
        }

        // DELETE: api/events/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var @event = await _unitOfWork.Events.GetByIdAsync(id);
            if (@event == null)
            {
                return NotFound();
            }

            await _unitOfWork.Events.DeleteAsync(@event);
            return NoContent();
        }
    }
}
