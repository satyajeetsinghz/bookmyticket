// services/movies.ts
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

import { db } from '../config/firebase'; // Adjust path based on your project structure
import type { Movie } from '../types';


export async function getRelatedMovies(movieId: string, genre: string[]): Promise<Movie[]> {
  try {
    // Example: Fetch movies with at least one matching genre, excluding current movie
    const q = query(
      collection(db, 'movies'),
      where('genre', 'array-contains-any', genre.slice(0, 2)),
      where('id', '!=', movieId),
      limit(4)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie))
  } catch (error) {
    console.error('Error fetching related movies:', error)
    return []
  }
}