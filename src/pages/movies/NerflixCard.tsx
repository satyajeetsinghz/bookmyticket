import { motion } from "framer-motion";
import React from "react";

const MovieCard: React.FC = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-900 p-4">
            <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="group flex aspect-[2/3] w-[180px] flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow transition hover:shadow-lg sm:w-[220px] md:w-[260px] lg:w-[280px]"
            >
                {/* Poster Section */}
                <div className="relative h-[60%] w-full overflow-hidden md:h-[66%]">
                    <img
                        src="https://image.tmdb.org/t/p/w500/8QVDXDiOGHRcAD4oM6MXjE0osSj.jpg"
                        alt="Movie Poster"
                        className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white backdrop-blur">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 .587l3.668 7.568L24 9.75l-6 5.922L19.335 24 12 19.897 4.665 24 6 15.672 0 9.75l8.332-1.595z" />
                        </svg>
                        <span>8.6</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex w-full flex-col justify-between p-3 sm:h-[40%] md:h-[34%]">
                    {/* Title + Genres */}
                    <div>
                        <h3 className="truncate text-sm font-semibold text-white sm:text-lg">
                            Oppenheimer
                        </h3>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[8px] text-white sm:text-xs">
                                Drama
                            </span>
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[8px] text-white sm:text-xs">
                                History
                            </span>
                        </div>
                    </div>

                    {/* Price + CTA */}
                    <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
                        <div>
                            <p className="text-[10px] text-neutral-400">From</p>
                            <p className="text-sm font-semibold text-white sm:text-base">
                                $20
                            </p>
                        </div>
                        <a
                            href="#"
                            className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-medium text-white transition hover:bg-blue-700 sm:px-4 sm:py-1.5 sm:text-xs"
                        >
                            Book
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MovieCard;
