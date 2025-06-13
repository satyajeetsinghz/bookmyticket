import { useState } from 'react'
import type { Movie } from '../../types'

interface MovieFormProps {
  onSubmit: (movieData: Omit<Movie, 'id'>) => void
  loading: boolean
  initialValues: Omit<Movie, 'id'>
}

export default function MovieForm({ onSubmit, loading, initialValues }: MovieFormProps) {
  const [formData, setFormData] = useState<Omit<Movie, 'id'>>(initialValues)
  const [genreInput, setGenreInput] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'runtime' || name === 'releaseYear' || name === 'ticketPrice'
        ? Number(value)
        : value
    }))
  }

  const addGenre = () => {
    if (genreInput && !formData.genre.includes(genreInput)) {
      setFormData(prev => ({
        ...prev,
        genre: [...prev.genre, genreInput]
      }))
      setGenreInput('')
    }
  }

  const removeGenre = (genreToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.filter(g => g !== genreToRemove)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Poster URL Field */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Poster URL</label>
          <div className="flex items-center space-x-4">
            <input
              type="url"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleChange}
              className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
            {formData.posterUrl && (
              <div className="w-16 h-16 rounded-md overflow-hidden border border-neutral-700">
                <img src={formData.posterUrl} alt="Poster preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* // Add this field to your form (likely near the posterUrl field) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-300 mb-2">Background Image URL</label>
          <div className="flex items-center space-x-4">
            <input
              type="url"
              name="movieBg"
              value={formData.movieBg}
              onChange={handleChange}
              placeholder="https://example.com/background.jpg"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.movieBg && (
              <div className="mt-2">
                {/* <p className="text-xs text-neutral-400 mb-1">Preview:</p> */}
                <img
                  src={formData.movieBg}
                  alt="Background preview"
                  className="w-48 h-24 object-cover  object-center rounded-md border border-neutral-600"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Genre Field */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Genre</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Add genre (e.g. Action, Comedy)"
            />
            <button
              type="button"
              onClick={addGenre}
              disabled={!genreInput.trim()}
              className="px-4 py-3 bg-neutral-800 hover:bg-neutral-900 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-medium rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.genre.map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-neutral-700 text-neutral-200"
              >
                {genre}
                <button
                  type="button"
                  onClick={() => removeGenre(genre)}
                  className="ml-2 -mr-1 text-neutral-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select rating</option>
              <option value="G">G - General Audiences</option>
              <option value="PG">PG - Parental Guidance</option>
              <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
              <option value="R">R - Restricted</option>
              <option value="NC-17">NC-17 - Adults Only</option>
            </select>
          </div>

          {/* Runtime */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Runtime (minutes)</label>
            <input
              type="number"
              name="runtime"
              value={formData.runtime}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Release Year */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Release Year</label>
            <input
              type="number"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 5}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        {/* Ticket Price */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Ticket Price ($)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">$</span>
            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleChange}
              min="1"
              step="0.01"
              className="w-full pl-8 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        {/* Showtimes */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Showtimes</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {formData.showtimes?.map((time) => (
              <div key={time} className="flex items-center">
                <input
                  type="checkbox"
                  id={`showtime-${time}`}
                  checked={true}
                  readOnly
                  className="h-4 w-4 text-blue-600 bg-neutral-800 border-neutral-700 rounded focus:ring-blue-500"
                />
                <label htmlFor={`showtime-${time}`} className="ml-2 text-sm text-neutral-300">
                  {time}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-neutral-800 hover:bg-neutral-900 disabled:bg-neutral-700 text-neutral-100 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : (
          'Save Movie'
        )}
      </button>
    </form>
  )
}