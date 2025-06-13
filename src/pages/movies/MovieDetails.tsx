import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Movie } from '../../types';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ClockIcon, StarIcon, TicketIcon, CalendarIcon } from '@heroicons/react/24/outline';
import MovieCard from './MovieCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import BookingForm from './BookingFrom';

async function fetchRelatedMovies(movieId: string, genres: string[]): Promise<Movie[]> {
  try {
    // Removed where('id', '!=', movieId) due to Firestore limitations
    const q = query(
      collection(db, 'movies'),
      where('genre', 'array-contains-any', genres.slice(0, 2)),
      limit(5) // Fetch extra to filter out current movie after
    );
    const querySnapshot = await getDocs(q);
    const movies = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Movie))
      .filter(m => m.id !== movieId) // Manually exclude current movie
      .slice(0, 4); // Limit to 4 after filtering
    return movies;
  } catch (error) {
    console.error('Error fetching related movies:', error);
    return [];
  }
}

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch main movie
        const docRef = doc(db, 'movies', id!);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const movieData = { id: docSnap.id, ...docSnap.data() } as Movie;
          setMovie(movieData);

          // Fetch related movies only if we have a movie
          const related = await fetchRelatedMovies(movieData.id, movieData.genre);
          setRelatedMovies(related);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
        <div className="text-center p-8 bg-neutral-800 rounded-xl max-w-md">
          <h1 className="text-3xl font-bold mb-4">Movie not found</h1>
          <p className="text-neutral-400 mb-6">The movie you're looking for doesn't exist or may have been removed.</p>
          <Link
            to="/movies"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Browse all movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-background-DEFAULT bg-apple-dark text-white min-h-screen"
    >
      {/* Hero Section with Backdrop */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/70 to-transparent z-10" />
        <img
          src={movie.movieBg || '/default-backdrop.jpg'}
          alt={movie.title}
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
          <Link
            to="/movies"
            className="flex items-center gap-1 bg-neutral-950/80 hover:bg-neutral-950/80 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full transition-all text-xs sm:text-sm"
          >
            <ChevronLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className='font-medium sm:font-semibold'>Back to Movies</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          <div className="w-full lg:w-1/3">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative aspect-[2/3] sm:aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-2 border-neutral-700 mx-auto max-w-xs sm:max-w-none"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-movie.jpg';
                }}
              />
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-yellow-500 text-neutral-900 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full flex items-center font-bold text-xs sm:text-sm">
                <StarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                {movie.rating}
              </div>
            </motion.div>

            <div className="mt-4 sm:mt-6 bg-neutral-800 rounded-xl p-4 sm:p-6 md:p-8">
              <div className="space-y-2 sm:space-y-3 md:space-y-4 text-sm sm:text-base">
                <div className="flex items-center gap-2 sm:gap-3">
                  <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" />
                  <span>{movie.runtime} min</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" />
                  <span>{movie.releaseYear}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <TicketIcon className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" />
                  <span>${movie.ticketPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                <h3 className="text-xs sm:text-sm font-semibold text-neutral-400 mb-1 sm:mb-2">GENRES</h3>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {movie.genre.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-0.5 sm:px-3 sm:py-1 bg-neutral-700 rounded-full text-xs sm:text-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">{movie.title}</h1>

              <div className="border-b border-neutral-700 mb-4 sm:mb-6">
                <nav className="flex space-x-4 sm:space-x-8">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`py-2 sm:py-3 md:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                      activeTab === 'details'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-neutral-400 hover:text-neutral-300'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('showtimes')}
                    className={`py-2 sm:py-3 md:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                      activeTab === 'showtimes'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-neutral-400 hover:text-neutral-300'
                    }`}
                  >
                    Showtimes
                  </button>
                </nav>
              </div>

              <div className="mb-4 sm:mb-6 md:mb-8">
                {activeTab === 'details' ? (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">Synopsis</h2>
                    <p className="text-neutral-200 text-xs sm:text-sm font-medium leading-relaxed sm:leading-loose">
                      {movie.description}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">Available Showtimes</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                      {movie.showtimes?.map((time, index) => (
                        <button
                          key={index}
                          className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg p-2 sm:p-3 md:p-4 text-center transition-colors text-sm sm:text-base"
                        >
                          <div className="font-medium">{time}</div>
                          <div className="text-xs sm:text-sm text-neutral-400 mt-0.5 sm:mt-1">Standard</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-neutral-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg"
              >
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 md:mb-6">Book Tickets</h2>
                <BookingForm movieId={movie.id} ticketPrice={movie.ticketPrice} />
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="my-8 sm:my-12 md:my-16"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold">You Might Also Like</h2>
            <Link
              to="/movies"
              className="text-blue-600 text-xs sm:text-sm font-semibold hover:text-blue-500 flex items-center"
            >
              View All <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5 sm:ml-1 rotate-180" />
            </Link>
          </div>

          {relatedMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {relatedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-neutral-400 text-sm sm:text-base">
              No similar movies found
            </div>
          )}
        </motion.section>
      </div>
    </motion.div>
  );
}
