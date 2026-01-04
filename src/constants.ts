import { Game, PerformanceMetric, UserRole } from './types';

export const GAMES: Game[] = [
  {
    id: 'pattern-weaver',
    title: 'Pattern Weaver',
    description: 'Connect dots following a specific pattern to test precision and steady speed.',
    targetSector: 'Stitching, Embroidery, Textile',
    skills: ['Precision', 'Steady Hands', 'Pattern Recognition'],
    thumbnail: 'https://images.unsplash.com/photo-1628144214470-363d681c62b9?auto=format&fit=crop&q=80',
    image: 'pattern_weaver.png'
  },
  {
    id: '3d-gift-wrapper',
    title: '3D Gift Wrapper',
    description: 'Drag paper and tape to cover a box in a specific sequence.',
    targetSector: 'Packaging, Binding, Logistics',
    skills: ['Spatial Awareness', 'Sequence Memory', 'Manual Dexterity'],
    thumbnail: 'https://images.unsplash.com/photo-1606836437815-512c14526d55?auto=format&fit=crop&q=80',
    image: 'gift_wrapper.png'
  },
  {
    id: 'desktop-ranger',
    title: 'Desktop Ranger',
    description: 'Find and click the correct computer icons based on auditory cues.',
    targetSector: 'Data Entry, Archiving, Office Assistance',
    skills: ['Visual Discrimination', 'Mouse Accuracy', 'Listening'],
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80',
    image: 'desktop_ranger.png'
  },
  {
    id: 'color-sorter',
    title: 'Color Sorter Warehouse',
    description: 'Sort colored beads into matching buckets on a moving conveyor belt.',
    targetSector: 'Production Line, Inventory, Sorting',
    skills: ['Sustained Attention', 'Categorization', 'Reaction Time'],
    thumbnail: 'https://images.unsplash.com/photo-1595562768549-d7790b503002?auto=format&fit=crop&q=80',
    image: 'color_sorter_warehouse.png'
  },
  {
    id: 'recipe-builder',
    title: 'Recipe Builder',
    description: 'Drag ingredients in the exact order shown on a recipe card.',
    targetSector: 'Culinary Arts, Structured Manual Labor',
    skills: ['Logic & Flow', 'Cause and Effect', 'Sequencing'],
    thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80',
    image: 'recipe_builder.png'
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

