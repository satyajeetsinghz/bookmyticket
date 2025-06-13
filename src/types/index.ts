import type { Timestamp } from "firebase/firestore";

// Movie type
export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  movieBg?: string; 
  genre: string[];
  rating: string;
  runtime: number; // in minutes
  releaseYear: number;
  ticketPrice: number;
  showtimes?: string[];
  createdAt?: Date | Timestamp;
}

// Booking type
export interface Booking {
  id: string;
  movieId: string;
  userId: string;
  date: string | Timestamp;
  time: string;
  seats: string | string[];
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date | Timestamp;
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  admin: boolean;
  createdAt: Date | Timestamp;
  phone?: string;
  address?: string;
}

// For API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// For pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}
