using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Controllers.Api
{
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
            var events = await _unitOfWork.Events.FindAsync(e => e.IsActive);
            return Ok(events);
        }

        // GET: api/events/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var eventEntity = await _unitOfWork.Events.GetByIdAsync(id);
            if (eventEntity == null)
            {
                return NotFound();
            }

            return Ok(eventEntity);
        }

        // GET: api/events/featured
        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<Event>>> GetFeaturedEvents()
        {
            var events = await _unitOfWork.Events.FindAsync(e => e.IsActive && e.IsFeatured);
            return Ok(events);
        }

        // GET: api/events/upcoming
        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<Event>>> GetUpcomingEvents()
        {
            var today = DateTime.UtcNow.Date;
            var events = await _unitOfWork.Events.FindAsync(e => e.IsActive && e.EventDate >= today);
            return Ok(events);
        }

        // POST: api/events
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Event>> CreateEvent(Event eventEntity)
        {
            eventEntity.CreatedAt = DateTime.UtcNow;
            await _unitOfWork.Events.AddAsync(eventEntity);
            await _unitOfWork.CompleteAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = eventEntity.Id }, eventEntity);
        }

        // PUT: api/events/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEvent(int id, Event eventEntity)
        {
            if (id != eventEntity.Id)
            {
                return BadRequest();
            }

            var existingEvent = await _unitOfWork.Events.GetByIdAsync(id);
            if (existingEvent == null)
            {
                return NotFound();
            }

            existingEvent.Title = eventEntity.Title;
            existingEvent.Description = eventEntity.Description;
            existingEvent.ImageUrl = eventEntity.ImageUrl;
            existingEvent.EventDate = eventEntity.EventDate;
            existingEvent.Location = eventEntity.Location;
            existingEvent.OrganizedBy = eventEntity.OrganizedBy;
            existingEvent.IsActive = eventEntity.IsActive;
            existingEvent.RegistrationLink = eventEntity.RegistrationLink;
            existingEvent.IsFeatured = eventEntity.IsFeatured;
            existingEvent.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Events.UpdateAsync(existingEvent);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // DELETE: api/events/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var eventEntity = await _unitOfWork.Events.GetByIdAsync(id);
            if (eventEntity == null)
            {
                return NotFound();
            }

            // Soft delete
            eventEntity.IsActive = false;
            eventEntity.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.Events.UpdateAsync(eventEntity);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}
