import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-hot-toast'
import MovieForm from '../admin/MovieForm'
import type { Movie } from '../../types'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function MovieEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const docRef = doc(db, 'movies', id!)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setMovie({ id: docSnap.id, ...docSnap.data() } as Movie)
        } else {
          toast.error('Movie not found', {
            style: {
              background: '#ff3b30',
              color: '#fff',
            }
          })
          navigate('/admin/movies')
        }
      } catch (error) {
        toast.error('Error fetching movie', {
          style: {
            background: '#ff3b30',
            color: '#fff',
          }
        })
        console.error(error)
        navigate('/admin/movies')
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id, navigate])

  const handleSubmit = async (movieData: Omit<Movie, 'id'>) => {
    if (!id) return

    setUpdating(true)

    try {
      const movieRef = doc(db, 'movies', id)
      await updateDoc(movieRef, movieData)
      toast.success('Movie updated successfully!', {
        style: {
          background: '#333',
          color: '#fff',
        }
      })
      navigate('/admin/movies')
    } catch (error) {
      toast.error('Error updating movie', {
        style: {
          background: '#ff3b30',
          color: '#fff',
        }
      })
      console.error(error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600">Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center p-8 bg-neutral-900 rounded-2xl shadow-sm borde border-neutral-100 max-w-md">
          <svg className="mx-auto h-12 w-12 text-neutral-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-neutral-100">Movie not found</h3>
          <p className="mt-1 text-neutral-100">The movie you're looking for doesn't exist or may have been removed.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/admin/movies')}
              className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Back to Movies
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header with Apple-style navigation */}
      <header className="bg-transparent borde-b border-neutral-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/movies')}
              className="flex items-center text-neutral-100 hover:text-neutral-300 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            {/* <h1 className="text-2xl font-semibold text-neutral-900">Edit Movie</h1> */}
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero section with subtle gradient */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold text-neutral-100 mb-2">{movie.title}</h2>
            <p className="text-lg text-neutral-300">Update the details for this movie listing</p>
          </div>

          {/* Form container with card-like appearance */}
          <div className="bg-neutral-950 rounded-2xl shadow-sm overflow-hidden border border-neutral-700">
            {/* Form header */}
            <div className="bg-neutral-950 px-8 py-5 border-b border-neutral-700">
              <h3 className="text-xl font-medium text-neutral-100">Movie Information</h3>
              <p className="text-sm text-neutral-300 mt-1">Update the fields you want to change</p>
            </div>

            {/* Form content */}
            <div className="p-8">
              <MovieForm
                onSubmit={handleSubmit}
                loading={updating}
                initialValues={{
                  title: movie.title,
                  description: movie.description,
                  posterUrl: movie.posterUrl,
                  movieBg: movie.movieBg || '', // Add movieBg field
                  genre: movie.genre,
                  rating: movie.rating,
                  runtime: movie.runtime,
                  releaseYear: movie.releaseYear,
                  ticketPrice: movie.ticketPrice,
                  showtimes: movie.showtimes || ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM']
                }}
              />
            </div>

            {/* Form footer with submit button */}
            <div className="bg-neutral-950 px-8 py-5 borde-t border-neutral-100 flex justify-end">
              <button
                type="submit"
                form="movie-form"
                disabled={updating}
                className={`px-6 py-3 rounded-full text-white font-medium transition-colors ${updating ? 'bg-neutral-400' : 'bg-neutral-900 hover:bg-neutral-800'}`}
              >
                {updating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}