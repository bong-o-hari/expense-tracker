-- +migrate Down
ALTER TABLE expenses DROP COLUMN deleted_at;