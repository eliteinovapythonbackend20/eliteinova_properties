// src/components/dashboard/AdminDashboardSkeleton.jsx
// Suspense fallback for the lazy-loaded AdminDashboard chunk (~1.5MB gzipped -
// genuinely slow on a cold cache). Shown the instant the post-login redirect
// lands on /admin/*, in place of the previous `fallback={null}` blank screen,
// so there's something resembling the real layout on screen while the chunk
// downloads and parses instead of a dead pause after the "Login successful!"
// toast.
import React from 'react';

const Block = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-[#00695C]/10 ${className}`} />
);

const AdminDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-shrink-0 flex-col gap-2 bg-white border-r border-gray-100 p-4">
        <Block className="h-9 w-32 mb-6" />
        {Array.from({ length: 7 }).map((_, i) => (
          <Block key={i} className="h-10 w-full" />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Block className="h-7 w-40" />
          <div className="flex items-center gap-3">
            <Block className="h-9 w-9 rounded-full" />
            <Block className="h-9 w-24" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
              <Block className="h-4 w-20" />
              <Block className="h-7 w-16" />
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
          <Block className="h-5 w-48 mb-2" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Block key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSkeleton;
