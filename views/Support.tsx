import React from 'react';
import { FileText, Video, UserCheck, Lightbulb } from 'lucide-react';

export const Support: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">Educational Support Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* Card 1 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
            <Lightbulb size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Simple Exercises</h3>
          <p className="text-gray-500 mb-6">Quick exercises designed for each specific skill set.</p>
          <button className="text-indigo-600 font-semibold hover:text-indigo-800">View Exercises &rarr;</button>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Printable Worksheets</h3>
          <p className="text-gray-500 mb-6">Download PDFs to practice offline anytime.</p>
          <button className="text-indigo-600 font-semibold hover:text-indigo-800">Browse Library &rarr;</button>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
            <Video size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Explainer Videos</h3>
          <p className="text-gray-500 mb-6">Visual guides explaining techniques and skills.</p>
          <button className="text-indigo-600 font-semibold hover:text-indigo-800">Watch Now &rarr;</button>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <UserCheck size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Parent/Teacher Guidance</h3>
          <p className="text-gray-500 mb-6">Tips on how to support the learning journey.</p>
          <button className="text-indigo-600 font-semibold hover:text-indigo-800">Read Guides &rarr;</button>
        </div>

      </div>
    </div>
  );
};