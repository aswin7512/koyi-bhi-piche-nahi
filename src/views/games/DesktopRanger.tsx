// src/views/games/DesktopRanger.tsx
import React, { useState, useEffect } from 'react';
import { Folder, Trash2, FileText, Monitor } from 'lucide-react';

export const DesktopRanger = ({ onEnd }: { onEnd: (score: number) => void }) => {
  const [position, setPosition] = useState({ top: '20%', left: '20%' });
  const [target, setTarget] = useState('Folder'); // What user must click
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

  const icons = [
    { name: 'Folder', icon: <Folder size={32} className="text-yellow-500" /> },
    { name: 'Trash', icon: <Trash2 size={32} className="text-gray-500" /> },
    { name: 'File', icon: <FileText size={32} className="text-blue-500" /> },
  ];
  
  // Current random icon shown
  const [currentIcon, setCurrentIcon] = useState(icons[0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          onEnd(score * 20); // End Game
          return 0;
        }
        return t - 1;
      });
      // Move icon every second
      moveIcon();
    }, 1000);
    return () => clearInterval(timer);
  }, [score]); // Re-run if score changes to prevent stale closure

  const moveIcon = () => {
    const randomTop = Math.floor(Math.random() * 80) + '%';
    const randomLeft = Math.floor(Math.random() * 80) + '%';
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    setPosition({ top: randomTop, left: randomLeft });
    setCurrentIcon(randomIcon);
  };

  const handleClick = () => {
    if (currentIcon.name === target) {
      setScore(s => s + 1);
    } else {
      setScore(s => Math.max(0, s - 1)); // Penalty
    }
    moveIcon();
  };

  return (
    <div className="relative w-full h-[400px] bg-indigo-50 rounded-xl border border-indigo-100 overflow-hidden cursor-crosshair">
      <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded shadow text-sm">
        Find: <b>{target}</b> | Time: {timeLeft}s
      </div>

      <button
        onClick={handleClick}
        className="absolute p-4 hover:bg-gray-100 rounded-lg transition-all active:scale-95"
        style={{ top: position.top, left: position.left }}
      >
        {currentIcon.icon}
        <span className="text-xs block text-center mt-1">{currentIcon.name}</span>
      </button>
    </div>
  );
};