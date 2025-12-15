import { supabase } from '../lib/supabaseClient';
import { UserRole, Parish } from '../types';

export interface SignUpData {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    location?: Parish;
    trn?: string;
}

export interface SignInData {
    email: string;
    password: string;
}

// Sign up new user
export async function signUp(data: SignUpData) {
    try {
        // Create auth user with metadata
        // The trigger in supabase-schema.sql will automatically create the public.users record
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                emailRedirectTo: import.meta.env.PROD ? 'https://maxdeftech.github.io/oppo-ja/' : window.location.origin,
                data: {
                    name: data.name,
                    role: data.role.toLowerCase(),
                    location: data.location || null,
                    trn_encrypted: data.trn || null,
                    trn_masked: data.trn ? `***-***-${data.trn.slice(-3)}` : null,
                }
            }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('User creation failed');

        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Fetch the created profile to ensure it exists and return it
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (userError) {
            // Check if we have a session. If not, email verification is likely pending.
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Email verification required. Return a placeholder so UI can show "Check Email".
                // We cannot insert manually without a session (RLS blocks it).
                console.log('User created but no session. Email verification likely required.');
                return {
                    user: authData.user,
                    profile: {
                        id: authData.user.id,
                        email: data.email,
                        name: data.name,
                        role: data.role.toLowerCase(), // Optimistic role
                        verified: false,
                        email_verification_pending: true // Flag for UI
                    }
                };
            }

            // If we have a session but no profile, the trigger might have failed.
            // Retrying fetch once more before giving up.
            await new Promise(resolve => setTimeout(resolve, 2000));

            const { data: retryData, error: retryError } = await supabase
                .from('users')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            if (retryError) {
                console.warn('Profile creation trigger failed or delayed:', retryError);
                // Return the auth user anyway so the UI can handle the "Check Email" state
                return {
                    user: authData.user,
                    profile: {
                        id: authData.user.id,
                        email: data.email,
                        name: data.name,
                        role: data.role.toLowerCase(),
                        verified: false,
                        email_verification_pending: true
                    }
                };
            }

            return { user: authData.user, profile: retryData };
        }

        return { user: authData.user, profile: userData };
    } catch (error: any) {
        console.error('Sign up error:', error);
        throw error;
    }
}

// Sign in existing user
export async function signIn(data: SignInData) {
    try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Sign in failed');

        // Get user profile
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();

        if (userError) throw userError;

        // Handle missing profile
        if (!userData) {
            console.warn('User profile missing for ID:', authData.user.id);
            return {
                user: authData.user,
                profile: {
                    id: authData.user.id,
                    email: authData.user.email,
                    name: authData.user.user_metadata?.name || 'Unknown User',
                    role: (authData.user.user_metadata?.role || 'job_seeker') as UserRole,
                    verified: false,
                    location: authData.user.user_metadata?.location || null
                }
            };
        }

        return { user: authData.user, profile: userData };
    } catch (error: any) {
        console.error('Sign in error:', error);
        throw error;
    }
}

// Sign out
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// Get current user
export async function getCurrentUser() {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) return null;

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (userError) throw userError;

        // If profile missing (zombie account), return minimal structure
        if (!userData) {
            console.warn('User profile missing for ID:', user.id);
            return {
                user,
                profile: {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || 'Unknown User',
                    role: (user.user_metadata?.role || 'job_seeker') as UserRole,
                    verified: false,
                    location: user.user_metadata?.location || null
                }
            };
        }

        return { user, profile: userData };
    } catch (error: any) {
        // Suppress "Auth session missing" error as it's expected for guests
        if (error?.message?.includes('AuthSessionMissingError') || error?.name === 'AuthSessionMissingError') {
            return null;
        }

        // Handle invalid refresh token by clearing session
        if (error?.message?.includes('Invalid Refresh Token') ||
            error?.message?.includes('Refresh Token Not Found') ||
            error?.code === 'PGRST301') { // JWT expired often bubbles as this too
            console.warn('Session invalid, clearing storage:', error.message);
            await supabase.auth.signOut();
            return null;
        }

        console.error('Get current user error:', error);
        return null;
    }
}

// Update user profile
export async function updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
        .from('users')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        } as any)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
            const userData = await getCurrentUser();
            callback(userData);
        } else {
            callback(null);
        }
    });
}
