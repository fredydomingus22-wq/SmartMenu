CREATE OR REPLACE FUNCTION public.check_user_onboarding_status(user_id_param uuid)
RETURNS TABLE (has_tenant boolean, tenant_id_out text) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (up.tenant_id IS NOT NULL),
    up.tenant_id::text
  FROM public.user_profiles up
  WHERE up.id = user_id_param;
END;
$$;

-- Grant access to authenticated users and service role
GRANT EXECUTE ON FUNCTION public.check_user_onboarding_status(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_onboarding_status(uuid) TO service_role;
