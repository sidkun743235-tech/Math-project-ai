export type Role = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: Role;
  class?: string;
  batchType?: 'Sr' | 'Jr'; // Senior/Junior batche logic
  whatsapp?: string;
  paymentStatus: 'due' | 'paid';
  lastPaymentDate?: string;
  coachingDays?: string[]; // e.g. ['Mon', 'Thu']
  coachingTime?: string; // e.g. '2pm'
  isSubscriptionPaid?: boolean;
  needsPasswordSetup?: boolean;
  subscriptionPlan?: 'monthly' | 'lifetime';
  dueAmount?: number;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderRole?: Role;
  classId: string; // 'global' or 'class-10-Sr', etc.
  timestamp: number;
}

export interface Question {
  id: string;
  text: string;
  image?: string;
  options: string[];
  optionImages?: string[];
  correctAnswerIndex: number;
}

export interface Exam {
  id: string;
  title: string;
  classId: string;
  duration: number; // in minutes
  questions: Question[];
  published: boolean;
  createdAt: number;
  expiresAt?: number; // 72 hours window
}

export interface Result {
  id: string;
  studentId: string;
  studentName: string;
  examId: string;
  examTitle: string;
  score: number;
  total: number;
  answers: number[];
  timestamp: number;
  isCulprit?: boolean; // Anti-cheat flag
}

export interface TimetableEntry {
  id: string;
  classId: string;
  batchType: 'Sr' | 'Jr';
  day: string;
  time: string;
  subject: string;
}

export interface Note {
  id: string;
  title: string;
  classId: string;
  content: string;
  type: 'text' | 'file';
  fileUrl?: string;
  createdAt: number;
}

export interface RecentActivity {
  id: string;
  type: 'exam' | 'payment' | 'student' | 'note';
  title: string;
  description: string;
  timestamp: number;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent';
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: string;
  status: 'pending' | 'completed';
}

export interface PaymentConfig {
  upiId: string;
  qrCodeUrl: string | null;
}
