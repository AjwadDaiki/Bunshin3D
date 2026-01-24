-- Créer le bucket pour les uploads d'images
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Politique RLS pour permettre les uploads aux utilisateurs authentifiés
CREATE POLICY IF NOT EXISTS "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique RLS pour lecture publique
CREATE POLICY IF NOT EXISTS "Public can read uploads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'uploads');

-- Politique RLS pour suppression par le propriétaire
CREATE POLICY IF NOT EXISTS "Users can delete their own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
