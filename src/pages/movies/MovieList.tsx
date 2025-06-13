import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Movie } from '../../types';
import MovieCard from '../movies/MovieCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'movies'));
        const moviesData: Movie[] = [];
        querySnapshot.forEach((doc) => {
          moviesData.push({ id: doc.id, ...doc.data() } as Movie);
        });
        setMovies(moviesData);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading movies...</div>;
  }

  return (
    <div className="w-full bg-background-DEFAULT bg-apple-dark pt-16 sm:pt-20 pb-20 sm:pb-24 overflow-visible">
      {/* Inner Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-14 gap-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight font-sans leading-tight pb-1">
            <span className="text-gradient">Now Showing</span>
          </h1>

          <Link
            to="/movies"
            className="text-primary-DEFAULT hover:text-primary-light text-sm sm:text-base font-medium flex items-center transition-colors"
          >
            View all
            <ChevronRightIcon className="h-5 w-5 ml-1" />
          </Link>
        </motion.div>

        {/* Movie Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide space-x-4 sm:space-x-6">
            {movies.map((movie) => (
              <motion.div
                key={movie.id}
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 160, damping: 18 }}
                className="flex-none w-60 sm:w-72 transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="card h-full rounded-xl overflow-hidden shadow-md bg-neutral-900">
                  <MovieCard movie={movie} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Gradient Overlay */}
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background-DEFAULT to-transparent pointer-events-none" />
        </motion.div>

        {/* Carousel Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center mt-6 sm:mt-8"
        >
          <div className="flex space-x-2">
            {movies.slice(0, 4).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full ${i === 0 ? 'w-6 bg-primary-DEFAULT' : 'w-1.5 bg-border-DEFAULT'
                  }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>

  );
}