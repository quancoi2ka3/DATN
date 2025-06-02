-- Delete all services data
-- Warning: This will permanently delete all services and schedules

-- First delete any related entities
DELETE FROM ServiceSchedules;

-- Now delete all services
DELETE FROM Services;

-- Reset identity counters
DBCC CHECKIDENT ('Services', RESEED, 0);
DBCC CHECKIDENT ('ServiceSchedules', RESEED, 0);

PRINT 'All services and schedules have been deleted.';
