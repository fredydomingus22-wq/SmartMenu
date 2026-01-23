-- RLS POLICIES FOR HIERARCHICAL MULTI-TENANCY (ORGANIZATION & TENANT)
-- FIXED: Added explicit ::TEXT casting to UUID comparisons to avoid "operator does not exist: text = uuid" errors.

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
  FOR SELECT USING (id::TEXT = get_my_org_id()::TEXT);

-- 2. Tenants Policy (Users can see tenants within their organization)
CREATE POLICY "Users can see tenants in their org" ON tenants
  FOR SELECT USING (organization_id::TEXT = get_my_org_id()::TEXT);

-- 3. Users Policy (Users can see other users in their organization)
CREATE POLICY "Users can see colleagues in their org" ON users
  FOR SELECT USING (organization_id::TEXT = get_my_org_id()::TEXT);

-- 4. Categories Policy (Hierarchical: Org + Tenant)
CREATE POLICY "Users can manage categories in their tenant" ON categories
  FOR ALL USING (
    organization_id::TEXT = get_my_org_id()::TEXT AND 
    tenant_id::TEXT = get_my_tenant_id()::TEXT
  );

-- 5. Products Policy
CREATE POLICY "Users can manage products in their tenant" ON products
  FOR ALL USING (
    organization_id::TEXT = get_my_org_id()::TEXT AND 
    tenant_id::TEXT = get_my_tenant_id()::TEXT
  );

-- 6. Tables Policy
CREATE POLICY "Users can manage tables in their tenant" ON tables
  FOR ALL USING (
    organization_id::TEXT = get_my_org_id()::TEXT AND 
    tenant_id::TEXT = get_my_tenant_id()::TEXT
  );

-- 7. Orders Policy
CREATE POLICY "Users can manage orders in their tenant" ON orders
  FOR ALL USING (
    organization_id::TEXT = get_my_org_id()::TEXT AND 
    tenant_id::TEXT = get_my_tenant_id()::TEXT
  );

-- 8. Order Items Policy
CREATE POLICY "Users can manage order items in their tenant" ON order_items
  FOR ALL USING (
    organization_id::TEXT = get_my_org_id()::TEXT AND 
    tenant_id::TEXT = get_my_tenant_id()::TEXT
  );
