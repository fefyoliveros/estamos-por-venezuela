-- Add WhatsApp contact field to help_requests so people can be reached directly
alter table public.help_requests
  add column if not exists whatsapp text;
