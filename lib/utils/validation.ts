import { z } from 'zod'

export const vehicleSearchSchema = z.object({
  category: z.string().optional(),
  minPrice: z.string().optional().transform(Number),
  maxPrice: z.string().optional().transform(Number),
  passengers: z.string().optional().transform(Number),
  sortBy: z.enum(['price-low', 'price-high', 'rating', 'popularity']).optional(),
})

export const createBookingSchema = z.object({
  vehicleId: z.number().positive(),
  fullName: z.string().min(2).max(255),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  pickupLocation: z.string().min(3).max(500),
  dropoffLocation: z.string().min(3).max(500),
  pickupDate: z.string().refine((date) => new Date(date) >= new Date(), {
    message: 'Pickup date must be in the future',
  }),
  pickupTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  numberOfDays: z.number().int().min(1).max(90),
  estimatedDistanceKm: z.number().min(0).optional(),
  specialRequests: z.string().max(1000).optional(),
})