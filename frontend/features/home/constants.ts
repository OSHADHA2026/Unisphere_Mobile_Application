import {
  BookOpen,
  Calendar,
  HelpCircle,
  HomeIcon,
  ShoppingBasket,
  Users,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

export type HomeCategory = {
  name: string;
  icon: LucideIcon;
  /** Tile background in light mode. */
  color: string;
  /** Icon color in light mode. */
  iconColor: string;
  route: string;
  description: string;
};

export const HOME_CATEGORIES: HomeCategory[] = [
  { name: 'Marketplace', icon: ShoppingBasket, color: '#EEF2FF', iconColor: '#4338CA', route: '/marketplace', description: 'Buy & sell on campus' },
  { name: 'Study Groups', icon: Users, color: '#F5F3FF', iconColor: '#5B21B6', route: '/studyGroup', description: 'Study with peers' },
  { name: 'Events', icon: Calendar, color: '#F0F9FF', iconColor: '#0369A1', route: '/events', description: 'What\'s happening' },
  { name: 'Lost & Found', icon: HelpCircle, color: '#FFF7ED', iconColor: '#C2410C', route: '/lost', description: 'Report or claim items' },
  { name: 'Housing', icon: HomeIcon, color: '#ECFDF5', iconColor: '#047857', route: '/housing', description: 'Rooms near campus' },
  { name: 'Tutors', icon: BookOpen, color: '#FEF2F2', iconColor: '#B91C1C', route: '/tutors', description: 'Learn from peers' },
];

export const FEATURED_EVENTS_LIMIT = 5;
export const WELCOME_DURATION_MS = 3000;
export const FALLBACK_EVENT_IMAGE =
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000';
