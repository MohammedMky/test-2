
export enum AppStep {
  LOGIN = 'LOGIN',
  OTP = 'OTP',
  SIGNUP = 'SIGNUP',
  HOME = 'HOME',
  AI_DIAGNOSIS = 'AI_DIAGNOSIS',
  SERVICE_DETAILS = 'SERVICE_DETAILS',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Handyman {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  experience: string;
  avatar: string;
  specialties: string[];
  status?: 'active' | 'busy' | 'offline';
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  avatar?: string;
  role?: 'user' | 'admin';
}

export interface Booking {
  id: string;
  serviceName: string;
  customerName: string;
  handymanName: string;
  date: string;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';
  price: number;
}
