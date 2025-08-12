'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Types
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

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const users: User[] = await response.json();
        // Use the first user as specified
        if (users.length > 0) {
          setUser(users[0]);
        } else {
          throw new Error('No users found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle back navigation
  const handleBackToDashboard = () => {
    router.push('/');
  };

  // Get user initials
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-slate-800 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-xs font-bold">
                $
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
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-slate-800 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-xs font-bold">
                $
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

  if (!user) {
    return null;
  }

  const fullAddress = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-800 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-xs font-bold">
              $
            </div>
            <span className="font-semibold">WisP</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
              {getUserInitials(user.name)}
            </div>
            <span className="text-sm">{user.name}</span>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Back Navigation */}
        <div className="mb-6">
          <button
            onClick={handleBackToDashboard}
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

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl">
          {/* Profile Header */}
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold text-gray-700 mr-6">
              {getUserInitials(user.name)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* User ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.id.toString().padStart(8, '0')}
                </div>
              </div>

              {/* Email ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email ID
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.email}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.phone}
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-blue-600">
                  {user.website}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.name}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-blue-600">
                  {fullAddress}
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.username}
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.company.name}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Company Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catchphrase
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.company.catchPhrase}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-900">
                  {user.company.bs}
                </div>
              </div>
            </div>
          </div>

          {/* Back to Dashboard Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBackToDashboard}
              className="px-6 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}