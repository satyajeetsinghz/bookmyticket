import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Movie } from '../../types';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'movies'));
      const moviesData: Movie[] = [];
      querySnapshot.forEach((doc) => {
        moviesData.push({ id: doc.id, ...doc.data() } as Movie);
      });
      setMovies(moviesData);
    } catch (error) {
      toast.error('Error fetching movies');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        setDeletingId(id);
        await deleteDoc(doc(db, 'movies', id));
        setMovies(movies.filter(movie => movie.id !== id));
        toast.success('Movie deleted successfully');
      } catch (error) {
        toast.error('Error deleting movie');
        console.error(error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Movies</h1>
          <p className="text-neutral-400 mt-1">Manage your movie catalog</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchMovies}
            className="flex items-center px-3 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-sm font-medium text-white transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <Link
            to="/admin/movies/new"
            className="flex items-center px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Movie
          </Link>
        </div>
      </div>

      <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-700">
            <thead className="bg-neutral-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-200 tracking-wider">
                  Movie
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-200 tracking-wider">
                  Genre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-200 tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-200 tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-neutral-900 divide-y divide-neutral-700">
              {movies.map((movie) => (
                <tr key={movie.id} className="hover:bg-neutral-950/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="h-16 w-12 rounded-md object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{movie.title}</div>
                        <div className="text-sm text-neutral-400">{movie.releaseYear}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1.5">
                      {movie.genre.map((g) => (
                        <span
                          key={g}
                          className="px-2 py-1 text-[10px] font-semibold rounded-sm bg-neutral-800 text-neutral-200"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[12px] font-semibold text-white">
                    ${movie.ticketPrice?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/movies/edit/${movie.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-neutral-100 hover:bg-neutral-800 text-neutral-900 hover:text-neutral-200 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        disabled={deletingId === movie.id}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-neutral-100 hover:bg-neutral-800 text-neutral-900 hover:text-neutral-200 transition-colors disabled:opacity-50"
                      >
                        {deletingId === movie.id ? (
                          <span className="flex items-center">
                            <span className="mr-1.5">Deleting</span>
                            <span className="inline-block h-3 w-3 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></span>
                          </span>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {movies.length === 0 && !loading && (
        <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700 mt-4">
          <svg
            className="mx-auto h-12 w-12 text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-white">No movies found</h3>
          <p className="mt-2 text-neutral-400">Add your first movie to get started</p>
          <Link
            to="/admin/movies/new"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Movie
          </Link>
        </div>
      )}
    </div>
  );
}