-- +migrate Up
ALTER TABLE expenses ADD COLUMN deleted_at TIMESTAMPTZ NULL;
