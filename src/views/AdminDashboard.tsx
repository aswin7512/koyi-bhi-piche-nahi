import React, { useEffect, useState } from 'react';
import { Users, Search, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { User } from '../types';
import { Performance } from './Performance';

interface AdminDashboardProps {
  user: User;
}

interface StudentProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch ALL Students from the Database
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'student') // <--- Filter only students
          .order('full_name', { ascending: true }); // Alphabetical order

        if (error) throw error;

        if (data) {
          setStudents(data);
          // Optional: Select the first student automatically
          // if (data.length > 0) setSelectedStudentEmail(data[0].email);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudents();
  }, []);

  // Filter logic for the search bar
  const filteredStudents = students.filter(student => 
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600"/></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Portal</h1>
          <p className="text-gray-500">Viewing all registered students</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search students..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: All Registered Students */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[600px] flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Users size={18} /> Student List ({filteredStudents.length})
            </h3>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {filteredStudents.length === 0 ? (
              <p className="text-center text-gray-400 mt-10 text-sm">No students found.</p>
            ) : (
              filteredStudents.map((student) => (
                <div 
                  key={student.id}
                  onClick={() => setSelectedStudentEmail(student.email)}
                  className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    selectedStudentEmail === student.email 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                       selectedStudentEmail === student.email ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                    {student.full_name ? student.full_name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">
                      {student.full_name || 'Unnamed Student'}
                    </p>
                    <p className={`text-xs truncate ${
                      selectedStudentEmail === student.email ? 'text-indigo-200' : 'text-gray-400'
                    }`}>
                      {student.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Performance Charts */}
        <div className="lg:col-span-2">
          {selectedStudentEmail ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800">Performance Report</h3>
                <span className="text-xs font-mono text-gray-500">
                  {selectedStudentEmail}
                </span>
              </div>
              
              <div className="p-2">
                 {/* This reuses your existing graph component */}
                 <Performance studentEmail={selectedStudentEmail} />
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl h-full flex flex-col items-center justify-center text-gray-400 min-h-[600px]">
              <Users size={48} className="mb-4 opacity-20" />
              <p className="font-medium">Select a student to view details</p>
              <p className="text-sm mt-2 opacity-60">Click any name on the left list</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};