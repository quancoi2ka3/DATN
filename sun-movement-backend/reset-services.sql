-- Reset all services data
-- This script will delete all services and their schedules and reset the identity counter

-- First delete any related entities
DELETE FROM ServiceSchedules;

-- Now delete all services
DELETE FROM Services;

-- Reset identity counters
DBCC CHECKIDENT ('Services', RESEED, 0);
DBCC CHECKIDENT ('ServiceSchedules', RESEED, 0);

-- Insert demo data
INSERT INTO Services (Name, Description, ImageUrl, Price, Type, Features, IsActive, CreatedAt)
VALUES 
('Strength Training', 'Build muscle and increase strength with our comprehensive strength training program.', '/images/services/strength.jpg', 49.99, 1, '["Personal trainer","Customized workout plan","Progress tracking"]', 1, GETDATE()),
('Yoga Classes', 'Find balance and flexibility with our relaxing yoga classes suitable for all levels.', '/images/services/yoga.jpg', 39.99, 2, '["Professional instructor","Small group sessions","Meditation included"]', 1, GETDATE()),
('Calisthenics', 'Master bodyweight exercises and develop incredible strength and control.', '/images/services/calisthenics.jpg', 44.99, 0, '["Advanced techniques","Street workout","Group sessions"]', 1, GETDATE()),
('Personal Training', 'One-on-one training sessions tailored to your specific fitness goals.', '/images/services/personal.jpg', 69.99, 1, '["Dedicated trainer","Customized program","Nutrition guidance"]', 1, GETDATE()),
('Family Fitness', 'Get the whole family active with our fun and engaging family fitness sessions.', '/images/services/family.jpg', 59.99, 0, '["Fun activities","All ages welcome","Group discounts"]', 1, GETDATE());

-- Insert some sample schedules
INSERT INTO ServiceSchedules (ServiceId, DayOfWeek, StartTime, EndTime, MaxCapacity, IsActive, Location, Notes, Capacity, TrainerName, Instructor)
VALUES
(1, 1, '08:00', '09:00', 15, 1, 'Main Gym', 'Bring water and towel', 12, 'Mike Johnson', 'Mike'),
(1, 3, '17:00', '18:00', 15, 1, 'Main Gym', 'Bring water and towel', 12, 'Mike Johnson', 'Mike'),
(1, 5, '19:00', '20:00', 15, 1, 'Main Gym', 'Bring water and towel', 12, 'Mike Johnson', 'Mike'),
(2, 2, '09:00', '10:30', 20, 1, 'Yoga Studio', 'Mats provided', 18, 'Sarah Williams', 'Sarah'),
(2, 4, '18:00', '19:30', 20, 1, 'Yoga Studio', 'Mats provided', 18, 'Sarah Williams', 'Sarah'),
(3, 1, '16:00', '17:30', 12, 1, 'Outdoor Area', 'Weather permitting', 10, 'Alex Chen', 'Alex'),
(3, 5, '10:00', '11:30', 12, 1, 'Outdoor Area', 'Weather permitting', 10, 'Alex Chen', 'Alex'),
(4, 2, '07:00', '08:00', 1, 1, 'Private Room', 'By appointment only', 1, 'Various Trainers', 'Staff'),
(4, 4, '07:00', '08:00', 1, 1, 'Private Room', 'By appointment only', 1, 'Various Trainers', 'Staff'),
(5, 6, '10:00', '11:30', 30, 1, 'Main Hall', 'Fun for all ages', 25, 'Team Instructors', 'Team');

PRINT 'Services reset successfully with sample data';
