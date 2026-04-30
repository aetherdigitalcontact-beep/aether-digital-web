-- Co-Pilots / Workspace Schema

-- Workspace Members
CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'PILOT', -- 'OWNER', 'ADMIN', 'PILOT'
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_owner_id, member_id)
);

-- Workspace Invitations
CREATE TABLE IF NOT EXISTS workspace_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    invited_email TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'DECLINED'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_owner_id, invited_email)
);

-- Workspace Requests (Users requesting to join)
CREATE TABLE IF NOT EXISTS workspace_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'DECLINED'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_owner_id, requester_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workspace_members_owner ON workspace_members(workspace_owner_id);
CREATE INDEX IF NOT EXISTS idx_workspace_invitations_owner ON workspace_invitations(workspace_owner_id);
CREATE INDEX IF NOT EXISTS idx_workspace_requests_owner ON workspace_requests(workspace_owner_id);

-- Enable RLS
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_requests ENABLE ROW LEVEL SECURITY;

-- Note: Policies are not strictly required if only using the service_role key from the backend.
