
-- Function to insert a community fund application
CREATE OR REPLACE FUNCTION public.insert_community_fund_application(
  user_id_input UUID,
  project_type_input TEXT,
  project_title_input TEXT,
  description_input TEXT,
  requested_amount_input DECIMAL,
  use_of_funds_input TEXT,
  expected_deliverables_input TEXT,
  timeline_input TEXT,
  target_audience_input TEXT,
  marketing_plan_input TEXT,
  revenue_projections_input JSONB,
  team_info_input TEXT,
  previous_work_input TEXT,
  additional_documents_input JSONB,
  status_input TEXT,
  submission_date_input TIMESTAMP WITH TIME ZONE
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.community_fund_applications (
    user_id,
    project_type,
    project_title,
    description,
    requested_amount,
    use_of_funds,
    expected_deliverables,
    timeline,
    target_audience,
    marketing_plan,
    revenue_projections,
    team_info,
    previous_work,
    additional_documents,
    status,
    submission_date
  ) VALUES (
    user_id_input,
    project_type_input,
    project_title_input,
    description_input,
    requested_amount_input,
    use_of_funds_input,
    expected_deliverables_input,
    timeline_input,
    target_audience_input,
    marketing_plan_input,
    revenue_projections_input,
    team_info_input,
    previous_work_input,
    additional_documents_input,
    status_input,
    submission_date_input
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Function to submit an investment application with JSON data
CREATE OR REPLACE FUNCTION public.submit_investment_application(application_data JSON)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.community_fund_applications (
    user_id,
    project_type,
    project_title,
    description,
    requested_amount,
    use_of_funds,
    expected_deliverables,
    timeline,
    target_audience,
    marketing_plan,
    revenue_projections,
    team_info,
    previous_work,
    additional_documents,
    status,
    submission_date
  ) VALUES (
    (application_data->>'user_id')::UUID,
    application_data->>'project_type',
    application_data->>'project_title',
    application_data->>'description',
    (application_data->>'requested_amount')::DECIMAL,
    application_data->>'use_of_funds',
    application_data->>'expected_deliverables',
    application_data->>'timeline',
    application_data->>'target_audience',
    application_data->>'marketing_plan',
    application_data->'revenue_projections',
    application_data->>'team_info',
    application_data->>'previous_work',
    application_data->'additional_documents',
    application_data->>'status',
    (application_data->>'submission_date')::TIMESTAMP WITH TIME ZONE
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;
