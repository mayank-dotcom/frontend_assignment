'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from "next/image";

// Types
interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

type SortField = 'postId' | 'name' | 'email';
type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  field: SortField | null;
  direction: SortDirection;
}

interface FilterState {
  search: string;
  page: number;
  pageSize: number;
  sort: SortState;
}

type CurrentPage = 'dashboard' | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('dashboard');
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    page: 1,
    pageSize: 10,
    sort: { field: null, direction: null }
  });

  // Load state from URL params on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page_type');
    if (page === 'profile') {
      setCurrentPage('profile');
    }
    
    const savedFilters: FilterState = {
      search: urlParams.get('search') || '',
      page: parseInt(urlParams.get('page') || '1'),
      pageSize: parseInt(urlParams.get('pageSize') || '10'),
      sort: {
        field: (urlParams.get('sortField') as SortField) || null,
        direction: (urlParams.get('sortDirection') as SortDirection) || null
      }
    };
    setFilters(savedFilters);
  }, []);

  // Update URL when page or filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage === 'profile') {
      params.set('page_type', 'profile');
    }
    if (filters.search) params.set('search', filters.search);
    if (filters.page > 1) params.set('page', filters.page.toString());
    if (filters.pageSize !== 10) params.set('pageSize', filters.pageSize.toString());
    if (filters.sort.field) params.set('sortField', filters.sort.field);
    if (filters.sort.direction) params.set('sortDirection', filters.sort.direction);
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [currentPage, filters]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch comments and users in parallel
        const [commentsResponse, usersResponse] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/comments'),
          fetch('https://jsonplaceholder.typicode.com/users')
        ]);

        if (!commentsResponse.ok || !usersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const commentsData: Comment[] = await commentsResponse.json();
        const usersData: User[] = await usersResponse.json();
        
        setComments(commentsData);
        if (usersData.length > 0) {
          setUser(usersData[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigation functions
  const navigateToProfile = () => {
    setCurrentPage('profile');
  };

  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  // Get user initials
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  // Dashboard Component
  const Dashboard = () => {
  // Filter and sort data with React.useMemo for better performance
  const filteredAndSortedData = useMemo(() => {
    let filtered = comments;

    // Apply search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = comments.filter(comment =>
        comment.name.toLowerCase().includes(searchTerm) ||
        comment.email.toLowerCase().includes(searchTerm) ||
        comment.postId.toString().includes(searchTerm) ||
        comment.body.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (filters.sort.field && filters.sort.direction) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[filters.sort.field!];
        let bValue = b[filters.sort.field!];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;

        return filters.sort.direction === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [comments, filters.search, filters.sort]);

    // Paginated data
    const paginatedData = useMemo(() => {
      const startIndex = (filters.page - 1) * filters.pageSize;
      const endIndex = startIndex + filters.pageSize;
      return filteredAndSortedData.slice(startIndex, endIndex);
    }, [filteredAndSortedData, filters.page, filters.pageSize]);

    // Total pages
    const totalPages = Math.ceil(filteredAndSortedData.length / filters.pageSize);

    // Handle search with debouncing to prevent excessive re-renders
    const handleSearch = (value: string) => {
      setFilters(prev => ({
        ...prev,
        search: value,
        page: 1
      }));
    };

    // Handle page change
    const handlePageChange = (page: number) => {
      setFilters(prev => ({ ...prev, page }));
    };

    // Handle page size change
    const handlePageSizeChange = (pageSize: number) => {
      setFilters(prev => ({
        ...prev,
        pageSize,
        page: 1
      }));
    };

    // Handle sorting
    const handleSort = (field: SortField) => {
      setFilters(prev => {
        let newDirection: SortDirection = 'asc';
        
        if (prev.sort.field === field) {
          if (prev.sort.direction === 'asc') {
            newDirection = 'desc';
          } else if (prev.sort.direction === 'desc') {
            newDirection = null;
          } else {
            newDirection = 'asc';
          }
        }

        return {
          ...prev,
          sort: {
            field: newDirection ? field : null,
            direction: newDirection
          },
          page: 1
        };
      });
    };

    // Get sort icon
    const getSortIcon = (field: SortField) => {
      if (filters.sort.field !== field) return '↕️';
      if (filters.sort.direction === 'asc') return '↑';
      if (filters.sort.direction === 'desc') return '↓';
      return '↕️';
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
      const pages: number[] = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const startPage = Math.max(1, filters.page - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    };

    const startRecord = (filters.page - 1) * filters.pageSize + 1;
    const endRecord = Math.min(filters.page * filters.pageSize, filteredAndSortedData.length);

    return (
      <div className="p-6">
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded bg-white text-sm text-black"
              value={`postId-${filters.sort.field === 'postId' ? filters.sort.direction || 'none' : 'none'}`}
              onChange={(e) => {
                const [, direction] = e.target.value.split('-');
                if (direction === 'none') {
                  setFilters(prev => ({ ...prev, sort: { field: null, direction: null } }));
                } else {
                  setFilters(prev => ({ ...prev, sort: { field: 'postId', direction: direction as SortDirection } }));
                }
              }}
            >
              <option value="postId-none">Sort Post ID</option>
              <option value="postId-asc">Post ID ↑</option>
              <option value="postId-desc">Post ID ↓</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded bg-white text-sm text-black"
              value={`name-${filters.sort.field === 'name' ? filters.sort.direction || 'none' : 'none'}`}
              onChange={(e) => {
                const [, direction] = e.target.value.split('-');
                if (direction === 'none') {
                  setFilters(prev => ({ ...prev, sort: { field: null, direction: null } }));
                } else {
                  setFilters(prev => ({ ...prev, sort: { field: 'name', direction: direction as SortDirection } }));
                }
              }}
            >
              <option value="name-none">Sort Name</option>
              <option value="name-asc">Name ↑</option>
              <option value="name-desc">Name ↓</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded bg-white text-sm text-black"
              value={`email-${filters.sort.field === 'email' ? filters.sort.direction || 'none' : 'none'}`}
              onChange={(e) => {
                const [, direction] = e.target.value.split('-');
                if (direction === 'none') {
                  setFilters(prev => ({ ...prev, sort: { field: null, direction: null } }));
                } else {
                  setFilters(prev => ({ ...prev, sort: { field: 'email', direction: direction as SortDirection } }));
                }
              }}
            >
              <option value="email-none">Sort Email</option>
              <option value="email-asc">Email ↑</option>
              <option value="email-desc">Email ↓</option>
            </select>
          </div>

          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search name, email, comment..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('postId')}
                >
                  Post ID {getSortIcon('postId')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('name')}
                >
                  Name {getSortIcon('name')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('email')}
                >
                  Email {getSortIcon('email')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Comment
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((comment, index) => (
                <tr 
                  key={comment.id} 
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {comment.postId}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600">
                    {comment.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600">
                    {comment.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {comment.body.length > 50 ? `${comment.body.substring(0, 50)}...` : comment.body}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{startRecord}-{endRecord} of {filteredAndSortedData.length} items</span>
            <select
              value={filters.pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={10}>10 / Page</option>
              <option value={50}>50 / Page</option>
              <option value={100}>100 / Page</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ‹
            </button>
            
            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 ${
                  filters.page === page ? 'bg-blue-50 border-blue-300 text-blue-600' : ''
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Profile Component
  const Profile = () => {
    if (!user) return null;

    const fullAddress = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;

    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={navigateToDashboard}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            Welcome, {user.name}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold text-gray-700 mr-6">
              {getUserInitials(user.name)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.id.toString().padStart(7, '0')}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email ID
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.phone}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-blue-600">
                  {fullAddress}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-blue-600">
                  {user.website}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.company.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catchphrase
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.company.catchPhrase}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={navigateToDashboard}
              className="px-6 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-slate-800 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-xs font-bold">
                S
              </div>
              <span className="font-semibold">WisP</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                EH
              </div>
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-slate-800 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-xs font-bold">
                S
              </div>
              <span className="font-semibold">WisP</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                EH
              </div>
              <span className="text-sm">Error</span>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-800 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-xs font-bold">
              S
            </div>
            <span className="font-semibold">WisP</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={navigateToProfile}
              className="flex items-center space-x-2 hover:bg-slate-700 rounded px-2 py-1 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                {user ? getUserInitials(user.name) : 'EH'}
              </div>
              <span className="text-sm">{user?.name || 'Ervin Howell'}</span>
            </button>
          </div>
        </div>
      </header>

      
      {currentPage === 'dashboard' ? <Dashboard /> : <Profile />}
    </div>
  );
}