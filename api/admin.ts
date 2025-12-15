import { supabase } from '../lib/supabaseClient';

// Get all users (Admin/CEO only)
export async function getAllUsers() {
    // In a real app, this should be secured by RLS
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get platform stats (CEO/Admin)
export async function getPlatformStats() {
    // This aggregates data from multiple tables
    const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: jobsCount } = await supabase.from('job_listings').select('*', { count: 'exact', head: true });
    const { count: applicationsCount } = await supabase.from('applications').select('*', { count: 'exact', head: true });

    // Revenue mock calculation (since verified businesses might pay)
    const revenue = Math.floor(Math.random() * 5000000) + 1000000;

    return {
        users: usersCount || 0,
        jobs: jobsCount || 0,
        applications: applicationsCount || 0,
        revenue
    };
}

// Purge database (Mock - CEO only)
export async function purgeDatabase() {
    // DANGEROUS: In a real app, this would delete all data
    // For this demo, we simulate a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
}

// Backup database (Mock - CEO only)
export async function backupDatabase() {
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 3000));
    return true;
}

// Get pending admin/business requests (for CEO)
export async function getPendingAdmins() {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin')
        .eq('verified', false)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Approve admin/user
export async function approveUser(userId: string) {
    const { data, error } = await supabase
        .from('users')
        .update({ verified: true })
        .eq('id', userId)
        .select();

    if (error) throw error;
    return data;
}

// Reject admin/user (delete)
export async function rejectUser(userId: string) {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

    if (error) throw error;
    return true;
}
