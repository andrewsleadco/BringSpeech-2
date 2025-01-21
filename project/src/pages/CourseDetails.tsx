import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import type { Course, Lesson } from '@/types';
import { FileText, Video, Image as ImageIcon } from 'lucide-react';

export function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourseAndLessons() {
      try {
        const [courseResult, lessonsResult] = await Promise.all([
          supabase.from('courses').select('*').eq('id', id).single(),
          supabase.from('lessons').select('*').eq('course_id', id).order('order'),
        ]);

        if (courseResult.error) throw courseResult.error;
        if (lessonsResult.error) throw lessonsResult.error;

        setCourse(courseResult.data);
        setLessons(lessonsResult.data || []);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCourseAndLessons();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading course details...</div>;
  }

  if (!course) {
    return <div className="text-center">Course not found</div>;
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'image':
        return <ImageIcon className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
          alt={course.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">
              ${(course.price / 100).toFixed(2)}
            </span>
            <Button size="lg">Enroll Now</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Course Content</h2>
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              {getLessonIcon(lesson.type)}
              <div>
                <h3 className="font-semibold">{lesson.title}</h3>
                <p className="text-sm text-gray-600">{lesson.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}