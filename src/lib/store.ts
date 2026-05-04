import { User, Message, Exam, Result, Note, Attendance, Payment, TimetableEntry, PaymentConfig } from '../types';

const STORAGE_KEYS = {
  USERS: 'rupak_math_users',
  MESSAGES: 'rupak_math_messages',
  EXAMS: 'rupak_math_exams',
  RESULTS: 'rupak_math_results',
  NOTES: 'rupak_math_notes',
  ATTENDANCE: 'rupak_math_attendance',
  PAYMENTS: 'rupak_math_payments',
  TIMETABLE: 'rupak_math_timetable',
  CURRENT_USER: 'rupak_math_current_user',
  PAYMENT_CONFIG: 'rupak_math_payment_config',
  CHAT_GROUPS: 'rupak_math_chat_groups',
};

// ... existing defaults ...
const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  name: 'Rupak',
  username: 'admin',
  password: 'admin123',
  role: 'admin',
  paymentStatus: 'paid',
  isSubscriptionPaid: true,
  subscriptionPlan: 'lifetime'
};

const DEFAULT_STUDENTS: User[] = [
  {
    id: 'student-1',
    name: 'Rahul Sharma (Sr)',
    username: 'rahul',
    password: '1234',
    role: 'student',
    class: '10',
    batchType: 'Sr',
    whatsapp: '9123456780',
    paymentStatus: 'paid',
    dueAmount: 0,
    coachingDays: ['Mon', 'Wed', 'Fri'],
    coachingTime: '4:00 PM - 5:30 PM'
  },
  {
    id: 'student-2',
    name: 'Priya Roy (Jr)',
    username: 'priya',
    password: '1234',
    role: 'student',
    class: '9',
    batchType: 'Jr',
    whatsapp: '9123456781',
    paymentStatus: 'due',
    dueAmount: 450,
    coachingDays: ['Tue', 'Thu', 'Sat'],
    coachingTime: '5:00 PM - 6:30 PM'
  }
];

export const getStore = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStore = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const store = {
  getUsers: () => getStore<User[]>(STORAGE_KEYS.USERS, [DEFAULT_ADMIN, ...DEFAULT_STUDENTS]),
  setUsers: (users: User[]) => setStore(STORAGE_KEYS.USERS, users),
  
  getMessages: () => getStore<Message[]>(STORAGE_KEYS.MESSAGES, []),
  setMessages: (messages: Message[]) => setStore(STORAGE_KEYS.MESSAGES, messages),
  
  getExams: () => getStore<Exam[]>(STORAGE_KEYS.EXAMS, []),
  setExams: (exams: Exam[]) => setStore(STORAGE_KEYS.EXAMS, exams),
  
  getResults: () => getStore<Result[]>(STORAGE_KEYS.RESULTS, []),
  setResults: (results: Result[]) => setStore(STORAGE_KEYS.RESULTS, results),

  getNotes: () => getStore<Note[]>(STORAGE_KEYS.NOTES, []),
  setNotes: (notes: Note[]) => setStore(STORAGE_KEYS.NOTES, notes),

  getAttendance: () => getStore<Attendance[]>(STORAGE_KEYS.ATTENDANCE, []),
  setAttendance: (attendance: Attendance[]) => setStore(STORAGE_KEYS.ATTENDANCE, attendance),

  getPayments: () => getStore<Payment[]>(STORAGE_KEYS.PAYMENTS, []),
  setPayments: (payments: Payment[]) => setStore(STORAGE_KEYS.PAYMENTS, payments),

  getTimetable: () => getStore<TimetableEntry[]>(STORAGE_KEYS.TIMETABLE, []),
  setTimetable: (entries: TimetableEntry[]) => setStore(STORAGE_KEYS.TIMETABLE, entries),
  
  getCurrentUser: () => getStore<User | null>(STORAGE_KEYS.CURRENT_USER, null),
  setCurrentUser: (user: User | null) => setStore(STORAGE_KEYS.CURRENT_USER, user),
  
  getPaymentConfig: () => getStore<PaymentConfig>(STORAGE_KEYS.PAYMENT_CONFIG, {
    upiId: '9800820296@fam',
    qrCodeUrl: null
  }),
  setPaymentConfig: (config: PaymentConfig) => setStore(STORAGE_KEYS.PAYMENT_CONFIG, config),
  
  getChatGroups: () => getStore<string[]>(STORAGE_KEYS.CHAT_GROUPS, ['Global Chat', 'Infinity Class 5', 'Infinity Class 6', 'Infinity Class 7', 'Infinity Class 8', 'Infinity Class 9', 'Infinity Class 10', 'Infinity Class 11', 'Infinity Class 12']),
  setChatGroups: (groups: string[]) => setStore(STORAGE_KEYS.CHAT_GROUPS, groups),
  
  clearDemoData: () => {
    const admin = store.getUsers().find(u => u.role === 'admin' && u.isSubscriptionPaid);
    const remainingUsers = admin ? [admin] : [DEFAULT_ADMIN];
    store.setUsers(remainingUsers);
    store.setMessages([]);
    store.setExams([]);
    store.setResults([]);
    store.setNotes([]);
    store.setAttendance([]);
    store.setPayments([]);
    store.setTimetable([]);
  }
};
