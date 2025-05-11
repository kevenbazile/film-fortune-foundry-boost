
-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  subscription_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  status TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  metadata JSONB
);

-- Add RLS policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy for users to insert their own subscriptions
CREATE POLICY "Users can insert their own subscriptions" 
ON public.subscriptions 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own subscriptions
CREATE POLICY "Users can update their own subscriptions" 
ON public.subscriptions 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy for service role to manage all subscriptions
CREATE POLICY "Service role can manage all subscriptions" 
ON public.subscriptions 
FOR ALL 
TO service_role 
USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_subscription_id ON public.subscriptions (subscription_id);
