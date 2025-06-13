import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Booking, Movie, User } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { format } from 'date-fns';
import { FcRating } from 'react-icons/fc';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<(Booking & { movie: Movie; user: User })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const bookingsData: (Booking & { movie: Movie; user: User })[] = [];

        for (const docSnap of querySnapshot.docs) {
          const bookingData = docSnap.data() as Booking;

          const movieRef = doc(db, 'movies', bookingData.movieId);
          const movieSnap = await getDoc(movieRef);

          const userRef = doc(db, 'users', bookingData.userId);
          const userSnap = await getDoc(userRef);

          if (movieSnap.exists() && userSnap.exists()) {
            bookingsData.push({
              ...bookingData,
              id: docSnap.id, // moved `id` after spread to prevent overwrite
              movie: { id: movieSnap.id, ...movieSnap.data() } as Movie,
              user: { id: userSnap.id, ...userSnap.data() } as User,
            });
          }
        }

        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="h-screen flex justify-center items-center mx-auto px-4 py-8 text-center text-xl font-semibold text-neutral-200">
        You don't have any booking yet.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-neutral-100">Manage Bookings</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 text-xs font-semibold bg-neutral-900 border border-neutral-700 rounded-full text-neutral-100 placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-[9px] h-4 w-4 text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-neutral-100 text-xs font-semibold rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>Filter by status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-800">
        <table className="min-w-full divide-y divide-neutral-800">
          <thead className="bg-neutral-900">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-200 tracking-wider">Movie</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-200 tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-200 tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-200 tracking-wider">Seats</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-200 tracking-wider">Total</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-neutral-200 tracking-wider">Status</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-neutral-200 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-neutral-900 divide-y divide-neutral-800">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-neutral-750 transition-colors">
                {/* Movie */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                      <img
                        className="h-full w-full object-cover"
                        src={booking.movie?.posterUrl || '/placeholder-movie.jpg'}
                        alt={booking.movie?.title || 'Movie poster'}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-movie.jpg';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-100">{booking.movie?.title || 'N/A'}</div>
                      <div className="text-xs text-neutral-400 inline-flex items-center gap-1">
                        <FcRating /> {booking.movie?.rating || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* User */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-300">{booking.user?.name || 'N/A'}</div>
                  <div className="text-xs text-neutral-400">{booking.user?.email || 'N/A'}</div>
                </td>

                {/* Date & Time */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-300">
                    {booking.date instanceof Timestamp
                      ? format(booking.date.toDate(), 'MMM dd, yyyy h:mm a')
                      : typeof booking.date === 'string'
                        ? format(new Date(booking.date), 'MMM dd, yyyy h:mm a')
                        : 'Unknown'}
                  </div>
                  <div className="text-xs text-neutral-500">{booking.time || 'Unknown'}</div>
                </td>


                {/* Seats */}
                <td className="px-6 py-4 whitespace-nowrap max-w-[120px]">
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(booking.seats) && booking.seats.length > 0 ? (
                      booking.seats.map((seat: string, i: number) => (
                        <span key={i} className="px-2 py-1 text-xs bg-neutral-700 text-neutral-300 rounded">
                          {seat.trim()}
                        </span>
                      ))
                    ) : typeof booking.seats === 'string' && booking.seats.trim().length > 0 ? (
                      booking.seats.split(',').map((seat: string, i: number) => (
                        <span key={i} className="px-2 py-1 text-xs bg-neutral-700 text-neutral-300 rounded">
                          {seat.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-neutral-500">N/A</span>
                    )}
                  </div>
                </td>

                {/* Total Price */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-100">
                  ${booking.totalPrice?.toFixed(2) ?? '0.00'}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed'
                        ? 'bg-green-900/30 text-green-300'
                        : booking.status === 'cancelled'
                          ? 'bg-red-900/30 text-red-300'
                          : 'bg-yellow-900/30 text-yellow-300'
                      }`}
                  >
                    {booking.status
                      ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
                      : 'Unknown'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="mr-4 rounded-full py-1.5 px-3 bg-neutral-100 text-neutral-800 hover:bg-neutral-800 hover:text-neutral-100 font-semibold text-xs">
                    Edit
                  </button>
                  <button className="py-1.5 rounded-full px-3 bg-neutral-100 text-neutral-800 hover:bg-neutral-800 hover:text-neutral-100 font-semibold text-xs">
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-neutral-400">
          Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
          <span className="font-medium">{bookings.length}</span> bookings
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
