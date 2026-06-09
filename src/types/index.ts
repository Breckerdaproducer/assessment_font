import { ReactNode } from "react";

export type Role = 'STUDENT' | 'LECTURER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  is_published: boolean;
  lecturerId: string;
  createdAt: string;
}

export interface Question {
  question_id: number;
  question_text: string;
  id: string;
  assessment_id: string;
  text: string;
  options: {
    question_text: ReactNode; id: string; label: string; text: string 
}[];
  correctOption?: number; // Only for lecturer views
}

export interface Attempt {
  id: string;
  assessment_id: string;
  student_id: string;
  score: number;
  total_questions: number;
  answers: Record<string, number>;
  createdAt: string;
  assessment?: Assessment;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
