CREATE OR REPLACE FUNCTION decrement_credits(amount integer, target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET credits = GREATEST(credits - amount, 0),
      updated_at = now()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', target_user_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION increment_credits(amount integer, target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET credits = credits + amount,
      updated_at = now()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', target_user_id;
  END IF;
END;
$$;

COMMENT ON FUNCTION decrement_credits IS 'Décrémenter les crédits d''un utilisateur de manière atomique (paramètres en ordre alphabétique pour compatibilité Supabase JS)';
COMMENT ON FUNCTION increment_credits IS 'Incrémenter les crédits d''un utilisateur de manière atomique (paramètres en ordre alphabétique pour compatibilité Supabase JS)';
