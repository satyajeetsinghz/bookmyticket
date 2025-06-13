import { useEffect, useRef, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Movie } from '../../types';
import MovieCard from '../movies/MovieCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    currentRef?.addEventListener('scroll', checkScrollPosition);
    return () => currentRef?.removeEventListener('scroll', checkScrollPosition);
  }, []);

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: offset,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-48 h-64 bg-neutral-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-neutral-950 py-12 sm:py-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-8 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
          >
            Trending Now
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              to="/movies"
              className="flex items-center text-sm sm:text-base text-neutral-300 hover:text-white transition-colors"
            >
              View all
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </motion.div>
        </div>

        {/* Carousel Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group p-1"
        >
          {/* Scrollable Content */}
          <div
            ref={scrollRef}
            className="flex gap-2 px-2 py-2 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollSnapType: 'x mandatory',
              // scrollPadding: '0 16px'
            }}
          >
            {movies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-none"
                style={{
                  minWidth: '160px',
                  maxWidth: '280px',
                  scrollSnapAlign: 'start'
                }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>

          {/* Gradient Fades */}
          {/* <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" /> */}

          {/* Navigation Arrows */}
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => scroll(-400)}
              className="absolute left-0 top-[45%] -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center shadow-lg transition-all"
            >
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </motion.button>
          )}

          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => scroll(400)}
              className="absolute right-0 sm:right-1 top-[45%] -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center shadow-lg transition-all"
            >
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </motion.button>
          )}
        </motion.div>
      </div>
    </section>
  );
}