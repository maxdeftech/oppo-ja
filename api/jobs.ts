import { supabase } from '../lib/supabaseClient';
import { Parish, JobType } from '../types';

export interface JobFilters {
    parish?: string;
    type?: string;
    salaryMin?: number;
    salaryMax?: number;
    search?: string;
}

export interface CreateJobData {
    title: string;
    companyName: string;
    location: Parish;
    type: JobType;
    salaryRange?: string;
    description: string;
    skills: string[];
    isFeatured?: boolean;
}

// Get all jobs with filters
export async function getJobs(filters?: JobFilters) {
    try {
        let query = supabase
            .from('job_listings')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (filters?.parish) {
            query = query.eq('location', filters.parish);
        }

        if (filters?.type) {
            query = query.eq('type', filters.type.toLowerCase().replace('-', '_') as 'full_time' | 'part_time' | 'contract' | 'remote');
        }

        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error: any) {
        console.error('Get jobs error:', error);
        throw error;
    }
}

// Get single job by ID
export async function getJobById(id: string) {
    const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

// Create new job listing
export async function createJob(businessId: string, jobData: CreateJobData) {
    const { data, error } = await supabase
        .from('job_listings')
        .insert({
            business_id: businessId,
            title: jobData.title,
            company_name: jobData.companyName,
            location: jobData.location,
            type: jobData.type.toLowerCase().replace('-', '_'),
            salary_range: jobData.salaryRange || null,
            description: jobData.description,
            skills: jobData.skills,
            is_featured: jobData.isFeatured || false,
            status: 'active',
        } as any)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Update job listing
export async function updateJob(id: string, updates: Partial<CreateJobData>) {
    const { data, error } = await supabase
        .from('job_listings')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        } as any)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Delete job listing
export async function deleteJob(id: string) {
    const { error } = await supabase
        .from('job_listings')
        .update({ status: 'closed' } as any)
        .eq('id', id);

    if (error) throw error;
}

// Get featured jobs
export async function getFeaturedJobs(limit: number = 3) {
    const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
}

// Get jobs by business
export async function getBusinessJobs(businessId: string) {
    const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get application count for a job
export async function getJobApplicationCount(jobId: string) {
    const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('job_id', jobId);

    if (error) throw error;
    return count || 0;
}
