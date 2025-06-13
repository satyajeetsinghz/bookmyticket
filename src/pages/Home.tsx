import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Movie } from '../types'
import MovieCard from './movies/MovieCard'
import Hero from '../components/common/Hero'
import { ChevronRightIcon, CurrencyDollarIcon, FilmIcon, TicketIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const q = query(
          collection(db, 'movies'),
          orderBy('createdAt', 'desc'),
          limit(4)
        )
        const querySnapshot = await getDocs(q)
        const moviesData: Movie[] = []
        querySnapshot.forEach((doc) => {
          moviesData.push({ id: doc.id, ...doc.data() } as Movie)
        })
        setFeaturedMovies(moviesData)
      } catch (error) {
        console.error('Error fetching featured movies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMovies()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white">

      <Hero />

      {/* Featured Movies with Apple-style horizontal scroll */}
      <section className="py-20 px-6 bg-gradient-to-b from-neutral-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-medium">Featured Movies</h2>
            <Link
              to="/movies"
              className="text-blue-100 hover:text-blue-200 text-sm font-medium flex items-center transition-colors"
            >
              View all
              <ChevronRightIcon className="h-5 w-5 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500">o</div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <div className="flex overflow-x-auto scrollbar-hide">
                <div className="flex space-x-2">
                  {featuredMovies.map((movie) => (
                    <motion.div
                      key={movie.id}
                      whileHover={{ scale: 1.03 }}
                      className="flex-none min-w-max"
                    >
                      <MovieCard movie={movie} />
                    </motion.div>
                  ))}
                </div>
              </div>
              {/* <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" /> */}
            </motion.div>
          )}
        </div>
      </section>

      {/* Value Propositions with Apple-style glass panels */}
      <section className="py-20 bg-gradient-to-b from-neutral-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-medium text-center mb-16">Why Book With Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FilmIcon className="h-12 w-12 text-blue-500" />,
                title: "Curated Selection",
                description: "Only the finest films handpicked by our cinema experts."
              },
              {
                icon: <TicketIcon className="h-12 w-12 text-blue-500" />,
                title: "Instant Access",
                description: "Watch immediately after booking with no waiting."
              },
              {
                icon: <CurrencyDollarIcon className="h-12 w-12 text-blue-500" />,
                title: "Premium Value",
                description: "Exceptional quality at competitive prices."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-neutral-800 bg-opacity-60 backdrop-blur-lg rounded-2xl p-8 border border-neutral-700 hover:border-neutral-600 transition-all"
              >
                <div className="mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-medium mb-3">{item.title}</h3>
                <p className="text-neutral-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Apple-style callout section */}
      <section className="py-32 bg-gradient-to-b from-neutral-900 to-black">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-medium mb-6">Experience the Difference</h2>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Join millions of movie lovers who trust us for their cinematic journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-full bg-blue-600 text-white text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/movies"
              className="px-8 py-3.5 rounded-full border border-neutral-600 text-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}