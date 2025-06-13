import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Booking {
  id: string;
  movieId: string;
  userId: string;
  date: string | Timestamp;
  time: string;
  seats: string[]; // or string | string[] if needed
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed';
}

interface Movie {
  title: string;
  posterUrl: string;
  // add other fields you need
}

interface BookingWithMovie extends Booking {
  movie?: Movie | null;
}

export function useUserBookings(userId?: string) {
  const [bookings, setBookings] = useState<BookingWithMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchBookings() {
      setLoading(true);
      try {
        const q = query(collection(db, 'bookings'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const bookingList: Booking[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Booking, 'id'>),
        }));

        const bookingsWithMovies = await Promise.all(
          bookingList.map(async (booking) => {
            let movieData: Movie | null = null;
            if (booking.movieId) {
              try {
                const movieSnap = await getDoc(doc(db, 'movies', booking.movieId));
                if (movieSnap.exists()) {
                  movieData = movieSnap.data() as Movie;
                }
              } catch (err) {
                console.error('Error fetching movie:', err);
              }
            }
            return {
              ...booking,
              movie: movieData,
            };
          })
        );

        setBookings(bookingsWithMovies);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [userId]);

  return { bookings, loading };
}
