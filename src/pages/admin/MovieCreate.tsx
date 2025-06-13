import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-hot-toast'
import MovieForm from '../admin/MovieForm'
import type { Movie } from '../../types'

export default function MovieCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (movieData: Omit<Movie, 'id'>) => {
    setLoading(true)

    try {
      await addDoc(collection(db, 'movies'), {
        ...movieData,
        createdAt: new Date(),
      })
      toast.success('Movie created successfully!', {
        style: {
          background: '#333',
          color: '#fff',
        }
      })
      navigate('/admin/movies')
    } catch (error) {
      toast.error('Error creating movie', {
        style: {
          background: '#ff3b30',
          color: '#fff',
        }
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
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
            {/* <h1 className="text-2xl font-semibold text-neutral-900">Add New Movie</h1> */}
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero section with subtle gradient */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold text-neutral-100 mb-3 tracking-wide">Create Movie Listing</h2>
            <p className="text-base text-neutral-300 tracking-wide">Fill in the details to add a new movie to your cinema</p>
          </div>

          {/* Form container with card-like appearance */}
          <div className="bg-neutral-950 rounded-2xl shadow-sm overflow-hidden border border-neutral-800">
            {/* Form header */}
            <div className="bg-neutral-950 px-8 py-5 borde-b border-neutral-100">
              <h3 className="text-xl font-medium text-neutral-100">Movie Information</h3>
              <p className="text-xs text-neutral-200 mt-1">All fields are required unless marked optional</p>
            </div>

            {/* Form content */}
            <div className="p-8">
              <MovieForm
                onSubmit={handleSubmit}
                loading={loading}
                initialValues={{
                  title: '',
                  description: '',
                  posterUrl: '',
                  genre: [],
                  rating: '',
                  runtime: 0,
                  releaseYear: new Date().getFullYear(),
                  ticketPrice: 10,
                  showtimes: ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM']
                }}
              />
            </div>

            {/* Form footer with submit button */}
            <div className="bg-neutral-950 px-8 py-5 borde-t border-neutral-100 flex justify-end">
              <button
                type="submit"
                form="movie-form"
                disabled={loading}
                className={`px-6 py-3 rounded-full text-white font-medium transition-colors ${loading ? 'bg-neutral-400' : 'bg-black hover:bg-neutral-800'}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Create Movie'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}