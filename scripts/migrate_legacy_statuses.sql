-- Normalize legacy order statuses to current enum
UPDATE orders SET status = 'DELIVERED' WHERE status = 'COMPLETED';
UPDATE orders SET status = 'DELIVERED' WHERE status = 'completed';
UPDATE orders SET status = 'PLACED' WHERE status = 'pending';
