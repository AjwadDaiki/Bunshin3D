-- Fonction pour décrémenter les crédits
CREATE OR REPLACE FUNCTION decrement_credits(target_user_id uuid, amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET credits = GREATEST(credits - amount, 0),
      updated_at = now()
  WHERE id = target_user_id;
END;
$$;

-- Fonction pour incrémenter les crédits (déjà existe normalement)
CREATE OR REPLACE FUNCTION increment_credits(target_user_id uuid, amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET credits = credits + amount,
      updated_at = now()
  WHERE id = target_user_id;
END;
$$;

-- Ajouter une colonne 'type' à la table generations si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generations' AND column_name = 'type'
  ) THEN
    ALTER TABLE generations ADD COLUMN type text DEFAULT 'standard';
  END IF;
END $$;

-- Commentaires
COMMENT ON FUNCTION decrement_credits IS 'Décrémenter les crédits d''un utilisateur de manière atomique';
COMMENT ON FUNCTION increment_credits IS 'Incrémenter les crédits d''un utilisateur de manière atomique';
