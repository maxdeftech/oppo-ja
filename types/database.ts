export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    name: string
                    role: 'job_seeker' | 'business' | 'freelancer' | 'admin' | 'staff_verification'
                    avatar_url: string | null
                    verified: boolean
                    location: string | null
                    trn_encrypted: string | null
                    trn_masked: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    name: string
                    role?: 'job_seeker' | 'business' | 'freelancer' | 'admin' | 'staff_verification'
                    avatar_url?: string | null
                    verified?: boolean
                    location?: string | null
                    trn_encrypted?: string | null
                    trn_masked?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string
                    role?: 'job_seeker' | 'business' | 'freelancer' | 'admin' | 'staff_verification'
                    avatar_url?: string | null
                    verified?: boolean
                    location?: string | null
                    trn_encrypted?: string | null
                    trn_masked?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            job_listings: {
                Row: {
                    id: string
                    business_id: string
                    title: string
                    company_name: string
                    location: string
                    type: 'full_time' | 'part_time' | 'contract' | 'remote'
                    salary_range: string | null
                    description: string
                    skills: string[]
                    is_featured: boolean
                    status: 'active' | 'closed' | 'draft'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    business_id: string
                    title: string
                    company_name: string
                    location: string
                    type: 'full_time' | 'part_time' | 'contract' | 'remote'
                    salary_range?: string | null
                    description: string
                    skills?: string[]
                    is_featured?: boolean
                    status?: 'active' | 'closed' | 'draft'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    business_id?: string
                    title?: string
                    company_name?: string
                    location?: string
                    type?: 'full_time' | 'part_time' | 'contract' | 'remote'
                    salary_range?: string | null
                    description?: string
                    skills?: string[]
                    is_featured?: boolean
                    status?: 'active' | 'closed' | 'draft'
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            applications: {
                Row: {
                    id: string
                    job_id: string
                    user_id: string
                    status: 'submitted' | 'reviewing' | 'interview' | 'offer' | 'rejected'
                    cover_letter: string | null
                    resume_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    job_id: string
                    user_id: string
                    status?: 'submitted' | 'reviewing' | 'interview' | 'offer' | 'rejected'
                    cover_letter?: string | null
                    resume_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    job_id?: string
                    user_id?: string
                    status?: 'submitted' | 'reviewing' | 'interview' | 'offer' | 'rejected'
                    cover_letter?: string | null
                    resume_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            verification_requests: {
                Row: {
                    id: string
                    user_id: string
                    business_name: string
                    registration_number: string
                    trn: string
                    status: 'pending' | 'approved' | 'rejected'
                    reviewed_by: string | null
                    reviewed_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    business_name: string
                    registration_number: string
                    trn: string
                    status?: 'pending' | 'approved' | 'rejected'
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    business_name?: string
                    registration_number?: string
                    trn?: string
                    status?: 'pending' | 'approved' | 'rejected'
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            saved_jobs: {
                Row: {
                    id: string
                    user_id: string
                    job_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    job_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    job_id?: string
                    created_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
