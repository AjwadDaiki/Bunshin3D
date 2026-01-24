-- ================================================
-- MIGRATION: Ajouter colonne r2_url pour stockage permanent Cloudflare R2
-- Exécuter dans Supabase Dashboard > SQL Editor
-- ================================================

-- Ajouter la colonne r2_url à la table generations
ALTER TABLE generations ADD COLUMN IF NOT EXISTS r2_url TEXT;

-- Créer un index pour les recherches par r2_url
CREATE INDEX IF NOT EXISTS idx_generations_r2_url ON generations(r2_url) WHERE r2_url IS NOT NULL;

-- Commentaire sur la colonne
COMMENT ON COLUMN generations.r2_url IS 'URL permanente du modèle 3D stocké sur Cloudflare R2';

-- ================================================
-- VÉRIFICATION
-- ================================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'generations' AND column_name = 'r2_url';
