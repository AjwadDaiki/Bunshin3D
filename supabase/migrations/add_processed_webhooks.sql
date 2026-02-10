-- Idempotency store for Stripe webhook processing.
-- One Checkout Session must be credited only once.
CREATE TABLE IF NOT EXISTS public.processed_webhooks (
  stripe_session_id text PRIMARY KEY,
  stripe_event_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  event_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz NULL
);

CREATE INDEX IF NOT EXISTS idx_processed_webhooks_user_id
  ON public.processed_webhooks (user_id);
