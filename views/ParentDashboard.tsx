import React from 'react';
import { Performance } from './Performance';
import { User } from '../types';

interface ParentDashboardProps {
  user: User;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ user }) => {
  return (
    <div>
      <div className="bg-yellow-50 p-4 text-center">
        <p className="text-yellow-800 font-medium">Viewing as Parent: {user.name} (Child: Alex Student)</p>
      </div>
      <Performance />
    </div>
  );
};