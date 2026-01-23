-- RLS POLICIES FOR HIERARCHICAL MULTI-TENANCY (ORGANIZATION & TENANT)

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Helper functions to get IDs from JWT
CREATE OR REPLACE FUNCTION get_my_org_id() 
RETURNS uuid AS $$
  SELECT COALESCE(
    NULLIF(current_setting('app.organization_id', true), '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'organization_id', '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'organization_id', '')::uuid
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION get_my_tenant_id() 
RETURNS uuid AS $$
  SELECT COALESCE(
    NULLIF(current_setting('app.tenant_id', true), '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'tenant_id', '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'tenant_id', '')::uuid
  );
$$ LANGUAGE sql STABLE;

-- 1. Organizations Policy (Users can see their own organization)
CREATE POLICY "Users can see their own organization" ON organizations
  FOR SELECT USING (id = get_my_org_id());

-- 2. Tenants Policy (Users can see tenants within their organization)
CREATE POLICY "Users can see tenants in their org" ON tenants
  FOR SELECT USING (organization_id = get_my_org_id());

-- 3. Users Policy (Users can see other users in their organization)
CREATE POLICY "Users can see colleagues in their org" ON users
  FOR SELECT USING (organization_id = get_my_org_id());

-- 4. Categories Policy (Hierarchical: Org + Tenant)
CREATE POLICY "Users can manage categories in their tenant" ON categories
  FOR ALL USING (
    organization_id = get_my_org_id() AND 
    tenant_id = get_my_tenant_id()
  );

-- 5. Products Policy
CREATE POLICY "Users can manage products in their tenant" ON products
  FOR ALL USING (
    organization_id = get_my_org_id() AND 
    tenant_id = get_my_tenant_id()
  );

-- 6. Tables Policy
CREATE POLICY "Users can manage tables in their tenant" ON tables
  FOR ALL USING (
    organization_id = get_my_org_id() AND 
    tenant_id = get_my_tenant_id()
  );

-- 7. Orders Policy
CREATE POLICY "Users can manage orders in their tenant" ON orders
  FOR ALL USING (
    organization_id = get_my_org_id() AND 
    tenant_id = get_my_tenant_id()
  );

-- 8. Order Items Policy
CREATE POLICY "Users can manage order items in their tenant" ON order_items
  FOR ALL USING (
    organization_id = get_my_org_id() AND 
    tenant_id = get_my_tenant_id()
  );

-- PUBLIC ACCESS POLICIES (For Menu Display)
-- Note: These use the tenant_id from the URL usually, but RLS needs to allow it.
-- For now, we allow select if organization_id matches (we'll need a way for public to get org_id)
-- BETTER: Allow select for public if tenant_id is provided in the query.

-- Example for public menu:
-- CREATE POLICY "Public can see products of a tenant" ON products
--   FOR SELECT USING (true); -- We rely on the API to filter by tenant_id for now, 
--                            -- but for true security we'd need more specific rules.
