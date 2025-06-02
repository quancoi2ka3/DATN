-- View all services with detailed information and their schedules
SELECT 
    s.Id,
    s.Name,
    s.Description,
    s.Price,
    CASE 
        WHEN s.Type = 0 THEN 'Calisthenics'
        WHEN s.Type = 1 THEN 'Strength'
        WHEN s.Type = 2 THEN 'Yoga'
        ELSE 'Unknown'
    END AS Type,
    s.Features,
    s.IsActive,
    s.CreatedAt,
    s.UpdatedAt,
    COUNT(DISTINCT ss.Id) AS ScheduleCount
FROM 
    Services s
LEFT JOIN 
    ServiceSchedules ss ON s.Id = ss.ServiceId
GROUP BY 
    s.Id, s.Name, s.Description, s.Price, s.Type, s.Features, s.IsActive, s.CreatedAt, s.UpdatedAt
ORDER BY 
    s.Name;

-- View all service schedules in detail
SELECT 
    ss.Id AS ScheduleId,
    s.Name AS ServiceName,
    ss.TrainerName,
    CASE 
        WHEN ss.DayOfWeek = 0 THEN 'Sunday'
        WHEN ss.DayOfWeek = 1 THEN 'Monday'
        WHEN ss.DayOfWeek = 2 THEN 'Tuesday'
        WHEN ss.DayOfWeek = 3 THEN 'Wednesday'
        WHEN ss.DayOfWeek = 4 THEN 'Thursday'
        WHEN ss.DayOfWeek = 5 THEN 'Friday'
        WHEN ss.DayOfWeek = 6 THEN 'Saturday'
    END AS DayOfWeek,
    CONVERT(varchar(5), ss.StartTime, 108) AS StartTime,
    CONVERT(varchar(5), ss.EndTime, 108) AS EndTime,
    ss.Capacity,
    ss.MaxCapacity,
    ss.Location,
    ss.Notes,
    ss.IsActive
FROM 
    ServiceSchedules ss
JOIN 
    Services s ON ss.ServiceId = s.Id
ORDER BY 
    ss.DayOfWeek, ss.StartTime;