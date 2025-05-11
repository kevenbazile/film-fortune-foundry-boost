
-- Function to retrieve community fund applications for a user
CREATE OR REPLACE FUNCTION public.get_community_fund_applications(user_id_param UUID)
RETURNS SETOF public.community_fund_applications
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.community_fund_applications
  WHERE user_id = user_id_param
  ORDER BY submission_date DESC;
$$;
