export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  linked_student_email?: string;
  school?: string;
  class_grade?: string;
  gender?: string;
  dob?: string;
  blood_group?: string;
  parent_contact?: string;
  address?: string;
  avatar_url?: string;
  disability_category?: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  targetSector: string;
  skills: string[];
  thumbnail: string;
  image: string;
  metrics?: Partial<Record<string, number>>;
}

export interface PerformanceMetric {
  subject: string;
  A: number;
  fullMark: number;
}

export interface GameResult {
  gameId: string;
  score: number;
  time: number;
  attempts: number;
  accuracy: number;
  date: string;
}