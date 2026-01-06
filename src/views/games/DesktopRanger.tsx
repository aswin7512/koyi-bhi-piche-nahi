import React, { useState, useEffect } from 'react';
import { Folder, Trash2, FileText } from 'lucide-react';

export const DesktopRanger = ({ onEnd }: { onEnd: (score: number, time: number) => void }) => {
  const [target, setTarget] = useState('Folder');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [position, setPosition] = useState({ top: '20%', left: '20%' });
  
  const icons = [
    { name: 'Folder', icon: <Folder size={40} className="text-yellow-500" /> },
    { name: 'Trash', icon: <Trash2 size={40} className="text-gray-500" /> },
    { name: 'File', icon: <FileText size={40} className="text-blue-500" /> },
  ];
  const [currentIcon, setCurrentIcon] = useState(icons[0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onEnd(score * 10, 15); // End game
          return 0;
        }
        return prev - 1;
      });
      // Move icon randomly
      moveIcon();
    }, 3000);
    return () => clearInterval(timer);
  }, [score]);

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
    // Change target occasionally
    if (Math.random() > 0.7) setTarget(icons[Math.floor(Math.random() * icons.length)].name);
    moveIcon();
  };

  return (
    <div className="w-full h-[400px] bg-indigo-50 rounded-xl border border-indigo-200 relative overflow-hidden">
      <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow font-bold text-gray-700 z-10">
        Find: <span className="text-indigo-600">{target}</span> | Time: {timeLeft}s
      </div>

      <button
        onClick={handleClick}
        className="absolute p-4 hover:bg-white/50 rounded-xl transition-all active:scale-90"
        style={{ top: position.top, left: position.left }}
      >
        {currentIcon.icon}
        <span className="text-xs font-bold block text-center mt-1 text-gray-600">{currentIcon.name}</span>
      </button>
    </div>
  );
};