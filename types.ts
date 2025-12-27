export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

export interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  targetSector: string;
  skills: string[];
  thumbnail: string;
  image: string;
}

export interface PerformanceMetric {
  subject: string;
  A: number; // Student Score
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