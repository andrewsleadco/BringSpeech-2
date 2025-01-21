import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import type { Course } from '@/types';

export function Dashboard() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [createdCourses, setCreatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      if (!user) return;

      try {
        const [enrolledResult, createdResult] = await Promise.all([
          supabase
            .from('enrollments')
            .select('course_id, courses(*)')
            .eq('user_id', user.id),
          supabase
            .from('courses')
            .select('*')
            .eq('instructor_id', user.id),
        ]);

        if (enrolledResult.error) throw enrolledResult.error;
        if (createdResult.error) throw createdResult.error;

        setEnrolledCourses(enrolledResult.data?.map(e => e.courses) || []);
        setCreatedCourses(createdResult.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [user]);

  if (loading) {
    return <div className="text-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/create-course">
          <Button>Create New Course</Button>
        </Link>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Courses</h2>
        {enrolledCourses.length === 0 ? (
          <p className="text-gray-600">
            You haven't enrolled in any courses yet.{' '}
            <Link to="/courses" className="text-blue-600 hover:underline">
              Browse courses
            </Link>
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:scale-[1.02]">
                  <img
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                    <p className="text-gray-600 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {createdCourses.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Courses You Created</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:scale-[1.02]">
                  <img
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                    <p className="text-gray-600 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-blue-600 font-semibold">
                        ${(course.price / 100).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Manage Course →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}