import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Video, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900">
          Learn and Teach on CourseHub
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join our community of learners and instructors. Create, share, and master new skills through our interactive learning platform.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/courses">
            <Button size="lg">
              Browse Courses
            </Button>
          </Link>
          <Link to="/create-course">
            <Button variant="outline" size="lg">
              Become an Instructor
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center space-y-4 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Video className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">Video Lessons</h3>
          <p className="text-gray-600">
            High-quality video content with expert instructors
          </p>
        </div>
        <div className="text-center space-y-4 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">Rich Content</h3>
          <p className="text-gray-600">
            Access PDFs, images, and supplementary materials
          </p>
        </div>
        <div className="text-center space-y-4 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">Community</h3>
          <p className="text-gray-600">
            Learn together with a growing community
          </p>
        </div>
      </section>
    </div>
  );
}