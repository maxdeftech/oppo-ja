import { supabase } from '../lib/supabaseClient';

// Save a job
export async function saveJob(userId: string, jobId: string) {
    // Check if already saved
    const { data: existing } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', userId)
        .eq('job_id', jobId)
        .single();

    if (existing) {
        return existing;
    }

    const { data, error } = await supabase
        .from('saved_jobs')
        .insert({
            user_id: userId,
            job_id: jobId,
        } as any)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Remove saved job
export async function unsaveJob(userId: string, jobId: string) {
    const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', userId)
        .eq('job_id', jobId);

    if (error) throw error;
}

// Get user's saved jobs
export async function getSavedJobs(userId: string) {
    const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
      *,
      job_listings (
        id,
        title,
        company_name,
        location,
        type,
        salary_range,
        description,
        skills,
        is_featured,
        created_at
      )
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Check if job is saved
export async function isJobSaved(userId: string, jobId: string) {
    const { data, error } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', userId)
        .eq('job_id', jobId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
}
