import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
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
  User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        return { ...u, paymentStatus: u.paymentStatus === 'paid' ? 'due' : 'paid' };
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-white hidden md:flex flex-col border-r border-white/5">
        <div className="p-6 flex items-center gap-3 border-b border-white/5 bg-white/5">
          <div className="w-10 h-10 border-2 border-blue-500 rounded-full overflow-hidden shadow-lg bg-white p-0.5">
            <img src="/input_file_0.png" alt="Infinity Logo" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h2 className="font-black text-lg leading-tight tracking-tighter text-white italic">INFINITY</h2>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Bongaon</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem icon={<LayoutDashboard />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={<Users />} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
          <SidebarItem icon={<Calendar />} label="Timetable" active={activeTab === 'timetable'} onClick={() => setActiveTab('timetable')} />
          <SidebarItem icon={<TrendingUp />} label="Growth" active={activeTab === 'growth'} onClick={() => setActiveTab('growth')} />
          <SidebarItem icon={<FileText />} label="Exams" active={activeTab === 'exams'} onClick={() => setActiveTab('exams')} />
          <SidebarItem icon={<BookOpen />} label="Notes" active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
          <SidebarItem icon={<CreditCard />} label="Payments" active={activeTab === 'receive' || activeTab === 'due-list'} onClick={() => setActiveTab('receive')} />
          <SidebarItem icon={<Users2 />} label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
          <SidebarItem icon={<Trophy />} label="Results" active={activeTab === 'results'} onClick={() => setActiveTab('results')} />
          <SidebarItem icon={<MessageCircle />} label="Community Hub" active={activeTab === 'chats'} onClick={() => setActiveTab('chats')} />
        </nav>
        <div className="p-4 border-t border-white/5 bg-white/5">
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/10" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-slate-50">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl">
              <div className="w-8 h-8 border-2 border-blue-600 rounded-full overflow-hidden shadow-sm bg-white p-0.5">
                <img src="/input_file_0.png" alt="Infinity Logo" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              </div>
              
              {/* The 3-dots menu categorized as requested */}
              <Sheet open={isActionsOpen} onOpenChange={setIsActionsOpen}>
                <SheetTrigger className="h-8 w-8 hover:bg-slate-200 rounded-full flex items-center justify-center outline-none transition-colors cursor-pointer">
                  <MoreVertical className="h-4 w-4 text-slate-600" />
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 border-none bg-slate-950 text-white">
                  <SheetHeader className="p-6 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-blue-500/50">
                        <AvatarFallback className="bg-blue-600 text-white text-lg font-bold">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <SheetTitle className="text-white text-lg font-black tracking-tight">{user.name}</SheetTitle>
                        <SheetDescription className="text-blue-400 text-[10px] uppercase tracking-widest font-bold">Practice makes perfect</SheetDescription>
                      </div>
                    </div>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-100px)]">
                    <div className="p-4 space-y-6">
                      {/* Main Category */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Main</p>
                        <div className="space-y-1">
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => handleAction('overview')}>
                            <LayoutDashboard className="w-4 h-4" /> Overview
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => handleAction('chats')}>
                            <MessageCircle className="w-4 h-4" /> Community Chat
                          </Button>
                        </div>
                      </div>

                      {/* Manage Category */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Manage</p>
                        <div className="space-y-1">
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => handleAction('students')}>
                            <Users className="w-4 h-4" /> Students List
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => handleAction('add-student')}>
                            <UserPlus className="w-4 h-4" /> Add New Student
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => handleAction('attendance')}>
                            <CheckCircle2 className="w-4 h-4" /> Attendance
                          </Button>
                        </div>
                      </div>

                      {/* Academic Tools Category */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Academic Tools</p>
                        <div className="space-y-1">
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => handleAction('generate-paper')}>
                            <FileText className="w-4 h-4" /> Question Paper
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => handleAction('mcq-manager')}>
                            <CheckSquare className="w-4 h-4" /> MCQ Manager
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => handleAction('notes')}>
                            <BookOpen className="w-4 h-4" /> Study Notes
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => handleAction('results')}>
                            <Trophy className="w-4 h-4" /> Exam Results
                          </Button>
                        </div>
                      </div>

                      {/* Fees Category */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Fees & Finance</p>
                        <div className="space-y-1">
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => handleAction('receive')}>
                            <CreditCard className="w-4 h-4" /> Receive Payment
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => handleAction('due-list')}>
                            <Clock className="w-4 h-4" /> Due List
                          </Button>
                        </div>
                      </div>

                      {/* System Category */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">System</p>
                        <div className="space-y-1">
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => handleAction('settings')}>
                            <Settings className="w-4 h-4" /> Settings
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={onLogout}>
                            <LogOut className="w-4 h-4" /> Logout
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight ml-2 uppercase">{activeTab.replace('-', ' ')}</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <Sheet>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="text-slate-500">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              } />
              <SheetContent className="bg-white border-none shadow-2xl p-0 w-64">
                <SheetHeader className="p-6 border-b border-slate-50 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-indigo-600">
                      <AvatarFallback className="bg-indigo-600 text-white font-black">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <SheetTitle className="text-slate-900 font-black uppercase italic text-sm">{user.name}</SheetTitle>
                      <SheetDescription className="text-indigo-600 text-[10px] uppercase font-bold tracking-widest leading-none">Senior Administrator</SheetDescription>
                    </div>
                  </div>
                </SheetHeader>
                <div className="p-4 space-y-1">
                  <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-600 hover:bg-slate-50" onClick={() => setActiveTab('settings')}>
                    <Settings className="w-4 h-4" /> Personal Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-red-600 hover:bg-red-50" onClick={onLogout}>
                    <LogOut className="w-4 h-4" /> Logout Account
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-slate-500">Math Specialist</p>
              </div>
              <Badge className="bg-indigo-600">Admin</Badge>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <ScrollArea className="flex-1 p-6">
          <div key={activeTab}>
            {activeTab === 'growth' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Financial Growth</h2>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Last 30 Days</Button>
                      <Button variant="outline" size="sm">This Year</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-linear-to-br from-emerald-500 to-teal-600 text-white border-none shadow-xl">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-emerald-100 font-bold uppercase text-[10px] tracking-widest">Monthly Revenue</CardDescription>
                        <CardTitle className="text-4xl font-black italic">₹{totalRevenue}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium text-emerald-50 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" /> +15.4% from last month
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-lg border-none">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Active Subscriptions</CardDescription>
                        <CardTitle className="text-3xl font-black">{students.filter(s => s.paymentStatus === 'paid').length}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${(students.filter(s => s.paymentStatus === 'paid').length / students.length) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Payment Completion Rate</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-lg border-none">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Projected Yearly</CardDescription>
                        <CardTitle className="text-3xl font-black">₹{totalRevenue * 12}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-500 font-medium">Based on current student count</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="shadow-xl bg-white border-none">
                    <CardHeader>
                      <CardTitle className="text-xl font-black tracking-tight">Revenue Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <Bar 
                        data={{
                          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                          datasets: [{
                            label: 'Revenue (₹)',
                            data: [15000, 18500, 22000, 25000, 21000, totalRevenue],
                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                            borderRadius: 8,
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: { beginAtZero: true }
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'timetable' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Coaching Timetable</h2>
                    <Button onClick={() => {
                      const subject = prompt('Subject:');
                      const cls = prompt('Class (5-12):');
                      const batch = prompt('Batch (Sr/Jr):') as 'Sr' | 'Jr';
                      const day = prompt('Day (e.g. Monday):');
                      const time = prompt('Time (e.g. 2pm):');
                      if (subject && cls && day && time) {
                        const newEntry: TimetableEntry = { id: Date.now().toString(), subject, classId: cls, batchType: batch || 'Jr', day, time };
                        const updated = [...timetable, newEntry];
                        setTimetable(updated);
                        store.setTimetable(updated);
                        toast.success('Timetable updated');
                      }
                    }} className="bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="mr-2 h-4 w-4" /> Create Slot
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <Card key={day} className="shadow-lg border-none overflow-hidden">
                        <div className="h-1.5 bg-indigo-500" />
                        <CardHeader className="bg-slate-50/50 pb-2">
                          <CardTitle className="text-lg font-black tracking-tight">{day}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            {timetable.filter(t => t.day.toLowerCase() === day.toLowerCase()).map(entry => (
                              <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white rounded-lg shadow-xs">
                                    <Timer className="w-4 h-4 text-indigo-600" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 text-sm">{entry.subject}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Class {entry.classId} ({entry.batchType}) • {entry.time}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 text-red-500" onClick={() => {
                                  if (confirm('Delete this slot?')) {
                                    const updated = timetable.filter(t => t.id !== entry.id);
                                    setTimetable(updated);
                                    store.setTimetable(updated);
                                  }
                                }}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            {timetable.filter(t => t.day.toLowerCase() === day.toLowerCase()).length === 0 && (
                              <p className="text-center text-xs text-slate-400 py-6 italic">No classes scheduled</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div onClick={() => setActiveTab('students')} className="cursor-pointer group">
                      <StatCard title="Total Students" value={students.length} icon={<Users className="text-blue-600" />} trend="+4% from last month" />
                    </div>
                    <div onClick={() => setActiveTab('exams')} className="cursor-pointer group">
                      <StatCard title="Active Exams" value={exams.filter(e => e.published).length} icon={<FileText className="text-purple-600" />} trend="2 upcoming" />
                    </div>
                    <div onClick={() => setActiveTab('receive')} className="cursor-pointer group">
                      <StatCard title="Total Revenue" value={`₹${totalRevenue}`} icon={<CreditCard className="text-emerald-600" />} trend="+12% growth" />
                    </div>
                    <div onClick={() => setActiveTab('due-list')} className="cursor-pointer group">
                      <StatCard title="Pending Dues" value={students.filter(s => s.paymentStatus === 'due').length} icon={<Clock className="text-orange-600" />} trend="Check due list" />
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
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
                    <div>
                      <h2 className="text-3xl font-black tracking-tighter uppercase italic">Student List Management</h2>
                      <p className="text-slate-400 text-sm">Session 2024-25 • {students.length} Total Enrolled</p>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => setActiveTab('add-student')} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                        <UserPlus className="mr-2 h-4 w-4" /> New Enrolment
                      </Button>
                    </div>
                  </div>

                  {/* Class Distribution Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {['5', '6', '7', '8', '9', '10', '11', '12'].map(cls => (
                      <button
                        key={cls}
                        onClick={() => setSelectedClassFilter(selectedClassFilter === cls ? null : cls)}
                        className={`p-4 rounded-2xl border-2 transition-all text-left group ${
                          selectedClassFilter === cls 
                          ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100 scale-105' 
                          : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-md'
                        }`}
                      >
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedClassFilter === cls ? 'text-blue-600' : 'text-slate-400'}`}>Class</p>
                        <div className="flex items-end justify-between">
                          <p className={`text-2xl font-black ${selectedClassFilter === cls ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-600'}`}>{cls}</p>
                          <p className="text-[10px] font-bold text-slate-400">{students.filter(s => s.class === cls).length} Scholars</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <Card className="shadow-2xl border-none bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                      <CardTitle className="text-xl font-black tracking-tight text-slate-900 uppercase">
                        {selectedClassFilter ? `Class ${selectedClassFilter} Students` : 'All Enrolled Students'}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant={selectedBatchFilter === 'Sr' ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setSelectedBatchFilter(selectedBatchFilter === 'Sr' ? null : 'Sr')}
                          className="h-8 rounded-full text-[10px] font-bold"
                        >Sr Batch</Button>
                        <Button 
                          variant={selectedBatchFilter === 'Jr' ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setSelectedBatchFilter(selectedBatchFilter === 'Jr' ? null : 'Jr')}
                          className="h-8 rounded-full text-[10px] font-bold"
                        >Jr Batch</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow className="hover:bg-transparent border-slate-200">
                            <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-widest pl-6">Student Name</TableHead>
                            <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-widest">Coaching Schedule</TableHead>
                            <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-widest">Finance</TableHead>
                            <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-widest">Status</TableHead>
                            <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-widest text-right pr-6">Management</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students
                            .filter(s => !selectedClassFilter || s.class === selectedClassFilter)
                            .filter(s => !selectedBatchFilter || s.batchType === selectedBatchFilter)
                            .map(student => (
                            <TableRow key={student.id} className="border-slate-50 hover:bg-slate-50/10 transition-colors">
                              <TableCell className="pl-6 py-4">
                                <button 
                                  onClick={() => setSelectedStudentForProfile(student)}
                                  className="flex items-center gap-3 text-left group"
                                >
                                  <Avatar className="h-9 w-9 border-2 border-slate-100 group-hover:border-blue-200 transition-colors">
                                    <AvatarFallback className="bg-blue-50 text-blue-600 font-black text-xs">{student.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                      {student.name}
                                      {student.batchType && <Badge variant="outline" className={`text-[8px] h-4 px-1 ${student.batchType === 'Sr' ? 'text-amber-600 bg-amber-50 border-amber-100' : 'text-blue-600 bg-blue-50 border-blue-100'}`}>({student.batchType})</Badge>}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium">Class {student.class} Enrolment</p>
                                  </div>
                                </button>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex gap-1">
                                    {student.coachingDays?.map(d => (
                                      <span key={d} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{d.slice(0, 3)}</span>
                                    ))}
                                  </div>
                                  <p className="text-[10px] font-bold text-indigo-500 uppercase">{student.coachingTime || 'Time not set'}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm font-black text-slate-900">₹{student.dueAmount || 0}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Due Balance</p>
                              </TableCell>
                              <TableCell>
                                <Badge className={`rounded-full px-3 text-[10px] font-black uppercase ${student.paymentStatus === 'paid' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-red-500 shadow-lg shadow-red-500/20'}`}>
                                  {student.paymentStatus}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-slate-100">
                                      <MoreVertical className="h-4 w-4 text-slate-400" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-56 p-1 rounded-xl shadow-2xl border-slate-100">
                                    <DropdownMenuLabel className="text-[9px] uppercase font-black text-slate-400 px-3 py-2 tracking-widest">Scholar Management</DropdownMenuLabel>
                                    <DropdownMenuItem className="rounded-lg py-2.5 px-3 gap-2" onClick={() => setSelectedStudentForProfile(student)}>
                                      <UserIcon className="w-4 h-4 text-slate-400" /> <span className="font-bold text-xs uppercase italic">Full Biography</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-lg py-2.5 px-3 gap-2" onClick={() => handleTogglePayment(student.id)}>
                                      <CreditCard className="w-4 h-4 text-slate-400" /> <span className="font-bold text-xs uppercase italic">{student.paymentStatus === 'paid' ? 'Mark as Due' : 'Mark as Paid'}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-lg py-2.5 px-3 gap-2" onClick={() => {
                                      const text = `Hello ${student.name}, hope you are doing well. Just a quick update regarding your coaching at INFINITY BONGAON.`;
                                      sendWhatsApp(student.whatsapp || '', text);
                                    }}>
                                      <MessageCircle className="w-4 h-4 text-slate-400" /> <span className="font-bold text-xs uppercase italic">Direct Dispatch</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-lg py-2.5 px-3 gap-2" onClick={() => {
                                      setSelectedChatGroup(`Infinity Class ${student.class}`);
                                      setActiveTab('chats');
                                    }}>
                                      <GitBranch className="w-4 h-4 text-slate-400" /> <span className="font-bold text-xs uppercase italic">Join Class Chat</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-1 mx-1 bg-slate-100" />
                                    <DropdownMenuItem className="text-red-600 rounded-lg py-2.5 px-3 gap-2" onClick={() => {
                                      if (confirm('Permanently remove this student?')) {
                                        const updated = users.filter(u => u.id !== student.id);
                                        setUsers(updated);
                                        store.setUsers(updated);
                                        toast.success('Student removed from database');
                                      }
                                    }}>
                                      <Trash2 className="w-4 h-4" /> <span className="font-bold text-xs uppercase italic">Purge Account</span>
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
              )}

              {activeTab === 'add-student' && (
                <AddStudentForm user={user} users={users} setUsers={setUsers} onAdd={handleAddStudent} onBack={() => setActiveTab('students')} students={students} />
              )}

              {activeTab === 'generate-paper' && (
                <GeneratePaperForm onCreate={handleCreateExam} onBack={() => setActiveTab('exams')} />
              )}

              {activeTab === 'chats' && <AdminChatSection initialGroup={selectedChatGroup} />}

              {activeTab === 'due-list' && (
                <DueListSection students={students} onSelectStudent={setSelectedStudentForProfile} onRemind={(phone) => sendWhatsApp(phone, "Dear Student, this is a reminder regarding your pending fees at Rupak Math Academy. Please clear it at the earliest.")} />
              )}

              {activeTab === 'receive' && (
                <ReceivePaymentSection 
                  students={students} 
                  onSelectStudent={setSelectedStudentForProfile}
                  onTogglePayment={handleTogglePayment} 
                  onWhatsApp={(phone) => sendWhatsApp(phone, "Hello! Your payment has been received at Rupak Math Academy. Thank you!")}
                />
              )}

              {activeTab === 'notes' && (
                <NotesSection user={user} notes={notes} onAdd={(n) => {
                  const updated = [...notes, n];
                  store.setNotes(updated);
                  setNotes(updated);
                  toast.success('Note added successfully');
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
                <ResultsSection results={results} />
              )}

              {activeTab === 'attendance' && (
                <AttendanceSection students={students} attendance={attendance} onUpdate={(updatedAttendance) => {
                  store.setAttendance(updatedAttendance);
                  setAttendance(updatedAttendance);
                  toast.success('Attendance updated');
                }} />
              )}

              {activeTab === 'settings' && (
                <SettingsSection user={user} students={students} onUpdateUser={(updatedUser) => {
                  const allUsers = store.getUsers();
                  const updatedUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
                  store.setUsers(updatedUsers);
                  setUsers(updatedUsers);
                  toast.success('Settings updated');
                }} />
              )}
            </div>
        </ScrollArea>
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
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string | number, icon: React.ReactNode, trend: string }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
          {trend}
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
          <CardDescription>View and manage portal access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Select Scholar</Label>
              <Select onValueChange={(id) => setSelectedStudent(students.find(s => s.id === id) || null)}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Select a student" /></SelectTrigger>
                <SelectContent>
                  {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} (Class {s.class})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            {selectedStudent && (
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</p>
                    <p className="text-sm font-black text-slate-900 italic">{selectedStudent.username}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Login Key</p>
                    <p className="text-sm font-black text-indigo-600 italic tracking-tighter">{selectedStudent.password}</p>
                  </div>
                </div>
                <Button className="w-full bg-white border border-slate-200 text-slate-900 h-11 hover:bg-slate-100 font-bold" onClick={() => {
                  const text = `Hello ${selectedStudent.name}, your Rupak Math Portal login details:\nUsername: ${selectedStudent.username}\nPassword: ${selectedStudent.password}`;
                  window.open(`https://wa.me/${selectedStudent.whatsapp}?text=${encodeURIComponent(text)}`);
                }}>
                  <MessageCircle className="w-4 h-4 mr-2" /> Share via WhatsApp
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active ? 'bg-indigo-800 text-white' : 'text-indigo-300 hover:bg-indigo-800/50 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function AddStudentForm({ user, users, setUsers, onAdd, onBack, students }: { user: User, users: User[], setUsers: (u: User[]) => void, onAdd: (s: Partial<User>) => void, onBack: () => void, students: User[] }) {
  const [formData, setFormData] = useState({ 
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

function AdminChatSection({ initialGroup }: { initialGroup?: string | null }) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(initialGroup || null);
  const [groups, setGroups] = useState(['Global Chat', 'Infinity Class 5', 'Infinity Class 6', 'Infinity Class 7', 'Infinity Class 8', 'Infinity Class 9', 'Infinity Class 10', 'Infinity Class 11', 'Infinity Class 12']);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages(store.getMessages());
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
        setGroups([...groups, timeGroup]);
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
      setGroups([...groups, nextBranch]);
      setSelectedGroup(nextBranch);
      toast.success(`Created branch ${nextBranch}`);
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
            <button 
              key={group} 
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
                <div>
                  <p className="font-black text-slate-900 uppercase italic tracking-tight">{selectedGroup}</p>
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
    <Card>
      <CardHeader>
        <CardTitle>Due List</CardTitle>
        <CardDescription>
          {isAfter15th ? 'Showing students with pending dues after 15th' : 'Monthly due list (Updates on 15th)'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dueStudents.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>Class {s.class}</TableCell>
                <TableCell>{s.whatsapp}</TableCell>
                <TableCell><Badge variant="destructive">Unpaid</Badge></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-1">
                      <DropdownMenuItem className="gap-2" onClick={() => onRemind(s.whatsapp)}>
                        <MessageSquare className="w-4 h-4 text-green-600" /> <span>Send Reminder</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => onSelectStudent(s)}>
                        <UserIcon className="w-4 h-4 text-blue-600" /> <span>View Details</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {dueStudents.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-slate-400 py-10">All students have paid!</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ReceivePaymentSection({ students, onTogglePayment, onWhatsApp, onSelectStudent }: { students: User[], onTogglePayment: (id: string) => void, onWhatsApp: (phone: string) => void, onSelectStudent: (u: User) => void }) {
  const [search, setSearch] = useState('');
  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Receive Payment</CardTitle>
            <CardDescription>Mark student payments by ticking their name</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Search student..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Tick</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell>
                  <Checkbox checked={s.paymentStatus === 'paid'} onCheckedChange={() => onTogglePayment(s.id)} />
                </TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>Class {s.class}</TableCell>
                <TableCell>
                  <Badge variant={s.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                    {s.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-1">
                      <DropdownMenuItem className="gap-2" onClick={() => onTogglePayment(s.id)}>
                        <CheckCircle2 className={`w-4 h-4 ${s.paymentStatus === 'paid' ? 'text-red-500' : 'text-emerald-500'}`} /> 
                        <span>{s.paymentStatus === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => onWhatsApp(s.whatsapp)}>
                        <MessageSquare className="w-4 h-4 text-green-600" /> <span>WhatsApp Receipt</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2" onClick={() => onSelectStudent(s)}>
                        <UserIcon className="w-4 h-4 text-blue-600" /> <span>Student Biography</span>
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
  );
}

function NotesSection({ user, notes, onAdd }: { user: User, notes: Note[], onAdd: (n: Note) => void }) {
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
      createdAt: Date.now()
    };
    onAdd(note);
    setTitle('');
    setContent('');
    setFileUrl('');
    toast.success('Note published successfully');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-xl border-white/40 bg-white/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl font-black tracking-tight">Create Study Material</CardTitle>
          <CardDescription>Share notes or files with your students</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="font-bold">Note Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Trigonometry Basics" required className="h-12" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">Target Class</Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['5', '6', '7', '8', '9', '10', '11', '12'].map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Submission Type</Label>
                <Tabs value={noteType} onValueChange={(v) => setNoteType(v as 'text' | 'file')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-12">
                    <TabsTrigger value="text" className="font-bold">Write Note</TabsTrigger>
                    <TabsTrigger value="file" className="font-bold">Add File</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {noteType === 'text' ? (
              <div className="space-y-2">
                <Label className="font-bold">Content</Label>
                <textarea 
                  className="w-full min-h-[200px] p-4 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Write your study notes here..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="font-bold">File URL / Link</Label>
                <div className="flex gap-2">
                  <Input 
                    value={fileUrl} 
                    onChange={e => setFileUrl(e.target.value)} 
                    placeholder="Paste Google Drive or PDF link here" 
                    required 
                    className="h-12"
                  />
                  <Button type="button" variant="outline" className="h-12 px-4" onClick={() => toast.info('File upload simulation: Link captured!')}>
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-slate-500 italic">Students will be able to download or view this file directly.</p>
              </div>
            )}
            
            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-200">
              <Send className="w-4 h-4 mr-2" /> Publish Material
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-white/40 bg-white/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl font-black tracking-tight">Published Materials</CardTitle>
          <CardDescription>All study resources shared so far</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {notes.map(note => (
                <div key={note.id} className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${note.type === 'file' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        {note.type === 'file' ? <FileText className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                      </div>
                      <h4 className="font-black text-slate-900">{note.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none">Class {note.classId}</Badge>
                      {user.isSubscriptionPaid && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600 hover:bg-blue-50" onClick={() => {
                            const newTitle = prompt('Edit Title:', note.title);
                            if (newTitle) {
                              toast.info('Update logic would sync to store here.');
                            }
                          }}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:bg-red-50" onClick={() => {
                            if (confirm('Delete this note?')) {
                              toast.success('Note deleted');
                            }
                          }}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {note.type === 'file' ? `Attached File: ${note.fileUrl}` : note.content}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    {note.type === 'file' && (
                      <Button variant="ghost" size="sm" className="text-blue-600 font-bold h-8" onClick={() => window.open(note.fileUrl, '_blank')}>
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                  <p>No materials published yet</p>
                </div>
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

function ResultsSection({ results }: { results: Result[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Results</CardTitle>
        <CardDescription>Student performance across all exams</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Exam</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map(res => (
              <TableRow key={res.id}>
                <TableCell className="font-medium">{res.studentName}</TableCell>
                <TableCell>{res.examTitle}</TableCell>
                <TableCell>
                  <Badge variant={res.score / res.total >= 0.4 ? 'default' : 'destructive'}>
                    {res.score}/{res.total}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(res.timestamp).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {results.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-10">No results yet</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
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
