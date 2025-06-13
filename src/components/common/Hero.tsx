import { ArrowRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[800px] max-h-[1000px] overflow-hidden">
      {/* Background video/image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/90" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://wallpapercave.com/wp/wp9534661.jpg" // Fallback image
        >
          <source src="https://example.com/cinema-background.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content with Apple-style typography and spacing */}
      <div className="relative z-10 h-full flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="px-6 max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium text-white/80 border border-white/10">
              Now Streaming
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-semibold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
          >
            The cinematic experience <br />redefined
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12"
          >
            Immerse yourself in stunning visuals and premium sound. Book now for an unforgettable experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/movies"
              className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden text-lg font-medium tracking-tight text-white rounded-full group"
            >
              <span className="absolute w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-full"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              <span className="relative flex items-center">
                Browse Movies
                <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              to="/membership"
              className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden text-lg font-medium tracking-tight text-white rounded-full group border border-white/20 hover:border-white/40 transition-colors"
            >
              <span className="relative flex items-center">
                Learn More
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Apple-style scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="animate-bounce flex flex-col items-center">
          <span className="text-xs text-white/60 mb-1">Scroll</span>
          <ChevronDownIcon className="h-6 w-6 text-white/60" />
        </div>
      </motion.div>
    </section>
  )
}