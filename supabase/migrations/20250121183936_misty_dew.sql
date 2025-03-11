/*
  # Initial Schema Setup for Course Platform

  1. Tables
    - profiles
      - Extends auth.users with additional user information
      - Stores instructor status and profile details
    - courses
      - Stores course information including title, description, and pricing
      - Links to instructor (profile)
    - lessons
      - Contains course content including videos, PDFs, and images
      - Ordered content within courses
    - enrollments
      - Tracks student enrollment in courses
      - Links users to courses they've purchased

  2. Security
    - RLS policies for each table
    - Secure access patterns for instructors and students
*/

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  is_instructor BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  instructor_id UUID REFERENCES profiles(id) NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'pdf', 'image')),
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Instructors can create courses"
  ON courses FOR INSERT
  WITH CHECK (
    auth.uid() = instructor_id AND 
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_instructor = true
    )
  );

CREATE POLICY "Instructors can update own courses"
  ON courses FOR UPDATE
  USING (auth.uid() = instructor_id);

-- Lessons policies
CREATE POLICY "Enrolled users can view lessons"
  ON lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE user_id = auth.uid() AND course_id = lessons.course_id
    ) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE instructor_id = auth.uid() AND id = lessons.course_id
    )
  );

CREATE POLICY "Instructors can manage course lessons"
  ON lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE instructor_id = auth.uid() AND id = lessons.course_id
    )
  );

-- Enrollments policies
CREATE POLICY "Users can view own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);