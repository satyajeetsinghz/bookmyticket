import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import StatCard from '../admin/StatCard';
import { UsersIcon, FilmIcon, TicketIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    bookings: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const moviesSnapshot = await getDocs(collection(db, 'movies'));
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'));

      let totalRevenue = 0;
      bookingsSnapshot.forEach((doc) => {
        totalRevenue += doc.data().totalPrice || 0;
      });

      setStats({
        users: usersSnapshot.size,
        movies: moviesSnapshot.size,
        bookings: bookingsSnapshot.size,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        {/* <ArrowPathIcon className="h-8 w-8 text-neutral-400 animate-spin" /> */}
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-neutral-400 mt-1">Overview of your platform</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={refreshing}
          className="flex items-center px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-sm font-medium text-white transition-colors"
        >
          <ArrowPathIcon className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          trend="up"
          change="12%"
          bgColor="bg-neutral-900"
        />
        <StatCard
          title="Movies"
          value={stats.movies}
          icon={<FilmIcon className="w-6 h-6 text-purple-500" />}
          trend="neutral"
          bgColor="bg-neutral-900"
        />
        <StatCard
          title="Bookings"
          value={stats.bookings}
          icon={<TicketIcon className="w-6 h-6 text-green-500" />}
          trend="up"
          change="5%"
          bgColor="bg-neutral-900"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={<CurrencyDollarIcon className="w-6 h-6 text-yellow-500" />}
          trend="up"
          change="24%"
          bgColor="bg-neutral-900"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-neutral-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="text-neutral-400 text-sm">
          {/* Placeholder for recent activity data */}
          <p>New booking for "Dune: Part Two" - $12.50</p>
          <p className="mt-2">User "john.doe" registered</p>
          <p className="mt-2">Movie "Oppenheimer" added</p>
        </div>
      </div>
    </div>
  );
}