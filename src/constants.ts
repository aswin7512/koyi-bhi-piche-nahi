import { Game, PerformanceMetric, UserRole } from './types';

// Define the 5 specific buckets you asked for
export type SkillCategory = 'Practical' | 'Creative' | 'Analytical' | 'Technical' | 'Social';

interface GameWithMetrics extends Game {
  // Define which skills this game improves (primary and secondary)
  metrics: Partial<Record<SkillCategory, number>>; 
}

export const GAMES: GameWithMetrics[] = [
  {
    id: 'pattern-weaver',
    title: 'Pattern Weaver',
    description: 'Connect dots following a specific pattern.',
    targetSector: 'Stitching, Embroidery',
    skills: ['Precision', 'Pattern Recognition'],
    thumbnail: 'pattern-weaver-thumb.jpg',
    image: 'pattern_weaver.png',
    // MAPPING: Heavy on Creative (patterns) and Practical (steady hand)
    metrics: { Creative: 0.7, Practical: 0.3 } 
  },
  {
    id: '3d-gift-wrapper',
    title: '3D Gift Wrapper',
    description: 'Wrap boxes in specific sequences.',
    targetSector: 'Packaging, Logistics',
    skills: ['Spatial Awareness', 'Dexterity'],
    thumbnail: 'gift-wrapper-thumb.jpg',
    image: 'gift_wrapper.png',
    // MAPPING: Practical (manual work) and Technical (processes)
    metrics: { Practical: 0.6, Technical: 0.4 }
  },
  {
    id: 'desktop-ranger',
    title: 'Desktop Ranger',
    description: 'Find icons based on auditory/visual cues.',
    targetSector: 'Data Entry, Office Admin',
    skills: ['Computer Literacy', 'Listening'],
    thumbnail: 'desktop-ranger-thumb.jpg',
    image: 'desktop_ranger.png',
    // MAPPING: Technical (computer skills) and Social (Listening/Instructions)
    metrics: { Technical: 0.7, Social: 0.3 }
  },
  {
    id: 'color-sorter',
    title: 'Color Sorter',
    description: 'Sort items quickly into bins.',
    targetSector: 'Manufacturing, Sorting',
    skills: ['Attention', 'Speed'],
    thumbnail: 'color-sorter-thumb.jpg',
    image: 'color_sorter_warehouse.png',
    // MAPPING: Analytical (categorization) and Practical (speed)
    metrics: { Analytical: 0.6, Practical: 0.4 }
  },
  {
    id: 'recipe-builder',
    title: 'Recipe Builder',
    description: 'Follow recipes exactly.',
    targetSector: 'Culinary, Hospitality',
    skills: ['Sequencing', 'Logic'],
    thumbnail: 'recipe-builder-thumb.jpg',
    image: 'recipe_builder.png',
    // MAPPING: Analytical (logic) and Social (Service/Hospitality context)
    metrics: { Analytical: 0.5, Social: 0.5 }
  }
];

// Initial Empty Data for the Chart
export const INITIAL_RADAR_DATA = [
  { subject: 'Practical', A: 0, fullMark: 100 },
  { subject: 'Creative', A: 0, fullMark: 100 },
  { subject: 'Analytical', A: 0, fullMark: 100 },
  { subject: 'Technical', A: 0, fullMark: 100 },
  { subject: 'Social', A: 0, fullMark: 100 },
];