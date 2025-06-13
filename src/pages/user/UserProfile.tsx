// ... All your imports remain unchanged
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import type { Booking, Movie } from '../../types';

// ---------------- Custom Hook ----------------
function useUserBookings(userId?: string) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchBookings() {
      setLoading(true);
      try {
        const q = query(collection(db, 'bookings'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const bookingList: Booking[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Booking, 'id'>),
        }));


        const bookingsWithMovies = await Promise.all(
          bookingList.map(async (booking) => {
            let movieData: Movie | null = null;
            if (booking.movieId) {
              try {
                const movieSnap = await getDoc(doc(db, 'movies', booking.movieId));
                if (movieSnap.exists()) {
                  movieData = movieSnap.data() as Movie;
                }
              } catch (err) {
                console.error('Error fetching movie:', err);
              }
            }
            return {
              ...booking,
              movie: movieData,
            };
          })
        );


        setBookings(bookingsWithMovies);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [userId]);

  return { bookings, loading };
}

// ---------------- Component ----------------
export default function UserProfile() {
  const { currentUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { bookings, loading: bookingsLoading } = useUserBookings(currentUser?.uid);

  useEffect(() => {
    async function fetchUser() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setName(data.name || '');
          setEmail(data.email || '');
          setBio(data.bio || '');
          setProfileImage(data.profileImage || 'https://s3-alpha.figma.com/hub/file/6583978931/d591f10c-3e1c-4ba7-9696-1e483e7fc251-cover.png');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setUpdating(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { name, bio });
      toast.success('Profile updated!');
      setEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || bookingsLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 to-neutral-900 font-sans text-white">
      {/* Banner */}
      <div className="relative h-48 sm:h-56 md:h-64 bg-neutral-800">
        <img
          src="https://img.freepik.com/premium-vector/modern-cyan-gradient-color-background-trendy-blue-gradient-color-wallpaper_1199668-178.jpg"
          alt="Cover Banner"
          className="object-cover w-full h-full brightness-75"
        />
        <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-neutral-900 shadow-lg overflow-hidden bg-neutral-900">
          <img
            src={profileImage}
            alt={`${name}'s avatar`}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto pt-24 px-4 sm:px-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            {name}
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 mt-1">{email}</p>
          {bio && <p className="mt-4 text-neutral-300 max-w-xl mx-auto text-sm sm:text-base">{bio}</p>}
        </div>

        {/* Edit Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-5 sm:px-6 py-2 rounded-full border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition text-sm sm:text-base"
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit Form */}
        {editMode && (
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-lg"
          >
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-1">Username</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-900/60 text-white text-sm border border-neutral-800 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-neutral-900/60 text-white text-sm border border-neutral-800 rounded-xl"
                placeholder="Write about you..."
              />
            </div>
            <button
              type="submit"
              disabled={updating}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm sm:text-base rounded-full transition"
            >
              {updating ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        )}

        {/* Ticket Section */}
        <section className="mt-6 sm:mt-10 max-w-4xl mx-auto">
          <div className="bg-background-DEFAULT bg-apple-dark rounded-xl sm:rounded-2xl shadow-sm border border-neutral-800 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">Your Tickets</h2>
                  <p className="text-neutral-400 text-xs sm:text-sm">Upcoming and past bookings</p>
                </div>
                <Link
                  to="/movies"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700"
                >
                  Book More
                </Link>
              </div>
            </div>

            {/* Bookings */}
            <div className="p-4 sm:p-6">
              {bookings.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <h3 className="mt-3 text-base sm:text-lg font-medium">No bookings yet</h3>
                  <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-xs mx-auto">
                    Your movie tickets will appear here after booking
                  </p>
                  <Link
                    to="/movies"
                    className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Browse Movies
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-neutral-800">
                  {bookings.map((booking) => {
                    const dateObj =
                      typeof booking.date?.toDate === 'function'
                        ? booking.date.toDate()
                        : new Date(booking.date);

                    const isValidDate = dateObj instanceof Date && !isNaN(dateObj.getTime());

                    return (
                      <li key={booking.id} className="py-4 px-2 sm:px-4 hover:bg-neutral-800/30 transition rounded-xl">
                        <Link to={`/booking/${booking.id}`} className="block">
                          <div className="flex items-start space-x-3 sm:space-x-4">
                            <img
                              src={booking.movie?.posterUrl || '/placeholder.png'}
                              alt={booking.movie?.title || 'Movie'}
                              className="h-20 w-14 sm:h-24 sm:w-16 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="text-base sm:text-lg font-medium truncate">
                                  {booking.movie?.title || 'Unknown Movie'}
                                </h3>
                                <span className="text-sm font-semibold whitespace-nowrap">
                                  ${booking.totalPrice?.toFixed(2) || '0.00'}
                                </span>
                              </div>
                              <div className="mt-2 space-y-1 text-xs sm:text-sm text-neutral-400">
                                <div className="flex items-center">
                                  <span className="mr-2">🎬</span>
                                  {isValidDate
                                    ? `${dateObj.toLocaleDateString(undefined, {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                    })} • ${booking.time}`
                                    : 'Date not available'}
                                </div>
                                <div className="flex justify-between items-center">
                                  <span>
                                    🎟️ {Array.isArray(booking.seats) ? booking.seats.length : 0} seat
                                  </span>
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${booking.status.toLowerCase() === 'confirmed'
                                      ? 'bg-green-900/30 text-green-400'
                                      : booking.status.toLowerCase() === 'cancelled'
                                        ? 'bg-red-900/30 text-red-400'
                                        : 'bg-yellow-900/30 text-yellow-400'
                                      }`}
                                  >
                                    {booking.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
