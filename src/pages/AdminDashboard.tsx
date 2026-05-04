import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CheckSquare, 
  Settings, 
  LogOut, 
  MoreVertical, 
  MessageCircle, 
  UserPlus, 
  FileText, 
  CreditCard, 
  Bell,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  MessageSquare,
  Calculator,
  BarChart3,
  Activity,
  Paperclip,
  Send,
  Download,
  Check,
  Edit2,
  Upload,
  Calendar,
  TrendingUp,
  Award,
  Users2,
  GitBranch,
  Timer,
  LayoutGrid,
  ChevronLeft,
  Key,
  User as UserIcon,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { store } from '@/lib/store';
import { User, Exam, Question, Result, Message, Note, Attendance, Payment, TimetableEntry, PaymentConfig } from '@/types';
import { toast } from 'sonner';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string | null>(null);
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<'Sr' | 'Jr' | null>(null);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<User | null>(null);
  const [selectedChatGroup, setSelectedChatGroup] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAction = (tab: string) => {
    const restrictedTabs = ['generate-paper', 'mcq-manager', 'add-student', 'receive', 'notes-admin'];
    if (!user.isSubscriptionPaid && restrictedTabs.includes(tab)) {
      toast.error('Subscription Required', {
        description: 'Please subscribe to unlock full administrative features.'
      });
      return;
    }
    setActiveTab(tab);
    setIsActionsOpen(false);
  };

  useEffect(() => {
    setUsers(store.getUsers());
    setExams(store.getExams());
    setResults(store.getResults());
    setMessages(store.getMessages());
    setNotes(store.getNotes());
    setAttendance(store.getAttendance());
    setPayments(store.getPayments());
    setTimetable(store.getTimetable());
  }, []);

  useEffect(() => {
    if (timetable.length === 0) return;
    const interval = setInterval(() => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentHour = now.getHours();
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

      timetable.forEach(entry => {
        if (entry.day.toLowerCase() === currentDay.toLowerCase()) {
          // Check if current hour matches entry time roughly
          if (entry.time.toLowerCase().includes(timeStr.split(':')[0].toLowerCase())) {
             toast('📅 Class Reminder', {
               description: `Class ${entry.classId} for ${entry.subject} is scheduled now.`,
               icon: <Timer className="w-4 h-4 text-indigo-400" />
             });
          }
        }
      });
    }, 300000); // Check every 5 mins to avoid spam
    return () => clearInterval(interval);
  }, [timetable]);

  const students = users.filter(u => u.role === 'student');
  const totalRevenue = users.filter(u => u.paymentStatus === 'paid').length * 500; // Mock fee

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Student Growth',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const handleAddStudent = (newStudent: Partial<User>) => {
    const student: User = {
      id: Date.now().toString(),
      name: newStudent.name || '',
      username: newStudent.username || '',
      password: newStudent.password || '1234',
      role: 'student',
      class: newStudent.class || '10',
      batchType: (newStudent.batchType as 'Sr' | 'Jr') || 'Jr',
      whatsapp: newStudent.whatsapp || '',
      paymentStatus: 'due',
      dueAmount: newStudent.dueAmount || 500,
      coachingDays: newStudent.coachingDays || [],
      coachingTime: newStudent.coachingTime || '',
    };
    const updated = [...users, student];
    store.setUsers(updated);
    setUsers(updated);
    toast.success('Student added successfully');
    setActiveTab('students');
  };

  const handlePromoteStudents = () => {
    if (!confirm('Are you sure you want to promote all students to the next class? Class 12 students will graduate and be removed.')) return;

    const promotedUsers = users.map(u => {
      if (u.role !== 'student' || !u.class) return u;
      const currentLabel = u.class; // e.g. "10", "10 (Sr)"
      const numericPart = parseInt(currentLabel);
      if (isNaN(numericPart)) return u;
      if (numericPart === 12) return null; // Graduate
      
      const newClass = (numericPart + 1).toString();
      return {
        ...u,
        class: newClass,
        batchType: 'Sr' as const, // Promoted batches are now Senior
      };
    }).filter(Boolean) as User[];

    setUsers(promotedUsers);
    store.setUsers(promotedUsers);
    toast.success('Students promoted successfully. Class 12 students graduated.');
  };

  const handleTogglePayment = (studentId: string) => {
    const updated = users.map(u => {
      if (u.id === studentId) {
        return { ...u, paymentStatus: (u.paymentStatus === 'paid' ? 'due' : 'paid') as 'paid' | 'due' };
      }
      return u;
    });
    store.setUsers(updated);
    setUsers(updated);
    toast.success('Payment status updated');
  };

  const sendWhatsApp = (phone: string, message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  const handleCreateExam = (exam: Exam) => {
    const updated = [...exams, exam];
    store.setExams(updated);
    setExams(updated);
    toast.success('Exam published successfully');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div id="admin-nav-logo-container" className="flex items-center gap-2 bg-slate-100 p-1.5 pr-3 rounded-2xl border border-slate-200">
            <Logo size="xs" className="border-2 border-blue-600/50 shadow-sm" />
            
            <Sheet open={isActionsOpen} onOpenChange={setIsActionsOpen}>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-white transition-colors">
                  <MoreVertical className="h-5 w-5 text-slate-600" />
                </Button>
              } />
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 border-none bg-slate-900 text-white">
                <SheetHeader className="p-6 bg-slate-950 border-b border-white/5">
                  <SheetTitle className="text-white flex items-center gap-3">
                    <Logo size="xs" />
                    <span className="font-black italic uppercase tracking-tighter">Admin Menu</span>
                  </SheetTitle>
                  <SheetDescription className="text-indigo-300 text-xs uppercase font-bold tracking-widest mt-1">Control Center</SheetDescription>
                </SheetHeader>
                
                <ScrollArea className="h-[calc(100vh-140px)] p-6">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Users2 size={12} /> Management
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-white/10" onClick={() => handleAction('students')}>
                          <Users size={18} /> <span className="font-bold">Student Database</span>
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-white/10" onClick={() => handleAction('add-student')}>
                          <UserPlus size={18} /> <span className="font-bold">Add New Student</span>
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-white/10" onClick={() => handleAction('attendance')}>
                          <Clock size={18} /> <span className="font-bold">Post Attendance</span>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <BookOpen size={12} /> Academic
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-white/10" onClick={() => handleAction('exams')}>
                          <FileText size={18} /> <span className="font-bold">Exams & Papers</span>
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-white/10" onClick={() => handleAction('notes')}>
                          <BookOpen size={18} /> <span className="font-bold">Study Notes</span>
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-white/10" onClick={() => handleAction('results')}>
                          <Trophy size={18} /> <span className="font-bold">View Results</span>
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-white/10" onClick={() => handleAction('timetable')}>
                          <Calendar size={18} /> <span className="font-bold">Timetable</span>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Calculator size={12} /> Finance
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-white/10" onClick={() => handleAction('receive')}>
                          <CreditCard size={18} /> <span className="font-bold">Receive Payment</span>
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-white/10" onClick={() => handleAction('due-list')}>
                          <Bell size={18} /> <span className="font-bold">Due List</span>
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-white/10" onClick={() => handleAction('growth')}>
                          <BarChart3 size={18} /> <span className="font-bold">Growth Stats</span>
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={onLogout}>
                        <LogOut size={18} /> <span className="font-bold uppercase tracking-widest text-[10px]">Logout</span>
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight ml-2 uppercase">{activeTab.replace('-', ' ')}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onClick={() => setActiveTab('overview')} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all", activeTab === 'overview' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}>Status</button>
            <button onClick={() => setActiveTab('students')} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all", activeTab === 'students' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}>Users</button>
          </div>
          <Button variant="ghost" size="icon" className="relative" onClick={() => setActiveTab('messages')}>
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>
          <div className="h-8 w-px bg-slate-200 mx-1"></div>
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border-2 border-indigo-600" onClick={() => setActiveTab('settings')}>
            <Avatar className="h-full w-full">
              <AvatarFallback className="bg-indigo-600 text-white font-bold">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div onClick={() => setActiveTab('students')} className="cursor-pointer">
                <StatCard title="Total Students" value={students.length} icon={<Users />} trend="+12 this month" />
              </div>
              <div onClick={() => setActiveTab('receive')} className="cursor-pointer">
                <StatCard title="Revenue" value={`₹${totalRevenue}`} icon={<CreditCard />} trend="Goal: ₹1,00,000" />
              </div>
              <div onClick={() => setActiveTab('exams')} className="cursor-pointer">
                <StatCard title="Active Exams" value={exams.length} icon={<FileText />} trend="Current session" />
              </div>
              <div className="cursor-pointer">
                <StatCard title="Submissions" value={results.length} icon={<CheckCircle2 />} trend="Last 24h" />
              </div>
            </div>                  {/* Chart Replacement: Theoretical Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 shadow-xl border-white/40 bg-white/80 backdrop-blur-md overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
                        <div>
                          <CardTitle className="text-xl font-black tracking-tight text-slate-900 uppercase italic">Enrollment Distribution</CardTitle>
                          <CardDescription>Academy statistics and student engagement metrics</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                          {user.isSubscriptionPaid && (
                            <Button variant="outline" size="sm" onClick={handlePromoteStudents} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                              <TrendingUp className="w-4 h-4 mr-2" /> Promote Session
                            </Button>
                          )}
                          <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                            <FileText className="w-5 h-5" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['5', '6', '7', '8'].map(c => (
                              <div key={c} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Class {c}</p>
                                <p className="text-2xl font-black text-blue-600">{students.filter(s => s.class === c).length} <span className="text-[10px] text-slate-400 ml-1">Students</span></p>
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['9', '10', '11', '12'].map(c => (
                              <div key={c} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Class {c}</p>
                                <p className="text-2xl font-black text-indigo-600">{students.filter(s => s.class === c).length} <span className="text-[10px] text-slate-400 ml-1">Students</span></p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="p-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 mt-4">
                            <h4 className="font-black text-slate-800 uppercase italic mb-3">Academic Summary</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              Currently managing <span className="font-bold text-blue-600">{students.length} active students</span> across 8 grades. 
                              The student-teacher ratio remains optimized for personalized attention. 
                              Our digital ecosystem continues to drive higher participation in MCQ exams, with 
                              <span className="font-bold text-indigo-600"> Class 10</span> showing the highest engagement this session. 
                              All materials and recordings are up-to-date for the current curriculum.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      <Card className="shadow-xl border-white/40 bg-white/80 backdrop-blur-md overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between bg-slate-900 text-white py-4">
                          <div>
                            <CardTitle className="text-lg font-black tracking-tight uppercase">Recent Activities</CardTitle>
                          </div>
                          <Activity className="w-4 h-4 text-blue-400" />
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="divide-y divide-slate-100">
                            {[
                              { id: '1', type: 'student', title: 'New Admission', desc: 'Rahul joined Class 10', time: '2h ago', color: 'blue' },
                              { id: '2', type: 'payment', title: 'Payment Received', desc: 'Priya paid Class 8 fees', time: '4h ago', color: 'emerald' },
                              { id: '3', type: 'exam', title: 'Exam Published', desc: 'Unit Test 2 for Class 12', time: '1d ago', color: 'purple' },
                              { id: '4', type: 'note', title: 'Note Shared', desc: 'Math Notes for Class 9', time: '2d ago', color: 'orange' },
                            ].map(activity => (
                              <div key={activity.id} className="flex gap-4 items-start p-4 hover:bg-slate-50 transition-colors group">
                                <div className={`p-2.5 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${
                                  activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                  activity.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                                  activity.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                  'bg-orange-100 text-orange-600'
                                }`}>
                                  {activity.type === 'student' ? <UserPlus className="w-4 h-4" /> :
                                   activity.type === 'payment' ? <CreditCard className="w-4 h-4" /> :
                                   activity.type === 'exam' ? <FileText className="w-4 h-4" /> :
                                   <BookOpen className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <p className="text-sm font-black text-slate-900">{activity.title}</p>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.time}</span>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-0.5">{activity.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-xl border-white/40 bg-white/80 backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-xl font-black tracking-tight text-slate-900">Recent Results</CardTitle>
                            <CardDescription>Latest exam submissions</CardDescription>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setActiveTab('results')} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">View All</Button>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {results.slice(0, 3).map(res => (
                              <div key={res.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                <div>
                                  <p className="text-sm font-bold text-slate-800">{res.studentName}</p>
                                  <p className="text-[10px] text-slate-500">{res.examTitle}</p>
                                </div>
                                <Badge className={res.score / res.total >= 0.8 ? 'bg-emerald-500' : res.score / res.total >= 0.4 ? 'bg-blue-500' : 'bg-red-500'}>
                                  {res.score}/{res.total}
                                </Badge>
                              </div>
                            ))}
                            {results.length === 0 && <p className="text-center text-slate-400 py-4 text-sm">No results yet</p>}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
                  <div className="flex flex-wrap flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] text-white shadow-2xl gap-5 sm:gap-6 max-w-full overflow-hidden">
                    <div className="w-full sm:flex-1">
                      <h2 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase italic leading-none">Student List</h2>
                      <p className="text-slate-400 text-[10px] sm:text-sm font-bold uppercase tracking-widest mt-2">Session 2024-25 • {students.length} Scholars Enrolled</p>
                    </div>
                    <div className="w-full sm:w-auto">
                      <Button onClick={() => setActiveTab('add-student')} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 rounded-2xl h-12 sm:h-14 px-6 sm:px-8 text-xs sm:text-sm font-black uppercase tracking-wider italic">
                        <UserPlus className="mr-2 h-5 w-5" /> New Enrolment
                      </Button>
                    </div>
                  </div>

                  {/* Class Distribution Grid - 4 columns on mobile for readable touch targets */}
                  <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-4 auto-rows-fr w-full box-border">
                    {['5', '6', '7', '8', '9', '10', '11', '12'].map(cls => (
                      <button
                        key={cls}
                        onClick={() => setSelectedClassFilter(selectedClassFilter === cls ? null : cls)}
                        className={`p-2.5 sm:p-5 rounded-xl sm:rounded-[1.5rem] border-2 transition-all text-left flex flex-col justify-between group h-full active:scale-95 ${
                          selectedClassFilter === cls 
                          ? 'border-blue-600 bg-blue-50 shadow-xl shadow-blue-100' 
                          : 'border-white bg-white hover:border-blue-100 hover:shadow-lg'
                        }`}
                      >
                        <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-1 sm:mb-2 ${selectedClassFilter === cls ? 'text-blue-600' : 'text-slate-400'}`}>Class</p>
                        <div className="flex items-end justify-between gap-1">
                          <p className={`text-lg sm:text-3xl font-black leading-none ${selectedClassFilter === cls ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-600'}`}>{cls}</p>
                          <div className={`h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full ${selectedClassFilter === cls ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-sm sm:text-xl font-black tracking-tight text-slate-900 uppercase italic">
                        {selectedClassFilter ? `Class ${selectedClassFilter} Scholars` : 'All Scholars'}
                      </h3>
                      <div className="flex gap-1.5">
                        <Button 
                          variant={selectedBatchFilter === 'Sr' ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setSelectedBatchFilter(selectedBatchFilter === 'Sr' ? null : 'Sr')}
                          className="h-8 rounded-xl text-[9px] font-black uppercase tracking-widest px-3"
                        >Sr</Button>
                        <Button 
                          variant={selectedBatchFilter === 'Jr' ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setSelectedBatchFilter(selectedBatchFilter === 'Jr' ? null : 'Jr')}
                          className="h-8 rounded-xl text-[9px] font-black uppercase tracking-widest px-3"
                        >Jr</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                      {/* Responsive Card Layout for Mobile */}
                      {students
                        .filter(s => !selectedClassFilter || s.class === selectedClassFilter)
                        .filter(s => !selectedBatchFilter || s.batchType === selectedBatchFilter)
                        .map(student => (
                          <div key={student.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm sm:hidden flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border-2 border-slate-50">
                                  <AvatarFallback className="bg-blue-50 text-blue-600 font-black text-lg">{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-black text-slate-900 text-base leading-tight italic">{student.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Grade {student.class} • {student.batchType} Batch</p>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger className="h-10 w-10 bg-slate-50 flex items-center justify-center rounded-2xl hover:bg-slate-100 outline-none">
                                  <MoreVertical className="h-4 w-4 text-slate-600" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-1 rounded-2xl shadow-2xl border-slate-100">
                                  <DropdownMenuItem className="rounded-lg py-2.5 px-3 gap-2" onClick={() => setSelectedStudentForProfile(student)}>
                                    <UserIcon className="w-4 h-4 text-slate-400" /> <span className="font-bold text-xs uppercase italic">Full Biography</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="rounded-lg py-2.5 px-3 gap-2" onClick={() => {
                                    const newPass = prompt(`Enter new password for ${student.name}:`, student.password);
                                    if (newPass && newPass.length >= 4) {
                                      const updatedUsers = users.map(u => u.id === student.id ? { ...u, password: newPass } : u);
                                      store.setUsers(updatedUsers);
                                      setUsers(updatedUsers);
                                      toast.success('Password updated');
                                    } else if (newPass) {
                                      toast.error('Password must be at least 4 characters');
                                    }
                                  }}>
                                    <Key className="w-4 h-4 text-slate-400" /> <span className="font-bold text-xs uppercase italic">Set Password</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="rounded-lg py-2.5 px-3 gap-2" onClick={() => {
                                    const text = `*INFINITY BONGAON*\n\nHello *${student.name}*,\nYour login details are below:\n\n*Username:* ${student.username}\n*Password:* ${student.password}\n\nLogin here: ${window.location.origin}`;
                                    sendWhatsApp(student.whatsapp || '', text);
                                  }}>
                                    <MessageCircle className="w-4 h-4 text-emerald-500" /> <span className="font-bold text-xs uppercase italic text-emerald-600">Share via WhatsApp</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="rounded-lg py-2.5 px-3 gap-2" onClick={() => handleTogglePayment(student.id)}>
                                    <CreditCard className="w-4 h-4 text-slate-400" /> <span className="font-bold text-xs uppercase italic">{student.paymentStatus === 'paid' ? 'Mark as Due' : 'Mark as Paid'}</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Financials</p>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-black text-slate-900 italic">₹{student.dueAmount}</p>
                                  <Badge className={`text-[8px] h-4 leading-none uppercase ${student.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-red-500'}`}>{student.paymentStatus}</Badge>
                                </div>
                              </div>
                              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Class Timing</p>
                                <p className="text-[10px] font-bold text-blue-600 truncate">{student.coachingTime || 'Not set'}</p>
                              </div>
                            </div>
                          </div>
                      ))}

                    {/* Desktop Table View */}
                    <Card className="hidden sm:block shadow-2xl border-none bg-white overflow-hidden rounded-[2rem]">
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader className="bg-slate-50">
                            <TableRow className="hover:bg-transparent border-slate-200">
                              <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-widest pl-6 py-4">Student Name</TableHead>
                              <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-widest py-4">Schedule</TableHead>
                              <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-widest py-4 text-center">Financials</TableHead>
                              <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-widest py-4 text-center">Fees</TableHead>
                              <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-widest text-right pr-6 py-4">Direct Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {students
                              .filter(s => !selectedClassFilter || s.class === selectedClassFilter)
                              .filter(s => !selectedBatchFilter || s.batchType === selectedBatchFilter)
                              .map(student => (
                              <TableRow key={student.id} className="border-slate-50 hover:bg-slate-50/10 transition-colors">
                                <TableCell className="pl-6 py-4">
                                  <button onClick={() => setSelectedStudentForProfile(student)} className="flex items-center gap-3 text-left group">
                                    <Avatar className="h-10 w-10 border-2 border-slate-100 group-hover:border-blue-200 transition-colors">
                                      <AvatarFallback className="bg-blue-50 text-blue-600 font-black text-sm">{student.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors flex items-center gap-2 italic">{student.name}</p>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Class {student.class} • {student.batchType} Batch</p>
                                    </div>
                                  </button>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col gap-1 py-1">
                                    <div className="flex flex-wrap gap-1">
                                      {student.coachingDays?.map(d => (
                                        <span key={d} className="text-[10px] font-black text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md uppercase border border-slate-200/50">{d.slice(0, 3)}</span>
                                      ))}
                                    </div>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tight">{student.coachingTime || 'Time not set'}</p>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center italic">
                                  <p className="text-sm font-black text-slate-900 leading-tight">₹{student.dueAmount || 0}</p>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge className={`rounded-full px-3 text-[10px] font-black uppercase ${student.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                    {student.paymentStatus}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 flex items-center justify-center outline-none">
                                      <MoreVertical className="h-4 w-4 text-slate-400" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-1 rounded-xl shadow-2xl border-slate-100">
                                      <DropdownMenuItem className="rounded-lg py-2.5 px-3 gap-2" onClick={() => setSelectedStudentForProfile(student)}>
                                        <UserIcon className="w-4 h-4 text-slate-400" /> <span className="font-bold text-xs uppercase italic">Full Biography</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="rounded-lg py-2.5 px-3 gap-2" onClick={() => {
                                        const newPass = prompt(`Enter new password for ${student.name}:`, student.password);
                                        if (newPass && newPass.length >= 4) {
                                          const updatedUsers = users.map(u => u.id === student.id ? { ...u, password: newPass } : u);
                                          store.setUsers(updatedUsers);
                                          setUsers(updatedUsers);
                                          toast.success('Password updated');
                                        } else if (newPass) {
                                          toast.error('Password must be at least 4 characters');
                                        }
                                      }}>
                                        <Key className="w-4 h-4 text-slate-400" /> <span className="font-bold text-xs uppercase italic">Set Password</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="rounded-lg py-2.5 px-3 gap-2" onClick={() => {
                                        const text = `*INFINITY BONGAON*\n\nHello *${student.name}*,\nYour login details are below:\n\n*Username:* ${student.username}\n*Password:* ${student.password}\n\nLogin here: ${window.location.origin}`;
                                        sendWhatsApp(student.whatsapp || '', text);
                                      }}>
                                        <MessageCircle className="w-4 h-4 text-emerald-500" /> <span className="font-bold text-xs uppercase italic text-emerald-600">Share via WhatsApp</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="rounded-lg py-2.5 px-3 gap-2" onClick={() => handleTogglePayment(student.id)}>
                                        <CreditCard className="w-4 h-4 text-slate-400" /> <span className="font-bold text-xs uppercase italic">{student.paymentStatus === 'paid' ? 'Mark as Due' : 'Mark as Paid'}</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'add-student' && (
                <AddStudentForm user={user} users={users} setUsers={setUsers} onAdd={handleAddStudent} onBack={() => setActiveTab('students')} students={students} />
              )}

              {activeTab === 'generate-paper' && (
                <GeneratePaperForm onCreate={handleCreateExam} onBack={() => setActiveTab('exams')} />
              )}

              {activeTab === 'chats' && <AdminChatSection initialGroup={selectedChatGroup} user={user} />}

              {activeTab === 'due-list' && (
                <DueListSection students={students} onSelectStudent={setSelectedStudentForProfile} onRemind={(phone) => sendWhatsApp(phone, "Dear Student, this is a reminder regarding your pending fees at Rupak Math Academy. Please clear it at the earliest.")} />
              )}

              {activeTab === 'receive' && (
                <ReceivePaymentSection 
                  students={students} 
                  onTogglePayment={handleTogglePayment} 
                  onWhatsApp={(phone) => sendWhatsApp(phone, "Hello! Your payment has been received at Rupak Math Academy. Thank you!")}
                />
              )}

              {activeTab === 'notes' && (
                <NotesSection user={user} notes={notes} onAdd={(n) => {
                  const updated = [...notes, n];
                  store.setNotes(updated);
                  setNotes(updated);
                }} onUpdate={(updated) => {
                  store.setNotes(updated);
                  setNotes(updated);
                }} />
              )}

              {activeTab === 'exams' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Question Papers</h2>
                    <Button onClick={() => setActiveTab('generate-paper')}>
                      <Plus className="mr-2 h-4 w-4" /> Create New
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exams.map(exam => (
                      <Card key={exam.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <Badge>Class {exam.classId}</Badge>
                            <Badge variant={exam.published ? 'default' : 'outline'}>
                              {exam.published ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <CardTitle className="mt-2">{exam.title}</CardTitle>
                          <CardDescription>{exam.questions.length} Questions • {exam.duration} mins</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button size="sm" variant={exam.published ? 'destructive' : 'default'}>
                            {exam.published ? 'Unpublish' : 'Publish'}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    {exams.length === 0 && <p className="col-span-full text-center text-slate-400 py-20">No question papers created yet</p>}
                  </div>
                </div>
              )}
              {activeTab === 'mcq-manager' && (
                <MCQManagerSection exams={exams} onUpdate={(updatedExams) => {
                  store.setExams(updatedExams);
                  setExams(updatedExams);
                }} />
              )}

              {activeTab === 'results' && (
                <ResultsSection 
                  results={results} 
                  exams={exams} 
                  students={students} 
                  onUpdateExam={(exam) => {
                    const updated = exams.map(e => e.id === exam.id ? exam : e);
                    setExams(updated);
                    store.setExams(updated);
                    toast.success(exam.resultsPublished ? 'Results published' : 'Results hidden');
                  }}
                />
              )}

              {activeTab === 'attendance' && (
                <AttendanceSection students={students} attendance={attendance} onUpdate={(updatedAttendance) => {
                  store.setAttendance(updatedAttendance);
                  setAttendance(updatedAttendance);
                  toast.success('Attendance updated');
                }} />
              )}

              {activeTab === 'growth' && (
                <GrowthSection students={students} payments={payments} />
              )}

              {activeTab === 'timetable' && (
                <TimetableSection 
                  timetable={timetable} 
                  onUpdate={(updated) => {
                    store.setTimetable(updated);
                    setTimetable(updated);
                  }} 
                />
              )}

              {activeTab === 'settings' && (
                <SettingsSection user={user} students={students} onUpdateUser={(updatedUser: User) => {
                  const allUsers = store.getUsers();
                  const updatedUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
                  store.setUsers(updatedUsers);
                  setUsers(updatedUsers);
                  toast.success('Settings updated');
                }} />
              )}
      </main>

        {selectedStudentForProfile && (
        <Dialog open={!!selectedStudentForProfile} onOpenChange={() => setSelectedStudentForProfile(null)}>
          <DialogContent className="max-w-md bg-white p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
            <div className={`h-24 w-full ${selectedStudentForProfile.batchType === 'Sr' ? 'bg-amber-500' : 'bg-blue-600'} relative`}>
              <div className="absolute -bottom-10 left-8">
                <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
                  <AvatarFallback className={`${selectedStudentForProfile.batchType === 'Sr' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'} font-black text-2xl`}>
                    {selectedStudentForProfile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="p-8 pt-12 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">{selectedStudentForProfile.name}</h2>
                <div className="flex gap-2 mt-1">
                  <Badge className={selectedStudentForProfile.batchType === 'Sr' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}>
                    {selectedStudentForProfile.batchType} Batch
                  </Badge>
                  <Badge variant="outline">Class {selectedStudentForProfile.class}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Contact</p>
                  <p className="text-xs font-bold text-slate-800 tabular-nums">{selectedStudentForProfile.whatsapp}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Balance</p>
                  <p className="text-sm font-black text-red-600 italic tracking-tighter">₹{selectedStudentForProfile.dueAmount || 0}</p>
                </div>
              </div>

              <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Weekly Coaching Plan</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedStudentForProfile.coachingDays?.map(day => (
                    <span key={day} className="px-3 py-1 bg-white rounded-lg text-xs font-bold border border-indigo-200 text-indigo-700 shadow-sm">{day}</span>
                  ))}
                  {(!selectedStudentForProfile.coachingDays || selectedStudentForProfile.coachingDays.length === 0) && <p className="text-xs text-slate-400">Schedule not allocated</p>}
                </div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                  <Timer className="w-4 h-4" />
                  <span>{selectedStudentForProfile.coachingTime || 'Time not set'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-slate-900 text-white h-11 rounded-xl font-bold text-xs uppercase tracking-widest" onClick={() => setSelectedStudentForProfile(null)}>Close Profile</button>
                <button 
                  className="h-11 w-11 rounded-xl p-0 border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors" 
                  onClick={() => selectedStudentForProfile.whatsapp && sendWhatsApp(selectedStudentForProfile.whatsapp, `Hello ${selectedStudentForProfile.name}, this is your schedule update...`)}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Mobile Bar Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-white/10 px-6 py-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'overview' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest leading-none">Dash</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('students')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'students' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <Users className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest leading-none">Scholars</span>
        </button>

        <div className="relative -mt-8">
          <button 
            onClick={() => setIsActionsOpen(true)}
            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-600/30 border-4 border-slate-900 active:scale-90 transition-transform"
          >
            <Plus className="w-7 h-7 text-white" />
          </button>
        </div>

        <button 
          onClick={() => setActiveTab('chats')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'chats' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest leading-none">Chat</span>
        </button>

        <button 
          onClick={() => setIsActionsOpen(true)}
          className="flex flex-col items-center justify-center gap-1 transition-all text-slate-400"
        >
          <MoreVertical className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest leading-none">More</span>
        </button>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string | number, icon: React.ReactNode, trend: string }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow bg-white rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{title}</CardTitle>
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-[10px] text-green-600 mt-1 font-medium flex items-center gap-1 uppercase">
          <TrendingUp className="w-3 h-3" /> {trend}
        </p>
      </CardContent>
    </Card>
  );
}

function SettingsSection({ user, students, onUpdateUser }: { user: User, students: User[], onUpdateUser: (u: User) => void }) {
  const [newPassword, setNewPassword] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [payConfig, setPayConfig] = useState<PaymentConfig>(store.getPaymentConfig());

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }
    onUpdateUser({ ...user, password: newPassword });
    setNewPassword('');
  };

  const handleUpdatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    store.setPaymentConfig(payConfig);
    toast.success('Payment settings updated');
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPayConfig({ ...payConfig, qrCodeUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <Card className="border-none shadow-xl overflow-hidden">
          <div className="h-2 bg-slate-900" />
          <CardHeader>
            <CardTitle className="text-xl font-black uppercase italic tracking-tight">System Configuration</CardTitle>
            <CardDescription>Update administrative settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400">Admin Authentication</Label>
                <div className="flex gap-2">
                  <Input type="password" placeholder="New login password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="h-11 shadow-sm" />
                  <Button type="submit" className="bg-slate-900 h-11 px-6">Update</Button>
                </div>
              </div>
            </form>

            <form onSubmit={handleUpdatePayment} className="space-y-4 pt-6 border-t border-slate-100">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Student Fee Integration</Label>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-500 italic">Your Personal UPI ID (Students will pay here)</Label>
                  <Input placeholder="e.g. yourname@upi" value={payConfig.upiId} onChange={e => setPayConfig({...payConfig, upiId: e.target.value})} className="h-11 border-indigo-100" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-500 italic">Your Student Payment QR</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-indigo-50/30 border-2 border-dashed border-indigo-200 rounded-2xl flex items-center justify-center overflow-hidden group">
                      {payConfig.qrCodeUrl ? (
                        <img src={payConfig.qrCodeUrl} alt="QR Preview" className="w-full h-full object-contain" />
                      ) : (
                        <Upload className="w-6 h-6 text-indigo-300" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input type="file" accept="image/*" onChange={handleQrUpload} className="hidden" id="qr-upload" />
                      <Label htmlFor="qr-upload" className="cursor-pointer">
                        <div className="bg-white border border-indigo-100 hover:bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase italic text-center transition-all shadow-sm">
                          Upload QR
                        </div>
                      </Label>
                      <p className="text-[8px] text-slate-400 font-bold uppercase">Students will scan this to pay you</p>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-indigo-600 h-11 font-black uppercase italic tracking-tight shadow-lg shadow-indigo-100">Save Payment Profile</Button>
              </div>
            </form>

            <div className="pt-6 border-t border-slate-100 space-y-4">
              <Label className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Admin Account Subscription</Label>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-amber-900 uppercase italic">Premium License</p>
                    <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tight">Required for unlimited students & groups</p>
                  </div>
                  <Badge className="bg-amber-500 text-white border-none text-[8px] uppercase">
                    {user.isSubscriptionPaid ? 'Active' : 'Payment Required'}
                  </Badge>
                </div>
                
                {!user.isSubscriptionPaid && (
                  <>
                    <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Subscription Amount</p>
                        <p className="text-xl font-black text-amber-600 italic">₹4,999</p>
                      </div>
                      <div className="pt-2 border-t border-slate-50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pay To UPI ID:</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-slate-800 tabular-nums">9800820296@fam</p>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                            navigator.clipboard.writeText('9800820296@fam');
                            toast.success('Admin UPI Copied');
                          }}>
                            <Download className="w-3 h-3 text-amber-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white/50 rounded-xl border border-amber-100">
                      <p className="text-[9px] text-amber-600 font-bold leading-tight flex items-center gap-2 italic">
                         <Clock className="w-3 h-3 flex-shrink-0" /> After paying ₹4,999, send the screenshot/receipt to 9800820296 for activation. No QR code is required for this payment.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl overflow-hidden h-fit">
        <div className="h-2 bg-blue-600" />
        <CardHeader>
          <CardTitle className="text-xl font-black uppercase italic tracking-tight">Student Credentials</CardTitle>
          <CardDescription>View and manage portal access for individual scholars</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Search & Select Scholar</Label>
              <Select onValueChange={(id) => setSelectedStudent(students.find(s => s.id === id) || null)}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-200">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {students.sort((a, b) => a.name.localeCompare(b.name)).map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} (Class {s.class})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedStudent ? (
              <div className="p-4 sm:p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-blue-600 text-white font-black">{selectedStudent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-black text-slate-900 text-sm leading-none uppercase italic">{selectedStudent.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Class {selectedStudent.class} • {selectedStudent.batchType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Username</p>
                    <p className="text-sm font-black text-slate-900 italic break-all">{selectedStudent.username}</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Login Password</p>
                      <button 
                        onClick={() => {
                          const newPass = prompt(`Setting new password for ${selectedStudent.name}:`, selectedStudent.password);
                          if (newPass && newPass.length >= 4) {
                            const updatedUsers = students.map(u => u.id === selectedStudent.id ? { ...u, password: newPass } : u);
                            store.setUsers(updatedUsers);
                            onUpdateUser({ ...user }); // Force state refresh in parent indirectly via this callback if needed or rely on store
                            setSelectedStudent({ ...selectedStudent, password: newPass });
                            toast.success('Password updated');
                          }
                        }}
                        className="text-[9px] font-black text-blue-600 uppercase hover:underline"
                      >
                        Change
                      </button>
                    </div>
                    <p className="text-sm font-black text-indigo-600 italic tracking-tighter">{selectedStudent.password}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-2xl font-black uppercase tracking-widest italic shadow-lg shadow-emerald-600/20" 
                    onClick={() => {
                      const text = `*INFINITY BONGAON*\n\nHello *${selectedStudent.name}*,\nYour login details are below:\n\n*Username:* ${selectedStudent.username}\n*Password:* ${selectedStudent.password}\n\nLogin here: ${window.location.origin}`;
                      window.open(`https://wa.me/${selectedStudent.whatsapp}?text=${encodeURIComponent(text)}`);
                    }}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" /> Share via WhatsApp
                  </Button>
                  <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Credentials will be sent to +${selectedStudent.whatsapp}</p>
                </div>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <Key className="w-6 h-6 text-slate-300" />
                </div>
                <div className="px-6">
                  <p className="text-xs font-black text-slate-600 uppercase italic">No Scholar Selected</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">Select a student from the dropdown above to manage their portal credentials</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SidebarItem() { return null; }

function AppGridItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-center group cursor-pointer"
    >
      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-2 mx-auto group-hover:scale-110 group-hover:bg-blue-600 transition-all">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{label}</p>
    </button>
  );
}

function AddStudentForm({ user, users, setUsers, onAdd, onBack, students }: { user: User, users: User[], setUsers: (u: User[]) => void, onAdd: (s: Partial<User>) => void, onBack: () => void, students: User[] }) {
  const [formData, setFormData] = useState<Partial<User>>({ 
    name: '', 
    username: '', 
    password: '1234', 
    class: '10', 
    whatsapp: '',
    batchType: 'Jr',
    coachingDays: [] as string[],
    coachingTime: '',
    dueAmount: 500
  });
  const [selectedClass, setSelectedClass] = useState('10');

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ 
      name: '', username: '', password: '1234', class: selectedClass, whatsapp: '', 
      batchType: 'Jr', coachingDays: [], coachingTime: '', dueAmount: 500 
    });
  };

  const filteredStudents = students.filter(s => s.class === selectedClass);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-2xl border-none bg-white overflow-hidden">
        <div className="h-2 bg-blue-600" />
        <CardHeader>
          <CardTitle className="text-xl font-black tracking-tight uppercase italic">New Student Enrolment</CardTitle>
          <CardDescription>Register a student and assign coaching session</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-[10px] uppercase text-slate-400">Student Identity</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-[10px] uppercase text-slate-400">Grade / Class</Label>
                <Select value={formData.class} onValueChange={v => setFormData({...formData, class: v})}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['5', '6', '7', '8', '9', '10', '11', '12'].map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-[10px] uppercase text-slate-400">Batch Type</Label>
                <Select value={formData.batchType} onValueChange={v => setFormData({...formData, batchType: v})}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sr">Senior (Sr) Batch</SelectItem>
                    <SelectItem value="Jr">Junior (Jr) Batch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-[10px] uppercase text-slate-400">Due Amount (₹)</Label>
                <Input type="number" value={formData.dueAmount} onChange={e => setFormData({...formData, dueAmount: parseInt(e.target.value)})} required className="h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-[10px] uppercase text-slate-400">WhatsApp Connectivity</Label>
              <Input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} placeholder="WhatsApp Number" required className="h-11" />
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Label className="font-black text-[10px] uppercase text-indigo-600 tracking-widest">Coaching Schedule</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const updated = formData.coachingDays.includes(day)
                        ? formData.coachingDays.filter(d => d !== day)
                        : [...formData.coachingDays, day];
                      setFormData({ ...formData, coachingDays: updated });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      formData.coachingDays.includes(day) 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="space-y-2 mt-3">
                <Label className="font-bold text-[10px] uppercase text-slate-400">Daily Class Time</Label>
                <Input value={formData.coachingTime} onChange={e => setFormData({...formData, coachingTime: e.target.value})} placeholder="e.g. 4:00 PM - 5:30 PM" className="h-10 bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
              <div className="space-y-2">
                <Label className="font-bold text-[10px] uppercase text-slate-400">System Username</Label>
                <Input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="username" required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-[10px] uppercase text-slate-400">Login Password</Label>
                <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required className="h-11" />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-slate-900 h-12 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all">Submit Enrolment</Button>
              <Button type="button" variant="outline" onClick={onBack} className="h-12 px-6 rounded-xl text-xs font-bold uppercase">Back</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>View Students</CardTitle>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['5', '6', '7', '8', '9', '10', '11', '12'].map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">
                      {user.isSubscriptionPaid ? (
                        <div className="flex items-center gap-2 group">
                          <span>{s.name}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                            const newName = prompt('Enter new name:', s.name);
                            if (newName) {
                              const updated = users.map(u => u.id === s.id ? { ...u, name: newName } : u);
                              setUsers(updated);
                              store.setUsers(updated);
                              toast.success('Name updated');
                            }
                          }}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        s.name
                      )}
                    </TableCell>
                    <TableCell>
                      {user.isSubscriptionPaid ? (
                        <div className="flex items-center gap-2 group">
                          <span>{s.whatsapp}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                            const newNum = prompt('Enter new WhatsApp:', s.whatsapp);
                            if (newNum) {
                              const updated = users.map(u => u.id === s.id ? { ...u, whatsapp: newNum } : u);
                              setUsers(updated);
                              store.setUsers(updated);
                              toast.success('WhatsApp number updated');
                            }
                          }}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        s.whatsapp
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={s.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                        {s.paymentStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-slate-400 py-10">No students in Class {selectedClass}</TableCell></TableRow>}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function GeneratePaperForm({ onCreate, onBack }: { onCreate: (e: Exam) => void, onBack: () => void }) {
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState('10');
  const [duration, setDuration] = useState('60');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState({ 
    text: '', 
    image: '',
    options: ['', '', '', ''], 
    optionImages: ['', '', '', ''],
    correct: 0 
  });

  const addQuestion = () => {
    if (!currentQ.text || currentQ.options.some(o => !o)) {
      toast.error('Please fill all question details');
      return;
    }
    const q: Question = {
      id: Date.now().toString(),
      text: currentQ.text,
      image: currentQ.image || undefined,
      options: [...currentQ.options],
      optionImages: currentQ.optionImages.some(img => img) ? [...currentQ.optionImages] : undefined,
      correctAnswerIndex: currentQ.correct
    };
    setQuestions([...questions, q]);
    setCurrentQ({ text: '', image: '', options: ['', '', '', ''], optionImages: ['', '', '', ''], correct: 0 });
    toast.success('Question added to paper');
  };

  const handleFinish = () => {
    if (questions.length === 0) {
      toast.error('Add at least one question');
      return;
    }
    const exam: Exam = {
      id: Date.now().toString(),
      title,
      classId,
      duration: parseInt(duration),
      questions,
      published: true,
      createdAt: Date.now()
    };
    onCreate(exam);
    onBack();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Question Paper</CardTitle>
          <CardDescription>Design your MCQ exam</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Exam Title</Label>
              <Input placeholder="e.g. Algebra Midterm" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['5', '6', '7', '8', '9', '10', '11', '12'].map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Duration (Minutes)</Label>
            <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} />
          </div>

          <div className="pt-4 border-t space-y-4">
            <h3 className="font-semibold">Add Question</h3>
            <div className="space-y-2">
              <Label>Question Text</Label>
              <div className="space-y-3">
                <Input value={currentQ.text} onChange={e => setCurrentQ({...currentQ, text: e.target.value})} />
                <div className="flex flex-col gap-2">
                  <Label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-700 font-bold text-[10px] uppercase p-2 bg-blue-50 rounded-lg w-fit transition-all border border-blue-100">
                    <Upload className="w-3.5 h-3.5" /> Add Image to Question
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      if (e.target.files?.[0]) setCurrentQ({...currentQ, image: URL.createObjectURL(e.target.files[0])});
                    }} />
                  </Label>
                  {currentQ.image && (
                    <div className="relative inline-block mt-2">
                      <img src={currentQ.image} alt="Q-Preview" className="h-24 w-auto rounded-xl border-2 border-slate-100 shadow-sm" />
                      <button className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors" onClick={() => setCurrentQ({...currentQ, image: ''})}>✕</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((opt, idx) => (
                <div key={idx} className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Option {idx + 1}</Label>
                  <div className="flex gap-2 items-center">
                    <Input className="bg-white border-slate-200" value={opt} onChange={e => {
                      const newOpts = [...currentQ.options];
                      newOpts[idx] = e.target.value;
                      setCurrentQ({...currentQ, options: newOpts});
                    }} />
                    <Checkbox checked={currentQ.correct === idx} onCheckedChange={() => setCurrentQ({...currentQ, correct: idx})} />
                  </div>
                  <div className="pt-1">
                    <Label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-700 font-bold text-[9px] uppercase p-1.5 bg-white border border-slate-200 rounded-md w-fit transition-all">
                      <Upload className="w-3 h-3" /> Add Option Image
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const newImgs = [...currentQ.optionImages];
                          newImgs[idx] = URL.createObjectURL(e.target.files[0]);
                          setCurrentQ({...currentQ, optionImages: newImgs});
                        }
                      }} />
                    </Label>
                    {currentQ.optionImages[idx] && (
                      <div className="relative inline-block mt-2">
                        <img src={currentQ.optionImages[idx]} alt="Opt-Preview" className="h-12 w-auto rounded-lg border border-slate-200" />
                        <button className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 text-[8px] shadow-sm hover:bg-red-600" onClick={() => {
                          const newImgs = [...currentQ.optionImages];
                          newImgs[idx] = '';
                          setCurrentQ({...currentQ, optionImages: newImgs});
                        }}>✕</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full" onClick={addQuestion}>Add to Paper</Button>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button className="flex-1" onClick={handleFinish}>Finish & Publish</Button>
          <Button variant="outline" onClick={onBack}>Cancel</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paper Preview</CardTitle>
          <CardDescription>{questions.length} Questions added so far</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {questions.map((q, i) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-lg border">
                  <p className="font-medium mb-2">Q{i+1}: {q.text}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, idx) => (
                      <div key={idx} className={`text-sm p-2 rounded ${idx === q.correctAnswerIndex ? 'bg-green-100 border-green-200 border' : 'bg-white border'}`}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {questions.length === 0 && <p className="text-center text-slate-400 py-20">No questions added yet</p>}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminChatSection({ initialGroup, user }: { initialGroup?: string | null, user: User }) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(initialGroup || null);
  const [groups, setGroups] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages(store.getMessages());
    setGroups(store.getChatGroups());
  }, []);

  useEffect(() => {
    if (initialGroup) {
      setSelectedGroup(initialGroup);
    }
  }, [initialGroup]);

  const filteredMessages = messages.filter(m => m.classId === selectedGroup);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      senderId: 'admin-1',
      senderName: 'Rupak (Admin)',
      senderRole: 'admin',
      timestamp: Date.now(),
      classId: selectedGroup
    };
    const updated = [...store.getMessages(), msg];
    store.setMessages(updated);
    setMessages(updated);
    setNewMessage('');
    toast.success('Message sent to group');
  };

  const handleSetTime = () => {
    if (!selectedGroup || selectedGroup === 'Global Chat') return;
    const time = prompt('Enter Coaching Time for this group (e.g. 2pm):');
    if (time) {
      const baseName = selectedGroup.split('(')[0].trim();
      const timeGroup = `${baseName} (${time})`;
      if (!groups.includes(timeGroup)) {
        const updatedGroups = [...groups, timeGroup];
        setGroups(updatedGroups);
        store.setChatGroups(updatedGroups);
        setSelectedGroup(timeGroup);
        toast.success(`Timing group ${timeGroup} created`);
      } else {
        setSelectedGroup(timeGroup);
      }
    }
  };

  const handleBranch = () => {
    if (!selectedGroup || selectedGroup === 'Global Chat') return;
    const baseName = selectedGroup.split('(')[0].trim();
    const branchMap: Record<number, string> = { 1: 'i', 2: 'ii', 3: 'iii', 4: 'iv', 5: 'v' };
    const branchCount = groups.filter(g => g.startsWith(baseName) && g.includes('(')).length;
    const suffix = branchMap[branchCount + 1] || (branchCount + 1).toString();
    const nextBranch = `${baseName}(${suffix})`;
    
    if (!groups.includes(nextBranch)) {
      const updatedGroups = [...groups, nextBranch];
      setGroups(updatedGroups);
      store.setChatGroups(updatedGroups);
      setSelectedGroup(nextBranch);
      toast.success(`Created branch ${nextBranch}`);
    }
  };

  const handleRenameGroup = (oldName: string) => {
    const newName = prompt('Rename class group:', oldName);
    if (newName && newName.trim() !== oldName) {
      const updatedGroups = groups.map(g => g === oldName ? newName : g);
      setGroups(updatedGroups);
      store.setChatGroups(updatedGroups);
      if (selectedGroup === oldName) setSelectedGroup(newName);
      
      // Update all messages in this group
      const allMsgs = store.getMessages();
      const updatedMsgs = allMsgs.map(m => m.classId === oldName ? { ...m, classId: newName } : m);
      store.setMessages(updatedMsgs);
      setMessages(updatedMsgs);
      
      toast.success('Group renamed successfully');
    }
  };

  return (
    <div className="grid grid-cols-12 gap-0 h-[750px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
      {/* Groups Sidebar */}
      <div className="hidden md:flex col-span-4 lg:col-span-3 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800 uppercase italic flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" /> Chats
            </h3>
            <Button variant="ghost" size="icon" onClick={() => setSelectedGroup(null)} className="h-8 w-8 rounded-full">
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-9 h-9 bg-slate-50 border-none text-xs rounded-lg" placeholder="Search groups..." />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {groups.map(group => (
            <div key={group} className="relative group/group shadow-sm">
              <button 
                onClick={() => setSelectedGroup(group)}
                className={`w-full p-4 flex items-center gap-3 transition-all border-b border-slate-50 ${selectedGroup === group ? 'bg-white border-r-4 border-r-blue-600 shadow-sm' : 'hover:bg-slate-100'}`}
              >
                <div className={`p-2 rounded-xl text-white ${group.includes('Global') ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                  <Users2 className="w-5 h-5" />
                </div>
                <div className="text-left overflow-hidden">
                  <p className={`text-sm font-bold truncate ${selectedGroup === group ? 'text-blue-600' : 'text-slate-900'}`}>{group}</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-widest">Active Group</p>
                </div>
              </button>
              {user.role === 'admin' && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover/group:opacity-100 transition-opacity bg-white/80 backdrop-blur shadow-sm rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameGroup(group);
                  }}
                >
                  <Edit2 className="w-3 h-3 text-slate-400" />
                </Button>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area or Hub */}
      <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col bg-white overflow-hidden">
        {selectedGroup ? (
          <>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedGroup(null)}>
                   <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className={`p-2 rounded-xl text-white ${selectedGroup.includes('Global') ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                  <Users2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-slate-900 uppercase italic tracking-tight">{selectedGroup}</p>
                    {user.role === 'admin' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full hover:bg-slate-200"
                        onClick={() => handleRenameGroup(selectedGroup)}
                      >
                        <Edit2 className="w-3 h-3 text-slate-400" />
                      </Button>
                    )}
                  </div>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live Now
                  </p>
                </div>
              </div>
              {selectedGroup !== 'Global Chat' && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleSetTime} className="rounded-full bg-white border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50">
                    <Clock className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Set Time</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleBranch} className="rounded-full bg-white border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-50">
                    <GitBranch className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Make a branch</span>
                  </Button>
                </div>
              )}
            </div>

            <ScrollArea className="flex-1 p-6 bg-slate-50/30">
              <div className="space-y-4">
                {filteredMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] ${msg.senderRole === 'admin' ? 'bg-blue-600 text-white rounded-3xl rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 rounded-3xl rounded-tl-none'} p-4 shadow-sm relative group`}>
                      {msg.senderRole !== 'admin' && <p className="text-[10px] font-black text-blue-600 uppercase italic mb-1">{msg.senderName}</p>}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-[9px] mt-2 font-mono ${msg.senderRole === 'admin' ? 'text-blue-100' : 'text-slate-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {filteredMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-bold uppercase italic tracking-widest">No signals detected in this channel</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2 max-w-4xl mx-auto">
                <Input 
                  placeholder={`Broadcast to ${selectedGroup}...`}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  className="rounded-xl border-slate-200 h-11 bg-slate-50 focus:bg-white transition-all"
                />
                <Button onClick={handleSendMessage} size="icon" className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col p-6 bg-slate-50/30 overflow-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Community Hub</h2>
              <p className="text-slate-500 font-medium tracking-tight">Select a class group to start broadcasting</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map(group => (
                <button 
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-left relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 -mr-4 -mt-4 transition-transform group-hover:scale-110 ${group.includes('Global') ? 'text-indigo-600' : 'text-blue-600'}`}>
                    <MessageCircle className="w-full h-full" />
                  </div>
                  <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-white ${group.includes('Global') ? 'bg-indigo-600' : 'bg-blue-600 shadow-lg shadow-blue-200'}`}>
                    <Users2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-900 uppercase italic tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{group}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {messages.filter(m => m.classId === group).length} Active Messages
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DueListSection({ students, onRemind, onSelectStudent }: { students: User[], onRemind: (phone: string) => void, onSelectStudent: (u: User) => void }) {
  const dueStudents = students.filter(s => s.paymentStatus === 'due');
  const today = new Date();
  const isAfter15th = today.getDate() >= 15;

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-2xl rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="bg-slate-900 text-white p-5 sm:p-8">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter shadow-sm">Due List Analytics</CardTitle>
              <CardDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                {isAfter15th ? 'Showing critical pending dues (After 15th)' : 'Active Monthly Dues'}
              </CardDescription>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            </div>
          </div>
        </CardHeader>
        
        {/* Mobile Friendly Card View */}
        <div className="p-3 bg-slate-50/50 space-y-3 sm:hidden">
          {dueStudents.map(s => (
            <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-slate-900 text-sm italic">{s.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Class {s.class} Scholar</p>
                </div>
                <Badge className="bg-red-500 text-[9px] font-black h-4 px-2">UNPAID</Badge>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-500 tabular-nums">{s.whatsapp}</p>
                <div className="flex gap-2">
                   <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full bg-slate-50" onClick={() => onSelectStudent(s)}>
                    <UserIcon className="w-3.5 h-3.5 text-blue-500" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full bg-slate-50" onClick={() => onRemind(s.whatsapp)}>
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {dueStudents.length === 0 && (
            <div className="py-20 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <p className="font-black text-slate-400 uppercase italic text-xs">All Clear!</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="p-0 hidden sm:block overflow-x-auto scrollbar-hide">
          <div className="min-w-[700px] lg:min-w-full">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100">
                  <TableHead className="font-black text-[10px] uppercase pl-6 py-4">Student Name</TableHead>
                  <TableHead className="font-black text-[10px] uppercase">Class</TableHead>
                  <TableHead className="font-black text-[10px] uppercase">Contact</TableHead>
                  <TableHead className="font-black text-[10px] uppercase text-center">Status</TableHead>
                  <TableHead className="font-black text-[10px] uppercase text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dueStudents.map(s => (
                  <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                    <TableCell className="font-bold text-slate-800 text-sm pl-6">{s.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-black h-5 border-slate-200">Class {s.class}</Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold text-slate-500 font-mono tracking-tighter">{s.whatsapp}</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-red-500 text-[10px] font-black h-5 italic tracking-tighter">UNPAID</Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-9 w-9 rounded-xl hover:bg-slate-100 flex items-center justify-center")}>
                          <MoreVertical className="h-4 w-4 text-slate-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-1 rounded-xl shadow-2xl border-slate-100">
                          <DropdownMenuLabel className="text-[9px] font-black uppercase text-slate-400 px-3 py-2 tracking-widest">Finance Management</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-3 py-2.5 rounded-lg" onClick={() => onRemind(s.whatsapp)}>
                            <MessageSquare className="w-4 h-4 text-emerald-500" /> <span className="font-bold text-xs uppercase italic">Send Reminder</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3 py-2.5 rounded-lg" onClick={() => onSelectStudent(s)}>
                            <UserIcon className="w-4 h-4 text-blue-500" /> <span className="font-bold text-xs uppercase italic">View Biography</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {dueStudents.length === 0 && (
                  <TableRow>
                    <TableHead colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <p className="font-black text-slate-400 uppercase italic tracking-widest text-sm">All students have cleared dues!</p>
                      </div>
                    </TableHead>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ReceivePaymentSection({ students, onTogglePayment, onWhatsApp }: { students: User[], onTogglePayment: (id: string) => void, onWhatsApp: (phone: string) => void }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'due'>('due');

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                         s.username.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || s.paymentStatus === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Receive Payment</CardTitle>
            <CardDescription>Update student fee status</CardDescription>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['all', 'paid', 'due'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                  filter === f ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search student..."
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filtered.map(s => (
            <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-white text-slate-900 font-bold">{s.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm">{s.name}</p>
                  <p className="text-[10px] text-slate-500">Class {s.class} • ID: {s.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right mr-4 hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                  <Badge variant={s.paymentStatus === 'paid' ? 'default' : 'destructive'} className="text-[10px] h-5">
                    {s.paymentStatus}
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  variant={s.paymentStatus === 'paid' ? 'outline' : 'default'}
                  onClick={() => onTogglePayment(s.id)}
                  className="font-bold text-[10px] uppercase tracking-widest"
                >
                  {s.paymentStatus === 'paid' ? 'Mark Due' : 'Mark Paid'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onWhatsApp(s.whatsapp)} className="text-green-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-slate-400 py-10">No students found</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function NotesSection({ user, notes, onAdd, onUpdate }: { 
  user: User, 
  notes: Note[], 
  onAdd: (n: Note) => void,
  onUpdate: (notes: Note[]) => void
}) {
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState('10');
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<'text' | 'file'>('text');
  const [fileUrl, setFileUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const note: Note = {
      id: Date.now().toString(),
      title,
      classId,
      content: noteType === 'text' ? content : 'File attached',
      type: noteType,
      fileUrl: noteType === 'file' ? fileUrl : undefined,
      isPublished: true, // New notes are published by default
      createdAt: Date.now()
    };
    onAdd(note);
    setTitle('');
    setContent('');
    setFileUrl('');
    toast.success('Note published successfully');
  };

  const togglePublished = (noteId: string) => {
    const updated = notes.map(n => n.id === noteId ? { ...n, isPublished: !n.isPublished } : n);
    onUpdate(updated);
    const note = updated.find(n => n.id === noteId);
    toast.success(note?.isPublished ? 'Note published to students' : 'Note hidden from students');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-xl border-white/40 bg-white/80 backdrop-blur-md rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-xl font-black tracking-tight uppercase italic text-slate-900 leading-none">Create Study Material</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Share notes or files with your students</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Note Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Trigonometry Basics" required className="h-12 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400">Target Class</Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['5', '6', '7', '8', '9', '10', '11', '12'].map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400">Submission Type</Label>
                <Tabs value={noteType} onValueChange={(v) => setNoteType(v as 'text' | 'file')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl bg-slate-100/50 p-1">
                    <TabsTrigger value="text" className="font-bold rounded-lg text-xs">Write</TabsTrigger>
                    <TabsTrigger value="file" className="font-bold rounded-lg text-xs">File</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {noteType === 'text' ? (
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400">Content</Label>
                <textarea 
                  className="w-full min-h-[200px] p-4 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="Write your study notes here..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400">File URL / Link</Label>
                <div className="flex gap-2">
                  <Input 
                    value={fileUrl} 
                    onChange={e => setFileUrl(e.target.value)} 
                    placeholder="Paste Drive or PDF link" 
                    required 
                    className="h-12 rounded-xl flex-1"
                  />
                  <Button type="button" variant="outline" className="h-12 w-12 p-0 rounded-xl" onClick={() => toast.info('Link captured!')}>
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-indigo-100">
              <Send className="w-4 h-4 mr-2" /> Publish Now
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-white/40 bg-white/80 backdrop-blur-md rounded-[2rem] overflow-hidden flex flex-col">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-xl font-black tracking-tight uppercase italic text-slate-900 leading-none">Shared Materials</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage published study resources</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-[600px]">
            <div className="divide-y divide-slate-50">
              {notes.map(note => (
                <div key={note.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${note.type === 'file' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {note.type === 'file' ? <FileText className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm uppercase italic leading-tight">{note.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-black tracking-tighter uppercase rounded-md text-slate-400 border-slate-200">Class {note.classId}</Badge>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">{new Date(note.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1">
                      <Label className="text-[8px] font-black uppercase text-slate-400 leading-none">
                        {note.isPublished !== false ? 'Published' : 'Hidden'}
                      </Label>
                      <Checkbox 
                        checked={note.isPublished !== false}
                        onCheckedChange={() => togglePublished(note.id)}
                        className="rounded-md border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 h-4 w-4"
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl" onClick={() => {
                      if(confirm('Delete this note?')) {
                        onUpdate(notes.filter(n => n.id !== note.id));
                        toast.success('Note deleted');
                      }
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="p-20 text-center text-slate-400 italic text-sm">No notes have been shared yet</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function MCQManagerSection({ exams, onUpdate }: { exams: Exam[], onUpdate: (exams: Exam[]) => void }) {
  const togglePublish = (id: string) => {
    const updated = exams.map(e => e.id === id ? { ...e, published: !e.published } : e);
    onUpdate(updated);
    toast.success('Exam status updated');
  };

  const deleteExam = (id: string) => {
    const updated = exams.filter(e => e.id !== id);
    onUpdate(updated);
    toast.success('Exam deleted');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>MCQ Manager</CardTitle>
        <CardDescription>Manage your published and draft exams</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam Title</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map(exam => (
              <TableRow key={exam.id}>
                <TableCell className="font-medium">{exam.title}</TableCell>
                <TableCell>Class {exam.classId}</TableCell>
                <TableCell>{exam.questions.length}</TableCell>
                <TableCell>
                  <Badge variant={exam.published ? 'default' : 'outline'}>
                    {exam.published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => togglePublish(exam.id)}>
                      {exam.published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteExam(exam.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {exams.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-10">No exams found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ResultsSection({ results, exams, students, onUpdateExam }: { 
  results: Result[], 
  exams: Exam[], 
  students: User[],
  onUpdateExam: (exam: Exam) => void 
}) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  
  const classes = Array.from(new Set(students.map(s => s.class))).sort((a, b) => Number(a) - Number(b));
  
  const filteredResults = selectedClass 
    ? results.filter(r => {
        const student = students.find(s => s.id === r.studentId);
        return student?.class === selectedClass;
      })
    : results;

  const sendWhatsApp = (phone: string, message: string) => {
    const url = `https://wa.me/${phone.startsWith('91') ? phone : '91' + phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareResult = (res: Result) => {
    const message = `🎯 Rupak Math Academy Result Update\n\nStudent: ${res.studentName}\nExam: ${res.examTitle}\nScore: ${res.score}/${res.total}\nPercentage: ${((res.score/res.total) * 100).toFixed(1)}%\n\nKeep growing! 🚀`;
    const student = students.find(s => s.id === res.studentId);
    if (student?.whatsapp) {
      sendWhatsApp(student.whatsapp, message);
    } else {
      toast.error('Student WhatsApp number not found');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Academic Results</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class-wise performance tracking</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedClass === null ? 'default' : 'outline'} 
            onClick={() => setSelectedClass(null)}
            className="rounded-xl h-10 px-4 text-[10px] font-bold uppercase"
          >
            All Classes
          </Button>
          {classes.map(cls => (
            <Button 
              key={cls}
              variant={selectedClass === cls ? 'default' : 'outline'}
              onClick={() => setSelectedClass(cls)}
              className={`rounded-xl h-10 px-4 text-[10px] font-bold uppercase transition-all ${selectedClass === cls ? 'bg-indigo-600' : ''}`}
            >
              Results of Class {cls}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exams Publishing Status */}
        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg font-black uppercase italic tracking-tight">Published Scoreboards</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visibility on student dashboard</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="divide-y divide-slate-50">
                {exams.filter(e => e.published).map(exam => (
                  <div key={exam.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{exam.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Class {exam.classId} • {exam.questions.length} Qs</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="text-[10px] font-black pointer-events-none uppercase text-slate-400">
                        {exam.resultsPublished ? 'Published' : 'Hidden'}
                      </Label>
                      <Checkbox 
                        checked={exam.resultsPublished} 
                        onCheckedChange={(checked) => onUpdateExam({ ...exam, resultsPublished: !!checked })}
                        className="rounded-md border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                    </div>
                  </div>
                ))}
                {exams.filter(e => e.published).length === 0 && (
                  <div className="p-20 text-center text-slate-400 italic text-xs">No published exams for results</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Individual Results List */}
        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden flex flex-col">
          <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-black uppercase italic tracking-tight">Student Scores</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedClass ? `Class ${selectedClass}` : 'Global'} Performance</CardDescription>
            </div>
            <Activity className="w-5 h-5 text-indigo-400" />
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="text-[10px] font-black uppercase">Student</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Exam</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Score</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map(res => (
                    <TableRow key={res.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-bold text-slate-800 text-xs">
                        {res.studentName}
                        <p className="text-[8px] text-slate-400 font-bold uppercase">{students.find(s => s.id === res.studentId)?.class ? `Class ${students.find(s => s.id === res.studentId)?.class}` : 'Unassigned'}</p>
                      </TableCell>
                      <TableCell className="text-[10px] text-slate-600 font-medium">{res.examTitle}</TableCell>
                      <TableCell>
                        <Badge className={`${res.score / res.total >= 0.7 ? 'bg-emerald-500' : 'bg-amber-500'} text-[10px] font-black h-5`}>
                          {res.score}/{res.total}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          onClick={() => shareResult(res)}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredResults.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20 text-slate-400 italic text-xs">No result records found for this selection</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AttendanceSection({ students, attendance, onUpdate }: { students: User[], attendance: Attendance[], onUpdate: (a: Attendance[]) => void }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('10');
  
  const classStudents = students.filter(s => s.class === selectedClass);
  const todaysAttendance = attendance.filter(a => a.date === date);

  const toggleAttendance = (student: User) => {
    const existing = todaysAttendance.find(a => a.studentId === student.id);
    let updated: Attendance[];
    
    if (existing) {
      updated = attendance.map(a => 
        (a.studentId === student.id && a.date === date) 
          ? { ...a, status: a.status === 'present' ? 'absent' : 'present' } 
          : a
      );
    } else {
      updated = [...attendance, {
        id: Date.now().toString(),
        studentId: student.id,
        studentName: student.name,
        date,
        status: 'present'
      }];
    }
    onUpdate(updated);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Attendance Tracker</CardTitle>
          <CardDescription>Mark daily attendance for students</CardDescription>
        </div>
        <div className="flex gap-2">
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-40" />
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['6', '7', '8', '9', '10', '11', '12'].map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classStudents.map(s => {
              const record = todaysAttendance.find(a => a.studentId === s.id);
              return (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>
                    <Badge variant={record?.status === 'present' ? 'default' : 'destructive'}>
                      {record?.status || 'Not Marked'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => toggleAttendance(s)}>
                      {record?.status === 'present' ? 'Mark Absent' : 'Mark Present'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function GrowthSection({ students, payments }: { students: User[], payments: Payment[] }) {
  const enrollmentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Enrollment',
        data: [12, 19, 25, 32, 45, students.length],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [5000, 8000, 12000, 15000, 22000, students.filter(s => s.paymentStatus === 'paid').length * 500],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-xl rounded-[2rem] border-none overflow-hidden">
          <CardHeader className="bg-slate-900 text-white">
            <CardTitle className="text-xl font-black uppercase italic italic tracking-tight">Enrollment Over Time</CardTitle>
            <CardDescription className="text-slate-400">Student growth metric based on registrations</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <Line data={enrollmentData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl rounded-[2rem] border-none overflow-hidden">
          <CardHeader className="bg-slate-900 text-white">
            <CardTitle className="text-xl font-black uppercase italic italic tracking-tight">Revenue Analysis</CardTitle>
            <CardDescription className="text-slate-400">Monthly financial performance of the academy</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <Bar data={revenueData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 shadow-lg rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase italic tracking-tight">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 italic">
              <p className="text-sm font-bold text-blue-700">Highest Engagement</p>
              <p className="text-xs text-blue-600 mt-1">Class 10 students are consistently active in tests.</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 italic">
              <p className="text-sm font-bold text-emerald-700">Financial Health</p>
              <p className="text-xs text-emerald-600 mt-1">78% students have cleared their dues this month.</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 italic">
              <p className="text-sm font-bold text-amber-700">Expansion Need</p>
              <p className="text-xs text-amber-600 mt-1">Junior batch enrollment increased by 20% since April.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase italic tracking-tight">Student Retention Details</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
               {[
                 { label: 'Active Students', value: students.length, percentage: 100, color: 'bg-indigo-600' },
                 { label: 'Paid Scholars', value: students.filter(s => s.paymentStatus === 'paid').length, percentage: (students.filter(s => s.paymentStatus === 'paid').length / students.length) * 100, color: 'bg-emerald-500' },
                 { label: 'Exam Takers', value: Math.floor(students.length * 0.85), percentage: 85, color: 'bg-blue-500' },
                 { label: 'Junior Batch', value: students.filter(s => s.batchType === 'Jr').length, percentage: (students.filter(s => s.batchType === 'Jr').length / students.length) * 100, color: 'bg-amber-500' },
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                   <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
                     <span>{item.label}</span>
                     <span>{item.value} / {students.length}</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                   </div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TimetableSection({ timetable, onUpdate }: { timetable: TimetableEntry[], onUpdate: (t: TimetableEntry[]) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<TimetableEntry>>({
    classId: '10',
    batchType: 'Jr',
    day: 'Monday',
    time: '',
    subject: ''
  });

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAdd = () => {
    if (!newEntry.time || !newEntry.subject) {
      toast.error('Please fill all class details');
      return;
    }
    const entry: TimetableEntry = {
      id: Date.now().toString(),
      classId: newEntry.classId!,
      batchType: newEntry.batchType!,
      day: newEntry.day!,
      time: newEntry.time!,
      subject: newEntry.subject!
    };
    onUpdate([...timetable, entry]);
    setNewEntry({ ...newEntry, time: '', subject: '' });
    setIsAdding(false);
    toast.success('Class scheduled successfully');
  };

  const handleDelete = (id: string) => {
    onUpdate(timetable.filter(e => e.id !== id));
    toast.success('Class removed from schedule');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Class Timetable</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Manage academy schedule & coaching slots</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-black uppercase tracking-widest italic shadow-xl shadow-blue-500/20">
          <Plus className="mr-2 w-4 h-4" /> Add Session
        </Button>
      </div>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black italic uppercase tracking-tighter">Schedule New Class</DialogTitle>
            <DialogDescription>Assign a new coaching slot to a batch</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label className="text-[10px] uppercase font-black text-slate-400">Class</Label>
                 <Select value={newEntry.classId} onValueChange={(v) => setNewEntry({...newEntry, classId: v})}>
                   <SelectTrigger className="mt-1 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                   <SelectContent>
                     {['5','6','7','8','9','10','11','12'].map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                   </SelectContent>
                 </Select>
               </div>
               <div>
                 <Label className="text-[10px] uppercase font-black text-slate-400">Batch</Label>
                 <Select value={newEntry.batchType} onValueChange={(v) => setNewEntry({...newEntry, batchType: v as 'Sr' | 'Jr'})}>
                   <SelectTrigger className="mt-1 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Sr">Senior (Sr)</SelectItem>
                     <SelectItem value="Jr">Junior (Jr)</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>
             
             <div>
               <Label className="text-[10px] uppercase font-black text-slate-400">Day of Week</Label>
               <Select value={newEntry.day} onValueChange={(v) => setNewEntry({...newEntry, day: v})}>
                 <SelectTrigger className="mt-1 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                 <SelectContent>
                   {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                 </SelectContent>
               </Select>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label className="text-[10px] uppercase font-black text-slate-400">Time Label</Label>
                 <Input value={newEntry.time} onChange={(e) => setNewEntry({...newEntry, time: e.target.value})} placeholder="e.g. 5:00 PM" className="mt-1 h-11 rounded-xl" />
               </div>
               <div>
                 <Label className="text-[10px] uppercase font-black text-slate-400">Subject</Label>
                 <Input value={newEntry.subject} onChange={(e) => setNewEntry({...newEntry, subject: e.target.value})} placeholder="e.g. Mathematics" className="mt-1 h-11 rounded-xl" />
               </div>
             </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 bg-slate-900 h-12 rounded-xl font-bold uppercase tracking-widest" onClick={handleAdd}>Add to Schedule</Button>
            <Button variant="outline" className="h-12 rounded-xl font-bold" onClick={() => setIsAdding(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DAYS.map(day => {
          const dayEntries = timetable.filter(e => e.day === day);
          return (
            <Card key={day} className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                <CardTitle className="text-lg font-black uppercase italic tracking-tight flex items-center justify-between">
                  {day}
                  <Badge variant="outline" className="text-[10px] font-black h-5 border-slate-200">{dayEntries.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                  <div className="divide-y divide-slate-50">
                    {dayEntries.map(entry => (
                      <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{entry.subject}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-indigo-50 text-indigo-700 border-none text-[8px] h-4 rounded-md uppercase font-black">Class {entry.classId}</Badge>
                            <span className="text-[10px] font-bold text-slate-400 italic">{entry.time}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl" onClick={() => handleDelete(entry.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                    {dayEntries.length === 0 && (
                      <div className="py-20 text-center">
                        <Calendar className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-[10px] font-black text-slate-300 uppercase italic">No Classes Today</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
