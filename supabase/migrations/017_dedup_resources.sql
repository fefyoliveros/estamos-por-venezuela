-- Remove duplicate resource entries introduced by earlier migrations
-- Each of these resources was seeded twice: once with a specific type
-- (collection_point or volunteer_coordinator) and once with type='business'.
-- Keep the specific type, delete the 'business' duplicate.

DELETE FROM public.resources
WHERE type = 'business'
  AND name IN (
    SELECT name
    FROM public.resources
    GROUP BY name
    HAVING COUNT(*) > 1
  );
