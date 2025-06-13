import type { Movie } from '../../types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/outline';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.6 }}
      className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all group w-full sm:max-w-sm"
    >
      {/* Image with gradient overlay and motion hover */}
      <motion.div
        className="relative aspect-[4/3] overflow-hidden"
        whileHover={{
          scale: 1.03,
          transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Rating badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/80 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center">
          <StarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-400 mr-1" />
          <span className="text-[10px] sm:text-xs font-medium text-white">{movie.rating}</span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <div className="mb-2 sm:mb-3">
          <h3 className="text-lg sm:text-xl font-semibold text-white line-clamp-1">{movie.title}</h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5 sm:mt-2">
            {movie.genre.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-neutral-800 text-neutral-400 text-[10px] sm:text-xs font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t border-neutral-800 gap-3">
          <div>
            <span className="text-xs sm:text-sm text-neutral-400">From</span>
            <p className="text-lg sm:text-xl font-semibold text-white">${movie.ticketPrice}</p>
          </div>
          <Link
            to={`/movies/${movie.id}`}
            className="relative overflow-hidden px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-medium text-white transition-colors flex items-center justify-center w-full sm:w-auto"
          >
            <span className="relative z-10">Book Now</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    </motion.div>


  );
}