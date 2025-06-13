import type { Movie } from '../../types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

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
      className="group flex aspect-[2/3] w-[180px] sm:w-[220px] md:w-[260px] lg:w-[280px] flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow transition hover:shadow-lg"
    >
      {/* Poster Section */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-[60%] w-full overflow-hidden md:h-[66%]"
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
          <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
          <span>{movie.rating}</span>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="flex w-full flex-col justify-between p-3 sm:h-[40%] md:h-[34%]">
        {/* Title + Genres */}
        <div>
          <h3 className="truncate text-sm font-semibold text-white sm:text-lg">
            {movie.title}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {movie.genre.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-white/10 px-2 py-0.5 text-[8px] text-white sm:text-xs"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Price + Book Button */}
        <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
          <div>
            <p className="text-[10px] text-neutral-400">From</p>
            <p className="text-sm font-semibold text-white sm:text-base">
              ${movie.ticketPrice}
            </p>
          </div>
          <Link
            to={`/movies/${movie.id}`}
            className="relative overflow-hidden rounded-full bg-blue-600 px-3 py-1 text-[10px] font-medium text-white transition hover:bg-blue-700 sm:px-4 sm:py-1.5 sm:text-xs"
          >
            Book
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
