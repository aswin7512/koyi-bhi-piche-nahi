import React, { useState } from 'react';
import { Package, Scroll, Sticker, Scissors, MousePointerClick } from 'lucide-react';

// The required sequence to wrap the gift correctly
const SEQUENCE = ['Paper', 'Tape', 'Bow', 'Label'];

export const GiftWrapper = ({ onEnd }: { onEnd: (score: number, time: number) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  
  // CHANGED: Instead of 'draggedItem', we track 'selectedItem'
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const items = [
    { name: 'Paper', icon: <Scroll size={32} className="text-amber-600" /> },
    { name: 'Tape', icon: <Scissors size={32} className="text-gray-400 rotate-90" /> },
    { name: 'Bow', icon: <Sticker size={32} className="text-red-500" /> },
    { name: 'Label', icon: <Sticker size={32} className="text-blue-500" /> },
  ];

  // 1. User clicks an item to "pick it up"
  const handleItemClick = (itemName: string) => {
    setSelectedItem(itemName);
  };

  // 2. User clicks the box to "apply" the selected item
  const handleBoxClick = () => {
    if (!selectedItem) return; // Ignore if nothing selected

    const requiredItem = SEQUENCE[currentStep];

    if (selectedItem === requiredItem) {
      // Correct Step
      if (currentStep === SEQUENCE.length - 1) {
        // Game Finished
        const timeTaken = Math.round((Date.now() - startTime) / 1000);
        const finalScore = Math.max(0, 100 - (mistakes * 10)); 
        onEnd(finalScore, timeTaken);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      // Wrong Item Order
      setMistakes(prev => prev + 1);
    }
    // Reset selection after attempt
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-3xl animate-fade-in">
      
      {/* Left Side: Tools Panel */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner w-full md:w-auto">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Packing Station</h3>
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <button
              key={item.name}
              onClick={() => handleItemClick(item.name)}
              className={`p-4 rounded-lg shadow-sm border-2 flex flex-col items-center transition-all w-full
                ${selectedItem === item.name 
                  ? 'bg-indigo-50 border-indigo-500 scale-105 ring-2 ring-indigo-200' // Highlight when selected
                  : 'bg-white border-transparent hover:border-indigo-300'
                }
              `}
            >
              {item.icon}
              <span className="text-xs font-medium text-gray-700 mt-2">{item.name}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">Tap item to select</p>
      </div>

      {/* Right Side: The Box (Click Target) */}
      <div className="flex-1 flex flex-col items-center">
         <div className="mb-4 text-center">
            <p className="text-lg font-bold text-indigo-900">Step {currentStep + 1} of {SEQUENCE.length}</p>
            <p className="text-sm text-gray-500">Hint: What comes next?</p>
         </div>
         
        <div
          onClick={handleBoxClick}
          className={`relative w-64 h-64 bg-amber-100 rounded-lg border-4 border-dashed transition-all duration-300 flex items-center justify-center cursor-pointer
            ${selectedItem ? 'border-indigo-400 bg-indigo-50 shadow-lg scale-105' : 'border-amber-300 hover:bg-amber-50'}
          `}
        >
           {/* Visual Guide when item selected */}
           {selectedItem && (
             <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20 rounded-lg animate-pulse pointer-events-none">
                <span className="text-indigo-600 font-bold flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                  <MousePointerClick size={16} /> Tap to Place {selectedItem}
                </span>
             </div>
           )}

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
           
           <span className="absolute bottom-2 text-sm font-bold text-amber-900/50 uppercase tracking-widest pointer-events-none">
             {selectedItem ? 'Click here!' : 'Gift Box'}
           </span>
        </div>
        {mistakes > 0 && <p className="text-red-500 text-sm mt-2">Mistakes: {mistakes}</p>}
      </div>
    </div>
  );
};