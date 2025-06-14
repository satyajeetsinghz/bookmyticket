import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'
import type { Booking, Movie } from '../../types'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { format } from 'date-fns'
import { ChevronRightIcon, TicketIcon } from '@heroicons/react/24/outline'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function UserBookings() {
  const { currentUser } = useAuth()
  const [bookings, setBookings] = useState<(Booking & { movie: Movie })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser) return

      try {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', currentUser.uid),
          where('status', '==', 'confirmed')
        )
        const querySnapshot = await getDocs(q)

        const bookingsData: (Booking & { movie: Movie })[] = []

        for (const docItem of querySnapshot.docs) {
          const bookingData = docItem.data() as Booking
          const movieRef = doc(db, 'movies', bookingData.movieId)
          const movieSnap = await getDoc(movieRef)

          if (movieSnap.exists()) {
            bookingsData.push({
              ...bookingData,
              id: docItem.id,
              movie: { id: movieSnap.id, ...movieSnap.data() } as Movie,
            })
          }
        }

        setBookings(bookingsData)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [currentUser])

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('My Movie Bookings', 14, 22)

    const tableData = bookings.map((b) => {
      const dateObj = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date)

      const seats = Array.isArray(b.seats)
        ? b.seats.join(', ')
        : typeof b.seats === 'string'
        ? b.seats
        : ''

      return [
        b.movie.title,
        format(dateObj, 'yyyy-MM-dd'),
        b.time,
        seats,
        `$${b.totalPrice.toFixed(2)}`,
        b.status.toUpperCase(),
      ]
    })

    autoTable(doc, {
      head: [['Movie', 'Date', 'Time', 'Seats', 'Price', 'Status']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: {
        fillColor: [239, 68, 68],
        textColor: [255, 255, 255],
      },
      styles: {
        fontSize: 10,
      },
    })

    doc.save('bookings.pdf')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="w-full bg-background-DEFAULT bg-apple-dark pt-16 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-yellow-200">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12 bg-fuchsia-300"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight font-sans leading-tight">
            <span className="text-gradient">My Tickets</span>
          </h1>
          <a
            href="/movies"
            className="text-primary-DEFAULT hover:text-primary-light text-sm font-medium flex items-center transition-colors"
          >
            Browse Movies
            <ChevronRightIcon className="h-5 w-5 ml-1" />
          </a>
        </motion.div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-neutral-950 border border-neutral-800 rounded-3xl text-center py-20 px-6 sm:px-8 shadow-lg"
          >
            <div className="mx-auto h-20 w-20 sm:h-24 sm:w-24 rounded-full flex items-center justify-center bg-neutral-800 mb-6">
              <TicketIcon className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-200" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white">No tickets yet</h3>
            <p className="mt-3 text-neutral-400 max-w-md mx-auto text-sm sm:text-base">
              Your booked movie tickets will appear here when available.
            </p>
            <div className="mt-8">
              <a
                href="/movies"
                className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium text-white bg-primary-DEFAULT hover:bg-blue-600 transition-colors"
              >
                Find Movies
              </a>
            </div>
          </motion.div>
        ) : (
          // --- Optimized Ticket Carousel Starts ---
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="overflow-x-auto no-scrollbar p-8 bg-green-400"
          >
            <div
              className="flex gap-4 sm:gap-6 md:gap-8 snap-x snap-mandatory scroll-smooth"
              style={{ paddingBottom: '8px', minWidth: 'max-content' }}
            >
              {bookings.map((booking) => {
                const dateObj =
                  booking.date instanceof Timestamp
                    ? booking.date.toDate()
                    : new Date(booking.date)
                const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy')
                const formattedTime = booking.time

                const seatCount =
                  typeof booking.seats === 'string'
                    ? booking.seats.split(',').length
                    : Array.isArray(booking.seats)
                    ? booking.seats.length
                    : 0

                return (
                  <div
                    key={booking.id}
                    className="snap-start flex-shrink-0 w-[90vw] sm:w-[340px] md:w-[380px] lg:w-[400px] bg-gradient-to-br from-yellow-600 via-orange-500 to-pink-700 rounded-3xl shadow-xl relative text-white font-sans"
                    style={{ minHeight: '280px' }}
                  >
                    {/* Left Poster */}
                    <div className="absolute left-0 top-0 bottom-0 w-28 sm:w-36 rounded-l-3xl overflow-hidden shadow-lg border-r border-yellow-800">
                      <img
                        src={booking.movie.posterUrl}
                        alt={booking.movie.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Ticket Perforation Circles */}
                    <div
                      aria-hidden="true"
                      className="absolute top-1/2 -left-5 w-10 h-10 bg-gray-900 rounded-full border-4 border-pink-600 shadow-md"
                      style={{ transform: 'translateY(-50%)' }}
                    ></div>
                    <div
                      aria-hidden="true"
                      className="absolute top-1/2 -right-5 w-10 h-10 bg-gray-900 rounded-full border-4 border-pink-600 shadow-md"
                      style={{ transform: 'translateY(-50%)' }}
                    ></div>

                    {/* Right Content */}
                    <div className="ml-28 sm:ml-36 p-4 sm:p-6 flex flex-col h-full justify-between">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight mb-1 line-clamp-2">
                        {booking.movie.title}
                      </h3>

                      <div className="text-xs sm:text-sm text-pink-200 mb-3">
                        <div>{formattedDate}</div>
                        <div>{formattedTime}</div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-100 mb-1">
                          Seats
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(booking.seats)
                            ? booking.seats
                            : typeof booking.seats === 'string'
                            ? booking.seats.split(',')
                            : []
                          ).map((seat) => (
                            <span
                              key={seat}
                              className="bg-pink-700 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide"
                            >
                              {seat.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <p className="text-base sm:text-lg font-extrabold">
                            ${booking.totalPrice.toFixed(2)}
                          </p>
                          <p className="text-[10px] sm:text-xs text-pink-300 mt-1">
                            {seatCount} ticket{seatCount !== 1 ? 's' : ''}
                          </p>
                        </div>

                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-bold tracking-wide
                            ${
                              booking.status.toLowerCase() === 'confirmed'
                                ? 'bg-emerald-400 text-neutral-100'
                                : booking.status.toLowerCase() === 'pending'
                                ? 'bg-yellow-400 bg-opacity-30 text-yellow-400'
                                : 'bg-red-500 bg-opacity-30 text-red-400'
                            }`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </div>

                      <button
                        onClick={exportToPDF}
                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] sm:text-xs font-bold px-3 py-2 rounded-full transition"
                      >
                        Download Ticket
                      </button>
                    </div>

                    <div className="absolute top-1/2 left-28 sm:left-36 right-0 border-t border-pink-400 border-dashed"></div>
                  </div>
                )
              })}
            </div>
          </motion.div>
          // --- Optimized Ticket Carousel Ends ---
        )}
      </div>
    </div>
  )
}
