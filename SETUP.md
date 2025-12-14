# MaxwellConnect - Supabase Setup Guide

## Quick Start

### 1. Install Dependencies
Dependencies have already been installed. If you need to reinstall:
```bash
npm install
```

### 2. Configure Supabase

Your Supabase credentials are already configured in `.env.local`:
- **URL**: https://sllizhhnpyovcurzzwld.supabase.co
- **Anon Key**: (configured)

### 3. Create Database Tables

**IMPORTANT**: You need to run the SQL schema in your Supabase project:

1. Go to your Supabase Dashboard: https://app.supabase.com/project/sllizhhnpyovcurzzwld
2. Navigate to the **SQL Editor** in the left sidebar
3. Create a new query
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run** to execute the script

This will create:
- All necessary tables (users, job_listings, applications, verification_requests, saved_jobs)
- Indexes for performance
- Row Level Security (RLS) policies
- Sample data for testing

### 4. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Features Implemented

### ✅ Core Features
- **Authentication**: Sign up, sign in, sign out with Supabase Auth
- **User Profiles**: Automatic profile creation with TRN verification support
- **Job Listings**: Browse, filter, and search jobs by parish and type
- **Applications**: Apply to jobs and track application status
- **Verifications**: TRN and business verification workflow for admins
- **Saved Jobs**: Bookmark jobs for later

### ✅ User Roles
- **Job Seekers**: Browse jobs, apply, track applications
- **Businesses**: Post jobs, manage applications
- **Admins**: Verify TRN/business registrations, platform oversight

### 🎨 UI Preserved
All existing UI components, styling, and user experience remain unchanged. Only the data layer has been updated to use Supabase.

## Testing the Application

### Test Accounts
The database includes sample users (you'll need to create auth accounts for these):

1. **Admin**: admin@maxwellconnect.com
2. **Business**: business@example.com
3. **Job Seeker**: jobseeker@example.com

### Testing Workflow

1. **Register a New Account**
   - Click "Get Started" or "Create Account"
   - Choose your role (Job Seeker, Business, or Admin)
   - Fill in your details
   - Optional: Add TRN for verification

2. **Browse Jobs**
   - Navigate to "Find Jobs"
   - Filter by parish (Kingston, St. James, etc.)
   - Filter by job type (Full-time, Part-time, Contract, Remote)
   - View job details

3. **Apply to Jobs** (Job Seekers)
   - Click on a job card
   - Submit application
   - Track status in your dashboard

4. **Post Jobs** (Business Users)
   - Go to Dashboard
   - Click "Post New Job"
   - Fill in job details
   - Manage applications

5. **Verify Users** (Admins)
   - Access Admin Portal
   - Review pending TRN verifications
   - Approve or reject requests

## Database Schema

### Tables
- `users` - User profiles with role-based access
- `job_listings` - Job postings with location and type
- `applications` - Job applications with status tracking
- `verification_requests` - TRN/business verification queue
- `saved_jobs` - User bookmarks

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Business owners can manage their own jobs and applications
- Admins have elevated permissions for verifications

## API Structure

All API functions are organized in the `/api` directory:
- `auth.ts` - Authentication and user management
- `jobs.ts` - Job listings CRUD operations
- `applications.ts` - Application management
- `verifications.ts` - Verification workflow
- `savedJobs.ts` - Saved jobs functionality

## Troubleshooting

### "Failed to load jobs"
- Ensure the database schema has been created
- Check that sample data was inserted
- Verify your Supabase URL and anon key in `.env.local`

### Authentication Errors
- Make sure you've enabled Email auth in Supabase Dashboard → Authentication → Providers
- Check that RLS policies are properly set up

### TypeScript Errors in API Files
- These are expected until the database tables are created
- Run the `supabase-schema.sql` script to resolve them

## Next Steps

### Additional Features to Implement
- Real-time notifications for new jobs
- File upload for resumes (Supabase Storage)
- Advanced search with full-text search
- Email notifications for application status changes
- Business analytics dashboard with charts

### Deployment
When ready to deploy:
1. Update environment variables for production
2. Run `npm run build`
3. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)
4. Ensure Supabase project is in production mode

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review the implementation plan in the artifacts directory
- Contact Maxwell Definitive Technologies support
