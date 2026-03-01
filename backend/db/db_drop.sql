-- ==========================================
-- Удаление триггеров
-- ==========================================

DROP TRIGGER IF EXISTS trg_auto_cancel_time ON bookings;
DROP TRIGGER IF EXISTS trg_restore_ticket_quantity ON bookings;
DROP TRIGGER IF EXISTS trg_decrease_ticket_quantity ON bookings;
DROP TRIGGER IF EXISTS trg_check_event_availability ON bookings;

-- ==========================================
-- Удаление функций
-- ==========================================

DROP FUNCTION IF EXISTS auto_set_cancelled_at();
DROP FUNCTION IF EXISTS restore_ticket_quantity();
DROP FUNCTION IF EXISTS decrease_ticket_quantity();
DROP FUNCTION IF EXISTS check_event_availability();

-- ==========================================
-- Удаление таблиц
-- ==========================================

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS events;