-- Migration 019: Deduplicate help_requests
-- Keeps the earliest created_at record per (full_name, location) pair.
-- IDs are UUIDs so we partition by name+location and order by created_at ASC.

delete from public.help_requests
where id in (
  select id from (
    select
      id,
      row_number() over (
        partition by full_name, location
        order by created_at asc
      ) as rn
    from public.help_requests
  ) ranked
  where rn > 1
);
