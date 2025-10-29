import { create } from 'zustand';
import { Customer, VehicleCategory, Booking, BookingForm } from './types';

interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  setCustomer: (customer: Customer | null) => void;
  logout: () => void;
}

interface BookingState {
  bookingForm: Partial<BookingForm>;
  selectedVehicle: VehicleCategory | null;
  updateBookingForm: (data: Partial<BookingForm>) => void;
  setSelectedVehicle: (vehicle: VehicleCategory | null) => void;
  clearBooking: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  customer: null,
  isAuthenticated: false,
  setCustomer: (customer) => set({ customer, isAuthenticated: !!customer }),
  logout: () => set({ customer: null, isAuthenticated: false }),
}));

export const useBookingStore = create<BookingState>((set) => ({
  bookingForm: {},
  selectedVehicle: null,
  updateBookingForm: (data) =>
    set((state) => ({ bookingForm: { ...state.bookingForm, ...data } })),
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  clearBooking: () => set({ bookingForm: {}, selectedVehicle: null }),
}));
