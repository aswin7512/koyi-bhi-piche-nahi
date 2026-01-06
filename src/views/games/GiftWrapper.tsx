import React, { useState } from 'react';
import { Package, Scroll, Sticker, Scissors } from 'lucide-react';

// The required sequence to wrap the gift correctly
const SEQUENCE = ['Paper', 'Tape', 'Bow', 'Label'];

export const GiftWrapper = ({ onEnd }: { onEnd: (score: number, time: number) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const items = [
    { name: 'Paper', icon: <Scroll size={32} className="text-amber-600" /> },
    { name: 'Tape', icon: <Scissors size={32} className="text-gray-400 rotate-90" /> }, // Using scissors as makeshift tape dispenser icon
    { name: 'Bow', icon: <Sticker size={32} className="text-red-500" /> }, // Using sticker as ribbon/bow
    { name: 'Label', icon: <Sticker size={32} className="text-blue-500" /> },
  ];

  const handleDragStart = (itemName: string) => {
    setDraggedItem(itemName);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    const requiredItem = SEQUENCE[currentStep];

    if (draggedItem === requiredItem) {
      // Correct Step
      if (currentStep === SEQUENCE.length - 1) {
        // Game Finished
        const timeTaken = Math.round((Date.now() - startTime) / 1000);
        const finalScore = Math.max(0, 100 - (mistakes * 10)); // 10pt penalty
        onEnd(finalScore, timeTaken);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      // Wrong Item Order
      setMistakes(prev => prev + 1);
      // Optional: Add visual shake effect here for feedback
    }
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-3xl">
      
      {/* Left Side: Tools Panel (Draggable Items) */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Packing Station</h3>
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.name}
              draggable
              onDragStart={() => handleDragStart(item.name)}
              className={`p-4 bg-white rounded-lg shadow-sm border-2 border-transparent hover:border-indigo-300 cursor-grab active:cursor-grabbing flex flex-col items-center transition-all ${
                draggedItem === item.name ? 'opacity-50' : ''
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium text-gray-700 mt-2">{item.name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">Drag items in correct order</p>
      </div>

      {/* Right Side: The Drop Zone Box */}
      <div className="flex-1 flex flex-col items-center">
         <div className="mb-4 text-center">
            <p className="text-lg font-bold text-indigo-900">Step {currentStep + 1} of {SEQUENCE.length}</p>
            <p className="text-sm text-gray-500">Hint: What comes next?</p>
         </div>
         
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`relative w-64 h-64 bg-amber-100 rounded-lg border-4 border-dashed transition-all duration-300 flex items-center justify-center
            ${draggedItem ? 'border-indigo-400 bg-indigo-50' : 'border-amber-300'}
          `}
        >
           {/* Base Box Icon */}
           <Package size={100} className={`text-amber-800 transition-all duration-500 ${currentStep > 0 ? 'opacity-0' : 'opacity-100'}`} />
           
           {/* Visual Feedback Overlays based on progress */}
           {currentStep >= 1 && (
             <div className="absolute inset-0 bg-amber-600 rounded-lg opacity-80 animate-fade-in" title="Wrapped in paper"></div>
           )}
           {currentStep >= 2 && (
             <div className="absolute inset-x-0 top-1/2 h-4 bg-gray-300/80 -translate-y-1/2 animate-fade-in" title="Taped"></div>
           )}
           {currentStep >= 3 && (
             <Sticker size={80} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 drop-shadow-lg animate-bounce" title="Bow added" />
           )}
           
           <span className="absolute bottom-2 text-sm font-bold text-amber-900/50 uppercase tracking-widest pointer-events-none">Drop Zone</span>
        </div>
        {mistakes > 0 && <p className="text-red-500 text-sm mt-2">Mistakes: {mistakes}</p>}
      </div>
    </div>
  );
};