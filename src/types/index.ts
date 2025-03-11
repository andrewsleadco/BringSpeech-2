export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_instructor: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor_id: string;
  created_at: string;
  thumbnail_url?: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content_url: string;
  order: number;
  type: 'video' | 'pdf' | 'image';
}