import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { User, UserRole, Parish, JobType } from './types';
import {
  Briefcase,
  MapPin,
  CheckCircle,
  ArrowRight,
  Shield,
  Search,
  Building,
  DollarSign,
  TrendingUp,
  Loader2,
  Bookmark,
  BookmarkCheck,
  Filter,
  X,
  Clock,
  AlertCircle,
  FileText,
  ChevronRight,
  Menu,
  User as UserIcon,
  LogOut,
  Users,
  Database,
  Trash2,
  Download
} from 'lucide-react';
import { PARISHES, JOB_TYPES } from './constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import * as authApi from './api/auth';
import * as jobsApi from './api/jobs';
import * as applicationsApi from './api/applications';
import * as verificationsApi from './api/verifications';
import * as adminApi from './api/admin';
import * as savedJobsApi from './api/savedJobs';

// --- SUB-COMPONENTS (IN-FILE FOR SIMPLICITY DUE TO RESTRICTIONS) ---

const JobCard: React.FC<{ job: any, onApply: () => void }> = ({ job, onApply }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">{job.title}</h3>
        <div className="flex items-center text-gray-500 mt-1">
          <Building className="w-4 h-4 mr-1" />
          <span className="text-sm">{job.companyName}</span>
          <span className="mx-2">•</span>
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{job.location}</span>
        </div>
      </div>
      {job.isFeatured && (
        <span className="bg-violet-50 text-violet-700 text-xs px-2 py-1 rounded-full font-medium border border-violet-100">
          Featured
        </span>
      )}
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {job.type}
      </span>
      {job.salaryRange && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
          {job.salaryRange}
        </span>
      )}
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
        {job.postedDate}
      </span>
    </div>

    <p className="mt-4 text-sm text-gray-600 line-clamp-2">{job.description}</p>

    <div className="mt-6 flex items-center justify-between">
      <div className="flex -space-x-2">
        {/* Fake applicant avatars */}
        <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
        <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white"></div>
        <span className="text-xs text-gray-500 pl-8">+12 applied</span>
      </div>
      <button
        onClick={onApply}
        className="text-violet-600 text-sm font-medium hover:text-violet-800 flex items-center"
      >
        View Details <ArrowRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  </div>
);

// --- PAGES ---

const LandingPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <div className="bg-white">
    {/* Hero */}
    <div className="relative overflow-hidden bg-violet-900 pb-16 pt-20 lg:pb-32 lg:pt-32">
      <div className="absolute inset-0">
        <img
          className="h-full w-full object-cover opacity-10"
          src="https://picsum.photos/1920/1080?grayscale"
          alt="Jamaica Professional Background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-500 opacity-90"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Connect with Jamaica's <span className="text-violet-400">Best Talent</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            The only employment marketplace with verified TRN identity checks.
            Find work, hire professionals, and grow your business with confidence.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={() => onNavigate('register')}
              className="rounded-md bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gradient-to-r from-violet-600 to-blue-500-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
            >
              Create Account
            </button>
            <button onClick={() => onNavigate('jobs')} className="text-sm font-semibold leading-6 text-white flex items-center">
              Browse Jobs <span aria-hidden="true" className="ml-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Features */}
    <div className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-violet-600">Secure & Reliable</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to work confidently
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <div className="relative pl-16 group hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl p-4 -ml-4">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="ml-2">TRN Verified Identity</span>
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600 ml-2">
                We verify every user against Jamaica's Tax Administration database to ensure authenticity and reduce fraud.
              </dd>
            </div>
            <div className="relative pl-16 group hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl p-4 -ml-4">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600 group-hover:scale-110 transition-transform">
                  <MapPin className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="ml-2">Parish-based Matching</span>
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600 ml-2">
                Find jobs specifically in your parish. Filter by Kingston, St. James, Manchester, and more.
              </dd>
            </div>
            <div className="relative pl-16 group hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl p-4 -ml-4">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="ml-2">Enterprise Tools</span>
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600 ml-2">
                Advanced applicant tracking, interview scheduling, and team collaboration tools for businesses.
              </dd>
            </div>
            <div className="relative pl-16 group hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl p-4 -ml-4">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="ml-2">MDT Support</span>
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600 ml-2">
                Backed by Maxwell Definitive Technologies with dedicated support staff for compliance and mediation.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const AuthPage = ({ type, onLogin }: { type: 'login' | 'register', onLogin: (user: any) => void }) => {
  const [role, setRole] = useState<UserRole>(UserRole.JOB_SEEKER);
  const [trn, setTrn] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (type === 'register') {
        const result = await authApi.signUp({
          email,
          password,
          name,
          role,
          location: Parish.KINGSTON,
          trn: trn || undefined,
        });

        if (result.profile) {
          onLogin(transformUserProfile(result.profile));
        }
      } else {
        const result = await authApi.signIn({ email, password });
        if (result.profile) {
          onLogin(transformUserProfile(result.profile));
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const transformUserProfile = (profile: any): User => ({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role.toUpperCase() as UserRole,
    verified: profile.verified,
    location: profile.location as Parish,
    trnMasked: profile.trn_masked,
    avatarUrl: profile.avatar_url,
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {type === 'login' ? 'Sign in to your account' : 'Create your secure account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or <button className="font-medium text-violet-600 hover:text-violet-500">
              {type === 'login' ? 'start a 14-day business trial' : 'contact sales for enterprise'}
            </button>
          </p>
        </div>

        {type === 'register' && (
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setRole(UserRole.JOB_SEEKER)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${role === UserRole.JOB_SEEKER ? 'bg-violet-100 text-violet-800 ring-2 ring-violet-500' : 'bg-gray-100 text-gray-500'}`}
            >
              Job Seeker
            </button>
            <button
              onClick={() => setRole(UserRole.BUSINESS)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${role === UserRole.BUSINESS ? 'bg-violet-100 text-violet-800 ring-2 ring-violet-500' : 'bg-gray-100 text-gray-500'}`}
            >
              Business
            </button>
            <button
              onClick={() => setRole(UserRole.CEO)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${role === UserRole.CEO ? 'bg-violet-100 text-violet-800 ring-2 ring-violet-500' : 'bg-gray-100 text-gray-500'}`}
            >
              CEO
            </button>
            <button
              onClick={() => setRole(UserRole.ADMIN)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${role === UserRole.ADMIN ? 'bg-violet-100 text-violet-800 ring-2 ring-violet-500' : 'bg-gray-100 text-gray-500'}`}
            >
              Admin (Demo)
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            {type === 'register' && (
              <div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="relative block w-full rounded-t-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                  placeholder="Full Name"
                />
              </div>
            )}
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`relative block w-full ${type === 'login' ? 'rounded-t-md' : ''} border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6`}
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`relative block w-full ${type === 'login' && !role ? 'rounded-b-md' : ''} border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6`}
                placeholder="Password"
              />
            </div>
            {type === 'register' && (
              <div>
                <input
                  type="text"
                  value={trn}
                  onChange={(e) => setTrn(e.target.value)}
                  className={`relative block w-full rounded-b-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6 ${trn.length > 0 && trn.length < 9 ? 'bg-red-50' : ''
                    }`}
                  placeholder="TRN (Format: 000-000-000) - Optional"
                />
                <p className="mt-1 text-xs text-gray-500 px-1 flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Your TRN is encrypted and used solely for identity verification.
                </p>
              </div>
            )}
            {type === 'login' && (
              <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 rounded-b-md">
                <label className="text-xs text-gray-500 block mb-1">Select Role to Simulate:</label>
                <select
                  className="w-full text-sm border-gray-300 rounded"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value={UserRole.JOB_SEEKER}>Job Seeker</option>
                  <option value={UserRole.BUSINESS}>Business Owner</option>
                  <option value={UserRole.CEO}>CEO / Executive</option>
                  <option value={UserRole.ADMIN}>MDT Admin</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-violet-600 to-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-gradient-to-r from-violet-600 to-blue-500-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                type === 'login' ? 'Sign in' : 'Complete Verification'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const JobSearchPage = ({ onViewDetails }: { onViewDetails: (jobId: string) => void }) => {
  const [filterParish, setFilterParish] = useState('');
  const [filterType, setFilterType] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, [filterParish, filterType]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await jobsApi.getJobs({
        parish: filterParish || undefined,
        type: filterType || undefined,
      });

      // Transform data to match UI expectations
      const transformedJobs = data.map((job: any) => ({
        id: job.id,
        title: job.title,
        companyName: job.company_name,
        location: job.location,
        type: job.type.replace('_', '-'),
        salaryRange: job.salary_range,
        postedDate: formatDate(job.created_at),
        description: job.description,
        skills: job.skills || [],
        isFeatured: job.is_featured,
      }));

      setJobs(transformedJobs);
    } catch (err: any) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Search className="w-4 h-4 mr-2" /> Filters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parish</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                  value={filterParish}
                  onChange={(e) => setFilterParish(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {PARISHES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-1/2 rounded-md border-gray-300 text-sm" />
                  <input type="number" placeholder="Max" className="w-1/2 rounded-md border-gray-300 text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${jobs.length} Jobs Found`}
            </h2>
            <select className="rounded-md border-gray-300 text-sm">
              <option>Most Recent</option>
              <option>Highest Salary</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No jobs found. Try adjusting your filters.</p>
                </div>
              ) : (
                jobs.map(job => (
                  <JobCard key={job.id} job={job} onApply={() => onViewDetails(job.id)} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ user }: { user: User }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'verifications'>('overview');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerifications();
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    if (user.role === UserRole.ADMIN) {
      try {
        const users = await adminApi.getAllUsers();
        setAllUsers(users);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const data = await verificationsApi.getPendingVerifications();
      setVerifications(data.map((v: any) => ({
        id: v.id,
        businessName: v.business_name,
        registrationNumber: v.registration_number,
        trn: v.trn,
        status: v.status,
        submittedDate: new Date(v.created_at).toLocaleDateString(),
      })));
    } catch (error) {
      console.error('Error loading verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, adminId: string) => {
    try {
      await verificationsApi.approveVerification(id, adminId);
      loadVerifications();
    } catch (error) {
      console.error('Error approving verification:', error);
      alert('Failed to approve verification');
    }
  };

  const handleReject = async (id: string, adminId: string) => {
    try {
      await verificationsApi.rejectVerification(id, adminId);
      loadVerifications();
    } catch (error) {
      console.error('Error rejecting verification:', error);
      alert('Failed to reject verification');
    }
  };

  const stats = [
    { name: 'Pending Verifications', value: verifications.length.toString(), icon: Shield, color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: 'Total Users', value: allUsers.length.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Active Jobs', value: '85', icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Revenue (MTD)', value: '$450K', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const data = [
    { name: 'Mon', jobs: 4, users: 24 },
    { name: 'Tue', jobs: 3, users: 13 },
    { name: 'Wed', jobs: 2, users: 98 },
    { name: 'Thu', jobs: 7, users: 39 },
    { name: 'Fri', jobs: 2, users: 48 },
    { name: 'Sat', jobs: 6, users: 38 },
    { name: 'Sun', jobs: 1, users: 43 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MDT Administration</h1>
          <p className="text-sm text-gray-500">Internal Use Only - Maxwell Definitive Technologies</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-violet-600 text-white' : 'bg-white border'}`}>Overview</button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-violet-600 text-white' : 'bg-white border'}`}>All Users</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
            <div className={`p-3 rounded-full ${stat.bg} mr-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Verification Queue */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Verification Queue</h3>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">High Priority</span>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {verifications.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          No pending verifications
                        </td>
                      </tr>
                    ) : (
                      verifications.map((req) => (
                        <tr key={req.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{req.businessName}</div>
                            <div className="text-xs text-gray-500">Reg: {req.registrationNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{req.trn}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.submittedDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleApprove(req.id, user.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(req.id, user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} width={500} height={300} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="users" fill="#0ea5e9" name="New Users" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="jobs" fill="#009B3A" name="Jobs Posted" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold">All Users</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allUsers.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">{u.name.charAt(0)}</div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const PostJobPage = ({ user, onNavigate }: { user: User, onNavigate: (page: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    companyName: user.name,
    location: Parish.KINGSTON,
    type: JobType.FULL_TIME,
    salaryRange: '',
    description: '',
    skills: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user.id) throw new Error('User ID not found');

      await jobsApi.createJob(user.id, {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        isFeatured: false
      });

      onNavigate('jobs');
    } catch (err: any) {
      console.error('Error creating job:', err);
      setError('Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-600">Find the perfect candidate for your business.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
              placeholder="e.g. Senior Frontend Developer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                required
                type="text"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value as Parish })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
              >
                {PARISHES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as JobType })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
              >
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range (Optional)</label>
              <input
                type="text"
                placeholder="e.g. JMD 2M - 3M / yr"
                value={formData.salaryRange}
                onChange={e => setFormData({ ...formData, salaryRange: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma separated)</label>
            <input
              type="text"
              placeholder="React, TypeScript, Communication"
              value={formData.skills}
              onChange={e => setFormData({ ...formData, skills: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-blue-500 hover:bg-gradient-to-r from-violet-600 to-blue-500-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const JobDetailsPage = ({ jobId, onNavigate, onBack }: { jobId: string, onNavigate: (page: string) => void, onBack: () => void }) => {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await jobsApi.getJobById(jobId);
        setJob(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [jobId]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center text-gray-600 hover:text-violet-600 mb-6">
        <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back to Jobs
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <Building className="w-5 h-5 mr-2" />
                <span className="font-medium mr-4">{job.company_name}</span>
                <MapPin className="w-5 h-5 mr-2" />
                <span>{job.location}</span>
              </div>
            </div>
            {job.is_featured && <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-medium">Featured</span>}
          </div>
        </div>
        <div className="p-8">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-3">About the Role</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>

            <h3 className="text-xl font-semibold mt-8 mb-3">Requirements</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills && job.skills.map((skill: string) => (
                <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{skill}</span>
              ))}
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">Compensation</h3>
            <p className="text-gray-600">{job.salary_range || 'Competitive Salary'}</p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button className="w-full sm:w-auto bg-violet-600 text-white px-8 py-3 rounded-md font-medium hover:bg-violet-700 transition-colors">
              Apply for this Position
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserDashboard = ({ user, onNavigate }: { user: User, onNavigate: (page: string) => void }) => {
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');
  const [showPlans, setShowPlans] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: user.bio || '',
    skills: user.skills?.join(', ') || '',
    linkedinUrl: user.linkedinUrl || '',
    phone: user.phone || ''
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (user.role === UserRole.JOB_SEEKER) {
        // Load recommended jobs based on user location
        const jobs = await jobsApi.getJobs({ parish: user.location });
        const transformedJobs = jobs.slice(0, 2).map((job: any) => ({
          id: job.id,
          title: job.title,
          companyName: job.company_name,
          location: job.location,
          type: job.type.replace('_', '-'),
          salaryRange: job.salary_range,
          postedDate: formatDate(job.created_at),
          description: job.description,
          skills: job.skills || [],
          isFeatured: job.is_featured,
        }));
        setRecommendedJobs(transformedJobs);

        // Load user applications
        const userApps = await applicationsApi.getUserApplications(user.id);
        setApplications(userApps.slice(0, 2));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="h-16 w-16 bg-violet-200 rounded-full flex items-center justify-center text-2xl font-bold text-violet-700">
          {user.name.charAt(0)}
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center text-gray-500 gap-2 mt-1">
          <span className={`inline-flex items-center text-sm ${user.emailVerified ? 'text-green-600' : 'text-orange-600'}`}>
            {user.emailVerified ? <CheckCircle className="w-4 h-4 mr-1" /> : <Shield className="w-4 h-4 mr-1" />}
            {user.emailVerified ? 'Email Verified' : 'Confirm Email'}
          </span>
          <span className="hidden sm:inline">|</span>
          <span className={`inline-flex items-center text-sm ${user.verified ? 'text-green-600' : 'text-gray-500'}`}>
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.verified ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            {user.verified ? 'Identity Verified' : 'Identity Verification Pending'}
          </span>
          <span className="hidden sm:inline">|</span>
          <span>{user.location}</span>
        </div>

        {user.role === UserRole.JOB_SEEKER && (
          <div className="flex mt-4 space-x-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`text-sm font-medium pb-2 border-b-2 ${activeTab === 'dashboard' ? 'text-violet-600 border-violet-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`text-sm font-medium pb-2 border-b-2 ${activeTab === 'profile' ? 'text-violet-600 border-violet-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
            >
              My Profile
            </button>
          </div>
        )}
      </div>

      {
        user.role === UserRole.JOB_SEEKER && activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Recommended for you in {user.location}</h2>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                </div>
              ) : recommendedJobs.length > 0 ? (
                recommendedJobs.map(job => (
                  <JobCard key={job.id} job={job} onApply={() => { }} />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No jobs available in your area yet.</p>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Application Status</h3>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
                  </div>
                ) : applications.length > 0 ? (
                  <ul className="space-y-4">
                    {applications.map((app: any) => (
                      <li key={app.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{app.job_listings?.title || 'Job'}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${app.status === 'interview' ? 'bg-green-100 text-green-800' :
                          app.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No applications yet</p>
                )}
              </div>
              <div className="bg-gradient-to-r from-violet-600 to-blue-500 p-6 rounded-lg shadow-sm text-white">
                <h3 className="font-bold text-lg mb-2">Upgrade Profile</h3>
                <p className="text-sm text-violet-100 mb-4">Get noticed by top recruiters with a featured profile badge.</p>
                <h3 className="font-bold text-lg mb-2">Upgrade Profile</h3>
                <p className="text-sm text-violet-100 mb-4">Get noticed by top recruiters with a featured profile badge.</p>
                <button
                  onClick={() => setShowPlans(true)}
                  className="w-full bg-white text-violet-700 py-2 rounded font-medium text-sm hover:bg-gray-50"
                >
                  View Plans
                </button>
              </div>
            </div>
          </div>
        )
      }

      {activeTab === 'profile' && user.role === UserRole.JOB_SEEKER && (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
            <button
              onClick={() => {
                // In a real app, save to Supabase
                alert('Profile updated successfully!');
                setActiveTab('dashboard');
              }}
              className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700"
            >
              Save Changes
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Summary</label>
              <textarea
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                rows={4}
                value={profileData.bio}
                onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell recruiters about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                value={profileData.skills}
                onChange={e => setProfileData({ ...profileData, skills: e.target.value })}
                placeholder="React, TypeScript, Design..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                  value={profileData.linkedinUrl}
                  onChange={e => setProfileData({ ...profileData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/you"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                  value={profileData.phone}
                  onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="+1 (876) 555-0123"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showPlans && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h2>
              <button onClick={() => setShowPlans(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-gray-900">Free</h3>
                <p className="text-3xl font-bold mt-2">$0<span className="text-sm font-normal text-gray-500">/mo</span></p>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> 1 Job Application per day</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Basic Profile</li>
                </ul>
                <button className="w-full mt-8 border border-violet-600 text-violet-600 font-medium py-2 rounded hover:bg-violet-50">Current Plan</button>
              </div>

              <div className="border-2 border-violet-600 rounded-lg p-6 shadow-md relative">
                <span className="absolute top-0 right-0 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</span>
                <h3 className="text-lg font-bold text-gray-900">Pro</h3>
                <p className="text-3xl font-bold mt-2">$2,500<span className="text-sm font-normal text-gray-500">/mo</span></p>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Unlimited Applications</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Featured Profile Badge</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Priority Support</li>
                </ul>
                <button className="w-full mt-8 bg-violet-600 text-white font-medium py-2 rounded hover:bg-violet-700">Upgrade Now</button>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-gray-900">Business Elite</h3>
                <p className="text-3xl font-bold mt-2">$15,000<span className="text-sm font-normal text-gray-500">/mo</span></p>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Post 10 Jobs / mo</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Applicant Tracking System</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Company Branding</li>
                </ul>
                <button className="w-full mt-8 border border-gray-300 text-gray-700 font-medium py-2 rounded hover:bg-gray-50">Contact Sales</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {
        user.role === UserRole.BUSINESS && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Active Listings</h3>
                <Briefcase className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500 mt-1">Expiring in 5 days</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Total Applicants</h3>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">42</p>
              <p className="text-sm text-green-600 mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +12% this week</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
              <button
                onClick={() => onNavigate('post-job')}
                className="bg-gradient-to-r from-violet-600 to-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-gradient-to-r from-violet-600 to-blue-500-hover shadow-sm w-full"
              >
                Post New Job
              </button>
              <p className="text-xs text-gray-500 mt-2">1 Listing remaining in plan</p>
            </div>
          </div>
        )
      }
    </div >
  );
};



const CEODashboard = ({ user }: { user: User }) => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]); // New state
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'database' | 'verifications'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, verificationsData] = await Promise.all([
        adminApi.getPlatformStats(),
        adminApi.getAllUsers(),
        verificationsApi.getPendingVerifications()
      ]);
      setStats(statsData);
      setUsers(usersData);
      // Map verifications to match UI expectations
      setVerifications(verificationsData.map((v: any) => ({
        id: v.id,
        businessName: v.business_name,
        registrationNumber: v.registration_number,
        trn: v.trn,
        status: v.status,
        submittedDate: new Date(v.created_at).toLocaleDateString(),
      })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!user.id) return;
    try {
      await verificationsApi.approveVerification(id, user.id);
      loadData(); // Reload all data to refresh list
    } catch (error) {
      console.error('Error approving verification:', error);
      alert('Failed to approve verification');
    }
  };

  const handleReject = async (id: string) => {
    if (!user.id) return;
    try {
      await verificationsApi.rejectVerification(id, user.id);
      loadData();
    } catch (error) {
      console.error('Error rejecting verification:', error);
      alert('Failed to reject verification');
    }
  };

  const handlePurge = async () => {
    if (confirm('WARNING: Are you sure you want to PURGE the database? This cannot be undone.')) {
      await adminApi.purgeDatabase();
      alert('Database purged successfully (Simulation).');
    }
  };

  const handleBackup = async () => {
    await adminApi.backupDatabase();
    alert('Database backup created successfully.');
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-violet-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-500">Overview for {user.name} (CEO)</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md ${activeTab === 'overview' ? 'bg-violet-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md ${activeTab === 'users' ? 'bg-violet-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2 rounded-md ${activeTab === 'verifications' ? 'bg-violet-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Verifications
            {verifications.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {verifications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 rounded-md ${activeTab === 'database' ? 'bg-violet-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Database
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 font-medium">Total Revenue</h3>
                <DollarSign className="w-5 h-5 text-green-600 opacity-60" />
              </div>
              <p className="text-3xl font-bold text-gray-900">${(stats?.revenue / 1000000).toFixed(1)}M</p>
              <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded">+15% vs last month</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 font-medium">Total Users</h3>
                <Users className="w-5 h-5 text-blue-600 opacity-60" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.users}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 font-medium">Active Jobs</h3>
                <Briefcase className="w-5 h-5 text-violet-600 opacity-60" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.jobs}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 font-medium">Applications</h3>
                <FileText className="w-5 h-5 text-orange-600 opacity-60" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.applications}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold">Platform Users Directory</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                          {u.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{u.name}</div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${u.role === 'admin' || u.role === 'ceo' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.location || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u.verified ?
                        <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full border border-green-200">Verified</span> :
                        <span className="text-gray-500 text-xs">Unverified</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'verifications' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-bold">Pending Verifications</h3>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">High Priority</span>
          </div>
          <div className="overflow-x-auto">
            {verifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No pending verifications found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TRN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {verifications.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{v.businessName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{v.registrationNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.trn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.submittedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                        <button
                          onClick={() => handleApprove(v.id)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 flex items-center"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(v.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 flex items-center"
                        >
                          <X className="w-3 h-3 mr-1" /> Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4 text-red-800">
              <Trash2 className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-bold">Purge Database</h3>
            </div>
            <p className="text-red-700 mb-4">Permanently delete all data. This action is irreversible and should only be used for resetting the environment.</p>
            <button onClick={handlePurge} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-sm font-medium w-full">
              Purge All Data
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4 text-blue-800">
              <Download className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-bold">Backup Database</h3>
            </div>
            <p className="text-blue-700 mb-4">Create a full snapshot of the current database state.</p>
            <button onClick={handleBackup} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm font-medium w-full">
              Download Backup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkAuth();

    // Listen for auth state changes
    const { data: authListener } = authApi.onAuthStateChange((userData) => {
      if (userData?.profile) {
        const transformedUser = transformUserProfile(userData.profile, userData.user);
        setUser(transformedUser);
        if (transformedUser.role === UserRole.CEO) {
          setCurrentPage('ceo');
        } else if (transformedUser.role === UserRole.ADMIN) {
          setCurrentPage('admin');
        } else {
          setCurrentPage('dashboard');
        }
      } else {
        setUser(null);
        setCurrentPage('home');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      if (userData?.profile) {
        setUser(transformUserProfile(userData.profile, userData.user));
      }
    } catch (error) {
      console.log('Auth check error:', error);
    } finally {
      console.log('Auth check finished, setting loading to false');
      setLoading(false);
    }
  };

  const transformUserProfile = (profile: any, authUser?: any): User => ({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role.toUpperCase() as UserRole,
    verified: profile.verified,
    emailVerified: !!authUser?.email_confirmed_at,
    location: profile.location as Parish,
    trnMasked: profile.trn_masked,
    avatarUrl: profile.avatar_url,
  });

  const handleLogin = (userData: any) => {
    setUser(userData);
    setUser(userData);
    if (userData.role === UserRole.CEO) {
      setCurrentPage('ceo');
    } else if (userData.role === UserRole.ADMIN) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      setUser(null);
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-violet-600" />
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'login':
        return <AuthPage type="login" onLogin={handleLogin} />;
      case 'register':
        return <AuthPage type="register" onLogin={handleLogin} />;
      case 'jobs':
        return <JobSearchPage onViewDetails={(jobId) => {
          setSelectedJobId(jobId);
          setCurrentPage('job-details');
        }} />;
      case 'job-details':
        if (!selectedJobId) return <JobSearchPage onViewDetails={(jobId) => {
          setSelectedJobId(jobId);
          setCurrentPage('job-details');
        }} />;
        return <JobDetailsPage
          jobId={selectedJobId}
          onNavigate={setCurrentPage}
          onBack={() => setCurrentPage('jobs')}
        />;
      case 'dashboard':
        if (!user) return <AuthPage type="login" onLogin={handleLogin} />;
        return <UserDashboard user={user} onNavigate={setCurrentPage} />;
      case 'post-job':
        if (!user || user.role !== UserRole.BUSINESS) return <UserDashboard user={user!} onNavigate={setCurrentPage} />;
        return <PostJobPage user={user} onNavigate={setCurrentPage} />;
      case 'admin':
        if (!user || user.role !== UserRole.ADMIN) return <div className="p-8 text-center">Access Denied</div>;
        return <AdminDashboard user={user} />;
      case 'ceo':
        if (!user || user.role !== UserRole.CEO) return <div className="p-8 text-center">Access Denied</div>;
        return <CEODashboard user={user} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout
      user={user}
      onLogout={handleLogout}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      {renderContent()}
    </Layout>
  );
}