import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TicketIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  MinusIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface BookingFormProps {
  movieId: string;
  ticketPrice: number;
}

export default function BookingForm({ movieId, ticketPrice }: BookingFormProps) {
  const { currentUser } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Please login to book tickets', {
        style: {
          background: 'rgba(239, 68, 68, 0.9)',
          color: '#fff',
          backdropFilter: 'blur(10px)'
        }
      });
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'bookings'), {
        movieId,
        userId: currentUser.uid,
        date: Timestamp.fromDate(new Date(date)),
        time,
        seats,
        totalPrice: seats * ticketPrice,
        createdAt: serverTimestamp(),
        status: 'confirmed',
      });

      toast.success('Booking successful!', {
        style: {
          background: 'rgba(16, 185, 129, 0.9)',
          color: '#fff',
          backdropFilter: 'blur(10px)'
        },
        iconTheme: {
          primary: '#fff',
          secondary: 'rgba(16, 185, 129, 1)'
        }
      });
      navigate('/my-bookings');
    } catch (error) {
      toast.error('Error creating booking', {
        style: {
          background: 'rgba(239, 68, 68, 0.9)',
          color: '#fff',
          backdropFilter: 'blur(10px)'
        }
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="glass rounded-apple-lg px-4 py-8 sm:px-6 md:px-8 max-w-xl w-full mx-auto backdrop-blur-lg border border-white/10"
>
  <motion.h2
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.1 }}
    className="text-xl sm:text-2xl font-medium text-white mb-6 flex items-center"
  >
    <TicketIcon className="h-6 w-6 text-primary-DEFAULT mr-3" />
    Reserve Your Experience
  </motion.h2>

  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Date and Time */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
    >
      {/* Date Picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-secondary block">
          <span className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-text-tertiary" />
            Date
          </span>
        </label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input w-full"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Time Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 block">
          <span className="flex items-center space-x-2">
            <ClockIcon className="h-4 w-4 text-neutral-400" />
            <span>Time</span>
          </span>
        </label>
        <div className="relative">
          <select
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-neutral-700 text-text-primary border border-border-DEFAULT rounded-apple-sm px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT transition duration-300 shadow-apple-input"
          >
            <option className="bg-neutral-800 text-text-secondary" value="" disabled>
              Select Showtime
            </option>
            {['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'].map((t) => (
              <option key={t} value={t} className="bg-neutral-800 text-text-primary">
                {t}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-text-tertiary" />
          </div>
        </div>
      </div>
    </motion.div>

    {/* Seat Selector */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-2"
    >
      <label className="text-sm font-medium text-text-secondary block">
        <span className="flex items-center">
          <UserGroupIcon className="h-4 w-4 mr-2 text-text-tertiary" />
          Number of Guests
        </span>
      </label>
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => setSeats(Math.max(1, seats - 1))}
          className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-text-secondary hover:bg-background-DEFAULT transition-colors"
          disabled={seats <= 1}
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="text-lg font-medium text-white w-10 min-w-[2.5rem] text-center">
          {seats}
        </span>
        <button
          type="button"
          onClick={() => setSeats(Math.min(10, seats + 1))}
          className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-text-secondary hover:bg-background-DEFAULT transition-colors"
          disabled={seats >= 10}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>

    {/* Total Price */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="pt-4 border-t border-border-DEFAULT"
    >
      <div className="flex justify-between items-center">
        <span className="text-text-secondary">Total</span>
        <span className="text-2xl font-semibold text-white">
          ${(seats * ticketPrice).toFixed(2)}
        </span>
      </div>
    </motion.div>

    {/* Submit Button */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary mt-6 group relative overflow-hidden px-4 py-3 sm:py-3.5"
      >
        <span className="relative z-10 flex items-center justify-center">
          {loading ? (
            <>
              <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Confirm Reservation
              <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-primary-DEFAULT to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
      </button>
    </motion.div>
  </form>
</motion.div>

  );
}