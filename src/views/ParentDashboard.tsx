import React, { useEffect, useState } from 'react';
import { Performance } from './Performance';
import { User } from '../types';
import { supabase } from '../lib/supabaseClient';
import { Loader2, UserPlus, RefreshCw } from 'lucide-react';

interface ParentDashboardProps {
  user: User;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ user }) => {
  const [studentName, setStudentName] = useState<string>('');
  const [studentEmail, setStudentEmail] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchLinkedStudent = async (retryCount = 0) => {
      try {
        if (!user.id) return;
        
        // 1. Fetch Parent Profile
        const { data: parentProfile, error: parentError } = await supabase
          .from('profiles')
          .select('linked_student_email')
          .eq('id', user.id)
          .single();

        if (parentError) throw parentError;

        // CHECK: Did we find the email?
        if (parentProfile?.linked_student_email) {
          // YES - Proceed to find student name
          const email = parentProfile.linked_student_email;
          if (isMounted) setStudentEmail(email);

          const { data: studentProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('email', email)
            .single();

          if (isMounted) {
            setStudentName(studentProfile?.full_name || 'Unnamed Student');
            setPageLoading(false);
          }

        } else {
          // NO - The email is missing.
          // FIX: If this is the first try, wait 1 second and try again (Race Condition Fix)
          if (retryCount < 2) {
            console.log("Student email not found yet. Retrying in 1s...");
            setTimeout(() => {
              if (isMounted) fetchLinkedStudent(retryCount + 1);
            }, 1000); // Wait 1 second
          } else {
            // Give up after 2 retries
            if (isMounted) {
              setStudentName('No student linked');
              setPageLoading(false);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
        if (isMounted) {
          setStudentName('Error loading data');
          setPageLoading(false);
        }
      }
    };

    setPageLoading(true);
    fetchLinkedStudent();

    return () => { isMounted = false; };
  }, [user.id]);

  // LOADING STATE
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-2" />
          <p className="text-gray-500">Syncing profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-yellow-50 p-4 text-center border-b border-yellow-100">
        <p className="text-yellow-800 font-medium">
          Viewing as Parent: <span className="font-bold">{user.name}</span>
          <span className="mx-2 text-yellow-400">|</span> 
          Child: <span className="font-bold">{studentName}</span>
          {studentEmail && <span className="text-xs text-yellow-600 ml-2">({studentEmail})</span>}
        </p>
      </div>
      
      {studentEmail ? (
        <Performance studentEmail={studentEmail} />
      ) : (
        <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Student Linked</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            We couldn't find a linked student account.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <RefreshCw className="h-4 w-4 mr-2"/>
            Refresh Data
          </button>
        </div>
      )}
    </div>
  );
};