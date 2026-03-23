-- Normalize legacy pending statuses so they appear in delivery views
UPDATE orders SET status = 'READY' WHERE status IN ('pending', 'PENDING');
