import { supabase } from '../lib/supabaseClient';

export interface VerificationRequestData {
    userId: string;
    businessName: string;
    registrationNumber: string;
    trn: string;
}

// Submit verification request
export async function submitVerificationRequest(data: VerificationRequestData) {
    const { data: request, error } = await supabase
        .from('verification_requests')
        .insert({
            user_id: data.userId,
            business_name: data.businessName,
            registration_number: data.registrationNumber,
            trn: data.trn,
            status: 'pending',
        } as any)
        .select()
        .single();

    if (error) throw error;
    return request;
}

// Get pending verifications (admin only)
export async function getPendingVerifications() {
    const { data, error } = await supabase
        .from('verification_requests')
        .select(`
      *,
      users (
        id,
        name,
        email
      )
    `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

// Approve verification
export async function approveVerification(requestId: string, adminId: string) {
    // Update verification request
    const { data: request, error: requestError } = await supabase
        .from('verification_requests')
        .update({
            status: 'approved',
            reviewed_by: adminId,
            reviewed_at: new Date().toISOString(),
        } as any)
        .eq('id', requestId)
        .select()
        .single();

    if (requestError) throw requestError;
    if (!request) throw new Error('Verification request not found');

    // Update user verification status
    const { error: userError } = await supabase
        .from('users')
        .update({ verified: true } as any)
        .eq('id', (request as any).user_id);

    if (userError) throw userError;

    return request;
}

// Reject verification
export async function rejectVerification(requestId: string, adminId: string) {
    const { data, error } = await supabase
        .from('verification_requests')
        .update({
            status: 'rejected',
            reviewed_by: adminId,
            reviewed_at: new Date().toISOString(),
        } as any)
        .eq('id', requestId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Get verification status for user
export async function getUserVerificationStatus(userId: string) {
    const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}
