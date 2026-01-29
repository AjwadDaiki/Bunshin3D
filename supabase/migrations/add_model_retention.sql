ALTER TABLE generations
ADD COLUMN IF NOT EXISTS model_storage_path TEXT,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION set_generation_expiry()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at := NOW() + INTERVAL '24 hours';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_generation_expiry ON generations;

CREATE TRIGGER set_generation_expiry
BEFORE INSERT ON generations
FOR EACH ROW EXECUTE FUNCTION set_generation_expiry();

UPDATE generations
SET expires_at = created_at + INTERVAL '24 hours'
WHERE expires_at IS NULL
  AND created_at IS NOT NULL;
