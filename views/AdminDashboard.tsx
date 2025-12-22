import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_LINE_DATA } from '../constants';
import { Button } from '../components/Button';
import { Users, FileText, Settings, Download } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-500">Manage students and track class progress.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline"><Download size={18} className="mr-2" /> Report</Button>
           <Button><Users size={18} className="mr-2" /> Add Student</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={20} className="text-indigo-600" /> Manage Students
            </h3>
            <ul className="space-y-3">
              {['Alex Student', 'Sam Smith', 'Jordan Lee', 'Casey West'].map((name, i) => (
                <li key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                      {name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-gray-700 font-medium">{name}</span>
                  </div>
                  <span className="text-xs text-gray-400">View</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-100">
               <Button variant="ghost" fullWidth className="text-sm">View All Students</Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings size={20} className="text-gray-600" /> Settings
            </h3>
            <div className="space-y-2">
              <Button variant="outline" fullWidth className="justify-start text-left">Customize Game Difficulty</Button>
              <Button variant="outline" fullWidth className="justify-start text-left">Notification Settings</Button>
            </div>
          </div>
        </div>

        {/* Center/Right Col: Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-gray-900">Class Performance Over Months</h3>
               <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                 <option>Last 6 Months</option>
                 <option>Last Year</option>
               </select>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_LINE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg bg-gradient-to-br from-indigo-600 to-purple-700">
              <h4 className="text-indigo-100 text-sm font-medium mb-1">Top Performing Skill</h4>
              <p className="text-3xl font-bold">Memory</p>
              <p className="text-indigo-200 text-xs mt-2">+12% vs last month</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <h4 className="text-gray-500 text-sm font-medium mb-1">Needs Attention</h4>
               <p className="text-3xl font-bold text-gray-800">Flexibility</p>
               <p className="text-red-500 text-xs mt-2">-5% vs last month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};