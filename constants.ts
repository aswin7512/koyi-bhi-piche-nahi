import { Game, PerformanceMetric, UserRole } from './types';

export const GAMES: Game[] = [
  {
    id: '1',
    title: 'Pattern Weaver',
    description: 'Connect dots following a specific pattern to test precision and steady speed.',
    targetSector: 'Stitching, Embroidery, Textile',
    skills: ['Precision', 'Steady Hands', 'Pattern Recognition'],
    thumbnail: 'https://picsum.photos/id/20/400/300',
    image: 'pattern_weaver.jpeg'
  },
  {
    id: '2',
    title: '3D Gift Wrapper',
    description: 'Drag paper and tape to cover a box in a specific sequence.',
    targetSector: 'Packaging, Binding, Logistics',
    skills: ['Spatial Awareness', 'Sequence Memory', 'Manual Dexterity'],
    thumbnail: 'https://picsum.photos/id/24/400/300',
    image: 'gift_wrapper.jpeg'
  },
  {
    id: '3',
    title: 'Desktop Ranger',
    description: 'Find and click the correct computer icons based on auditory cues.',
    targetSector: 'Data Entry, Archiving, Office Assistance',
    skills: ['Visual Discrimination', 'Mouse Accuracy', 'Listening'],
    thumbnail: 'https://picsum.photos/id/48/400/300',
    image: 'desktop_ranger.jpeg'
  },
  {
    id: '4',
    title: 'Color Sorter Warehouse',
    description: 'Sort colored beads into matching buckets on a moving conveyor belt.',
    targetSector: 'Production Line, Inventory, Sorting',
    skills: ['Sustained Attention', 'Categorization', 'Reaction Time'],
    thumbnail: 'https://picsum.photos/id/76/400/300',
    image: 'color_sorter_warehouse.jpeg'
  },
  {
    id: '5',
    title: 'Recipe Builder',
    description: 'Drag ingredients in the exact order shown on a recipe card.',
    targetSector: 'Culinary Arts, Structured Manual Labor',
    skills: ['Logic & Flow', 'Cause and Effect', 'Sequencing'],
    thumbnail: 'https://picsum.photos/id/102/400/300',
    image: 'recipe_builder.jpeg'
  }
];

export const MOCK_RADAR_DATA: PerformanceMetric[] = [
  { subject: 'Memory', A: 120, fullMark: 150 },
  { subject: 'Visual', A: 98, fullMark: 150 },
  { subject: 'Motor', A: 86, fullMark: 150 },
  { subject: 'Logic', A: 99, fullMark: 150 },
  { subject: 'Emotional', A: 85, fullMark: 150 },
  { subject: 'Flexibility', A: 65, fullMark: 150 },
];

export const MOCK_LINE_DATA = [
  { name: 'Jan', score: 400 },
  { name: 'Feb', score: 600 },
  { name: 'Mar', score: 800 },
  { name: 'Apr', score: 750 },
  { name: 'May', score: 950 },
  { name: 'Jun', score: 1100 },
];

export const SAMPLE_USERS = [
  { email: 'admin@example.com', password: 'admin@123', name: 'Admin Teacher', role: UserRole.ADMIN },
  { email: 'student@example.com', password: 'student@123', name: 'Alex Student', role: UserRole.STUDENT },
  { email: 'parent@example.com', password: 'parent@123', name: 'Jamie Parent', role: UserRole.PARENT },
];