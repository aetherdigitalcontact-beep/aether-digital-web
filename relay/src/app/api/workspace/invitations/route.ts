import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { requireWorkspaceAccess } from '@/lib/server/requireWorkspaceAccess';

export async function GET(req: NextRequest) {
    const { userId, workspaceId, error: wsError, status: wsStatus } = await requireWorkspaceAccess(req);
    if (wsError) return NextResponse.json({ error: wsError }, { status: wsStatus || 401 });

    try {
        const { data: userAccounts } = await supabaseServer.from('accounts').select('email').eq('id', userId).single();
        const userEmail = userAccounts?.email;

        const [outgoingRes, incomingRes] = await Promise.all([
            supabaseServer
                .from('workspace_invitations')
                .select('*')
                .eq('workspace_owner_id', workspaceId)
                .order('created_at', { ascending: false }),
            supabaseServer
                .from('workspace_invitations')
                .select('*, sender:accounts!workspace_invitations_workspace_owner_id_fkey(email)')
                .eq('invited_email', userEmail)
                .order('created_at', { ascending: false })
        ]);

        // Fallback if join fails (e.g. FK name different)
        let incomingData = incomingRes.data || [];
        if (incomingRes.error || !incomingData.some(i => (i as any).sender)) {
            const { data: altIncoming } = await supabaseServer
                .from('workspace_invitations')
                .select('*')
                .eq('invited_email', userEmail)
                .order('created_at', { ascending: false });

            if (altIncoming && altIncoming.length > 0) {
                const ownerIds = [...new Set(altIncoming.map(i => i.workspace_owner_id))];
                const { data: owners } = await supabaseServer
                    .from('accounts')
                    .select('id, email')
                    .in('id', ownerIds);

                incomingData = altIncoming.map(i => ({
                    ...i,
                    sender_email: owners?.find(o => o.id === i.workspace_owner_id)?.email || 'Unknown Protocol'
                }));
            }
        } else {
            incomingData = incomingData.map((i: any) => ({
                ...i,
                sender_email: i.sender?.email || 'Unknown Protocol'
            }));
        }

        return NextResponse.json({
            invitations: outgoingRes.data || [],
            incoming: incomingData
        });
    } catch (e) {
        return NextResponse.json({ error: 'Signal failure' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { userId, workspaceId, error: wsError, status: wsStatus } = await requireWorkspaceAccess(req);
    if (wsError) return NextResponse.json({ error: wsError }, { status: wsStatus || 401 });

    try {
        const { emails } = await req.json();
        if (!emails) {
            return NextResponse.json({ error: 'No telemetry signals provided.' }, { status: 400 });
        }

        const emailList = emails.split(',').map((e: string) => e.trim().toLowerCase()).filter((e: string) => e.length > 0);
        if (emailList.length === 0) {
            return NextResponse.json({ error: 'No valid signals detected.' }, { status: 400 });
        }

        // Check plan limits of the owner
        const { data: userData } = await supabaseServer
            .from('accounts')
            .select('plan')
            .eq('id', workspaceId)
            .single();

        const plan = (userData?.plan || 'FREE').toUpperCase();

        // Count current members assigned to this workspace
        const { count: memberCount } = await supabaseServer
            .from('workspace_members')
            .select('*', { count: 'exact', head: true })
            .eq('workspace_owner_id', workspaceId);

        const currentMemberCount = memberCount || 0;

        if (plan === 'FREE' && currentMemberCount >= 1) {
            return NextResponse.json({ error: 'TELEMETRY LIMIT: Your current uplink is restricted to 1 active co-pilot. Upgrade protocol to expand your crew.' }, { status: 400 });
        }

        if (plan === 'FREE' && (currentMemberCount + emailList.length) > 1) {
            return NextResponse.json({ error: 'TELEMETRY LIMIT: Adding these pilots would exceed your current uplink capacity (Max 1). Upgrade protocol.' }, { status: 400 });
        }

        const foundUsers = [];
        const missingUsers = [];

        for (const email of emailList) {
            // Check auth.users via admin
            const { data: { users }, error: searchError } = await supabaseServer.auth.admin.listUsers();

            const targetUser = users?.find(u => u.email?.toLowerCase() === email);

            if (targetUser) {
                foundUsers.push({
                    workspace_owner_id: workspaceId,
                    invited_email: email,
                    status: 'PENDING'
                });
            } else {
                missingUsers.push(email);
            }
        }

        if (foundUsers.length === 0) {
            return NextResponse.json({ error: 'No active pilots found matching the specified telemetry.' }, { status: 404 });
        }

        // Insert invitations
        const { error: insertError } = await supabaseServer
            .from('workspace_invitations')
            .upsert(foundUsers, { onConflict: 'workspace_owner_id,invited_email' });

        if (insertError) {
            console.error('[INVITE-ERROR]', insertError);
            return NextResponse.json({
                error: 'Uplink transmission failed at payload injection.',
                details: insertError.message,
                code: insertError.code
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            found: foundUsers.length,
            missing: missingUsers
        });

    } catch (error: any) {
        console.error('[WORKSPACE-INVITE-CRASH]', error);
        return NextResponse.json({ error: 'Critical signal failure.' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const { userId, workspaceId, error: wsError, status: wsStatus } = await requireWorkspaceAccess(req);
    if (wsError) return NextResponse.json({ error: wsError }, { status: wsStatus || 401 });

    try {
        const { data: userAccounts } = await supabaseServer.from('accounts').select('email').eq('id', userId).single();
        const userEmail = userAccounts?.email;

        const { invitationId, action } = await req.json();

        if (!invitationId || !action) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // 1. Fetch invitation and verify recipient
        const { data: invitation, error: fetchError } = await supabaseServer
            .from('workspace_invitations')
            .select('*')
            .eq('id', invitationId)
            .single();

        if (fetchError || !invitation) {
            return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
        }

        if (invitation.invited_email.toLowerCase() !== userEmail?.toLowerCase() && action !== 'REVOKE') {
            return NextResponse.json({ error: 'Unauthorized response' }, { status: 403 });
        }

        if (action === 'ACCEPT') {
            // 2. Add to workspace_members
            const { error: memberError } = await supabaseServer
                .from('workspace_members')
                .upsert([
                    { workspace_owner_id: invitation.workspace_owner_id, member_id: userId, role: 'PILOT' }
                ], { onConflict: 'workspace_owner_id,member_id' });

            if (memberError) {
                console.error('[ACCEPT-MEMBER-ERROR]', memberError);
                return NextResponse.json({
                    error: 'Failed to link workspace.',
                    details: memberError.message,
                    code: memberError.code
                }, { status: 500 });
            }

            // 3. Update invitation status
            await supabaseServer
                .from('workspace_invitations')
                .update({ status: 'ACCEPTED' })
                .eq('id', invitationId);

        } else if (action === 'DECLINE') {
            await supabaseServer
                .from('workspace_invitations')
                .update({ status: 'DECLINED' })
                .eq('id', invitationId);
        } else if (action === 'REVOKE') {
            // Delete the invitation (used by owner)
            await supabaseServer
                .from('workspace_invitations')
                .delete()
                .eq('id', invitationId);
        }

        return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json({ error: 'Signal failure' }, { status: 500 });
    }
}
