import React, { useState } from 'react';
import { 
  Droplet, // Water
  Wheat, // Flour
  Egg, // Egg
  Candy // Sugar (using candy icon)
} from 'lucide-react';

// The required sequence defined by the "Recipe Card"
const RECIPE_SEQUENCE = ['Water', 'Flour', 'Eggs', 'Sugar'];

export const RecipeBuilder = ({ onEnd }: { onEnd: (score: number, time: number) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [draggedIngredient, setDraggedIngredient] = useState<string | null>(null);
  const [addedIngredients, setAddedIngredients] = useState<React.ReactNode[]>([]);

  const pantry = [
    { name: 'Flour', icon: <Wheat size={28} className="text-amber-200" /> },
    { name: 'Sugar', icon: <Candy size={28} className="text-pink-300" /> },
    { name: 'Eggs', icon: <Egg size={28} className="text-yellow-500" /> },
    { name: 'Water', icon: <Droplet size={28} className="text-blue-400" /> },
    // Distractor items (optional, add later for difficulty)
  ];

  const handleDragStart = (itemName: string) => {
    setDraggedIngredient(itemName);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedIngredient) return;

    const requiredIngredient = RECIPE_SEQUENCE[currentStep];

    if (draggedIngredient === requiredIngredient) {
      // Correct Ingredient added
      const ingredientIcon = pantry.find(p => p.name === draggedIngredient)?.icon;
      setAddedIngredients(prev => [...prev, ingredientIcon]);

      if (currentStep === RECIPE_SEQUENCE.length - 1) {
        // Finished
        const timeTaken = Math.round((Date.now() - startTime) / 1000);
        const finalScore = Math.max(0, 100 - (mistakes * 10)); 
        onEnd(finalScore, timeTaken);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      // Wrong ingredient order
      setMistakes(prev => prev + 1);
    }
    setDraggedIngredient(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="flex flex-col w-full max-w-4xl gap-6">
      
      {/* Top Section: Recipe Card & Bowl */}
      <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
        
        {/* Recipe Card (Instructions) */}
        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-sm rotate-1 transform w-64">
          <h3 className="text-lg font-serif font-bold text-yellow-900 mb-4 border-b border-yellow-200 pb-2 text-center">Grandma's Cookie Base</h3>
          <ol className="list-decimal pl-5 space-y-3 text-yellow-800">
            {RECIPE_SEQUENCE.map((step, index) => (
              <li key={index} className={`transition-all ${index === currentStep ? 'font-bold text-indigo-600 scale-105' : index < currentStep ? 'line-through opacity-50' : ''}`}>
                Add {step}
              </li>
            ))}
            <li className="opacity-50">Mix Well</li>
          </ol>
        </div>

        {/* Drop Zone: Mixing Bowl */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`relative w-72 h-64 bg-gray-100 rounded-b-[4rem] border-4 border-t-0 transition-all duration-300 overflow-hidden flex items-end justify-center pb-4
                 ${draggedIngredient ? 'border-indigo-400 shadow-lg' : 'border-gray-300 shadow-inner'}
            `}
          >
            <span className="absolute top-4 text-sm font-bold text-gray-400 uppercase tracking-widest pointer-events-none">Mixing Bowl</span>
            
            {/* Visually accumulate ingredients in the bowl */}
            <div className="flex flex-wrap gap-2 items-end justify-center mb-4 px-4">
                 {addedIngredients.map((icon, idx) => (
                   <div key={idx} className="animate-bounce-in">{icon}</div>
                 ))}
            </div>
             {/* "Water" level effect if water is added */}
            {currentStep > 0 && <div className="absolute bottom-0 left-0 right-0 bg-blue-100/50 h-1/3 w-full -z-10 rounded-b-[3.5rem]"></div>}
          </div>
          {mistakes > 0 && <p className="text-red-500 text-sm mt-2 font-medium">Incorrect ingredients: {mistakes}</p>}
        </div>
      </div>

      {/* Bottom Section: Pantry (Draggable Ingredients) */}
      <div className="bg-white p-6 rounded-xl border-t border-gray-100 shadow-up-sm">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Pantry Ingredients</h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {pantry.map((item) => (
            <div
              key={item.name}
              draggable
              onDragStart={() => handleDragStart(item.name)}
              className={`p-4 bg-gray-50 rounded-xl shadow-sm border-2 border-transparent hover:border-indigo-300 cursor-grab active:cursor-grabbing flex flex-col items-center transition-all w-24
                ${draggedIngredient === item.name ? 'opacity-50 scale-95' : 'hover:-translate-y-1'}
              `}
            >
              {item.icon}
              <span className="text-sm font-medium text-gray-700 mt-2">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};