import { supabase } from '../lib/supabaseClient';
import type { Database } from '../types/database';

export interface ApplicationData {
    jobId: string;
    userId: string;
    coverLetter?: string;
    resumeUrl?: string;
}

// Submit job application
export async function submitApplication(data: ApplicationData) {
    // Check if already applied
    const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', data.jobId)
        .eq('user_id', data.userId)
        .single();

    if (existing) {
        throw new Error('You have already applied to this job');
    }

    const { data: application, error } = await supabase
        .from('applications')
        .insert({
            job_id: data.jobId,
            user_id: data.userId,
            cover_letter: data.coverLetter || null,
            resume_url: data.resumeUrl || null,
            status: 'submitted',
        } as any)
        .select()
        .single();

    if (error) throw error;
    return application;
}

// Get user's applications
export async function getUserApplications(userId: string) {
    const { data, error } = await supabase
        .from('applications')
        .select(`
      *,
      job_listings (
        id,
        title,
        company_name,
        location,
        type
      )
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get applications for a job (business owner)
export async function getJobApplications(jobId: string) {
    const { data, error } = await supabase
        .from('applications')
        .select(`
      *,
      users (
        id,
        name,
        email,
        location,
        verified
      )
    `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Update application status
export async function updateApplicationStatus(
    applicationId: string,
    status: 'submitted' | 'reviewing' | 'interview' | 'offer' | 'rejected'
) {
    const { data, error } = await supabase
        .from('applications')
        .update({
            status,
        } as any)
        .eq('id', applicationId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Get application by ID
export async function getApplicationById(applicationId: string) {
    const { data, error } = await supabase
        .from('applications')
        .select(`
      *,
      job_listings (*),
      users (*)
    `)
        .eq('id', applicationId)
        .single();

    if (error) throw error;
    return data;
}
