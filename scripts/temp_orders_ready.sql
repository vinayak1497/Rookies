-- Temporary data fix to surface orders on Delivery page
UPDATE orders
SET status = 'READY'
WHERE status = 'PLACED';
