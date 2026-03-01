-- ==========================================
-- Таблица: Пользователь
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Таблица: Мероприятие
-- ==========================================
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    photo TEXT,
    duration INTEGER NOT NULL CHECK (duration > 0),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Таблица: Билет
-- ==========================================
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE
);

-- ==========================================
-- Таблица: Бронь
-- ==========================================
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    cancelled_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ==========================================
-- ИНДЕКСЫ
-- ==========================================

-- Поиск билетов по мероприятию
CREATE INDEX idx_tickets_event_id ON tickets(event_id);

-- Поиск броней по пользователю
CREATE INDEX idx_bookings_user_id ON bookings(user_id);

-- Фильтрация активных мероприятий
CREATE INDEX idx_events_available ON events(is_available)
WHERE deleted_at IS NULL;

-- ==========================================
-- ТРИГГЕРЫ
-- ==========================================

-- 1. Проверка доступности мероприятия перед бронированием
CREATE OR REPLACE FUNCTION check_event_availability()
RETURNS TRIGGER AS $$
DECLARE
    v_available BOOLEAN;
    v_deleted TIMESTAMP;
BEGIN
    SELECT e.is_available, e.deleted_at
    INTO v_available, v_deleted
    FROM events e
    JOIN tickets t ON t.event_id = e.id
    WHERE t.id = NEW.ticket_id;

    IF v_available = FALSE OR v_deleted IS NOT NULL THEN
        RAISE EXCEPTION 'Мероприятие недоступно или удалено';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_event_availability
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION check_event_availability();

-- 2. Уменьшение количества билетов при бронировании
CREATE OR REPLACE FUNCTION decrease_ticket_quantity()
RETURNS TRIGGER AS $$
DECLARE
    v_quantity INTEGER;
BEGIN
    SELECT quantity INTO v_quantity
    FROM tickets
    WHERE id = NEW.ticket_id
    FOR UPDATE;

    IF v_quantity <= 0 THEN
        RAISE EXCEPTION 'Нет доступных билетов';
    END IF;

    UPDATE tickets
    SET quantity = quantity - 1
    WHERE id = NEW.ticket_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_decrease_ticket_quantity
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION decrease_ticket_quantity();

-- 3. Возврат билета при отмене брони
CREATE OR REPLACE FUNCTION restore_ticket_quantity()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cancelled_at IS NOT NULL AND OLD.cancelled_at IS NULL THEN
        UPDATE tickets
        SET quantity = quantity + 1
        WHERE id = NEW.ticket_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_restore_ticket_quantity
AFTER UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION restore_ticket_quantity();

-- 4. Автоматическая установка времени отмены
CREATE OR REPLACE FUNCTION auto_set_cancelled_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cancelled_at IS NULL AND OLD.cancelled_at IS NULL AND NEW.is_used = FALSE THEN
        RETURN NEW;
    END IF;

    IF NEW.cancelled_at IS NULL AND OLD.cancelled_at IS NULL THEN
        NEW.cancelled_at := CURRENT_TIMESTAMP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_cancel_time
BEFORE UPDATE ON bookings
FOR EACH ROW
WHEN (OLD.cancelled_at IS NULL AND NEW.cancelled_at IS NOT NULL)
EXECUTE FUNCTION auto_set_cancelled_at();