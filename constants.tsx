
import { Service, Handyman } from './types';

export const SERVICES: Service[] = [
  { id: '1', name: 'Plumbing', icon: 'fa-faucet', color: 'bg-blue-100 text-blue-600', description: 'Fix leaks, faucets, and clogged drains.' },
  { id: '2', name: 'Electrical', icon: 'fa-bolt', color: 'bg-yellow-100 text-yellow-600', description: 'Install fixtures, repair outlets, and wiring.' },
  { id: '3', name: 'Carpentry', icon: 'fa-hammer', color: 'bg-orange-100 text-orange-600', description: 'Furniture repair and custom woodwork.' },
  { id: '4', name: 'Painting', icon: 'fa-paint-roller', color: 'bg-pink-100 text-pink-600', description: 'Interior and exterior painting services.' },
  { id: '5', name: 'Cleaning', icon: 'fa-broom', color: 'bg-green-100 text-green-600', description: 'Professional deep cleaning and organization.' },
  { id: '6', name: 'Gardening', icon: 'fa-leaf', color: 'bg-emerald-100 text-emerald-600', description: 'Lawn care and landscape maintenance.' },
];

export const MOCK_HANDYMEN: Handyman[] = [
  {
    id: 'h1',
    name: 'Alex Johnson',
    rating: 4.8,
    reviews: 124,
    experience: '8 years',
    avatar: 'https://picsum.photos/seed/alex/200',
    specialties: ['Plumbing', 'Electrical']
  },
  {
    id: 'h2',
    name: 'Sarah Chen',
    rating: 4.9,
    reviews: 89,
    experience: '5 years',
    avatar: 'https://picsum.photos/seed/sarah/200',
    specialties: ['Carpentry', 'Painting']
  },
  {
    id: 'h3',
    name: 'Marcus Bell',
    rating: 4.7,
    reviews: 210,
    experience: '12 years',
    avatar: 'https://picsum.photos/seed/marcus/200',
    specialties: ['Electrical', 'Appliances']
  }
];
