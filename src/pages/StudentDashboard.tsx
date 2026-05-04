import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  CreditCard, 
  LogOut, 
  MessageCircle, 
  Bell,
  Clock,
  CheckCircle2,
  ChevronRight,
  Trophy,
  Download,
  Users,
  Award,
  MoreVertical,
  Settings,
  HelpCircle,
  Paperclip,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { store } from '@/lib/store';
import { User, Exam, Result, Note, Message, PaymentConfig } from '@/types';
import { toast } from 'sonner';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [payConfig, setPayConfig] = useState<PaymentConfig>(store.getPaymentConfig());
  const navigate = useNavigate();

  useEffect(() => {
    const allExams = store.getExams();
    const allResults = store.getResults();
    const allNotes = store.getNotes();

    setExams(allExams.filter(e => e.classId === user.class && e.published));
    setResults(allResults.filter(r => r.studentId === user.id));
    setNotes(allNotes.filter(n => n.classId === user.class && (n.isPublished !== false)));
  }, [user.class, user.id]);

  const handleStartExam = (examId: string) => {
    navigate(`/exam/${examId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-slate-900 text-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <Logo size="xs" className="border-2 border-blue-500/50" />
          <div className="flex flex-col">
            <h1 className="font-black text-lg sm:text-xl leading-tight tracking-tighter italic whitespace-nowrap">INFINITY BONGAON</h1>
            <p className="text-[9px] text-blue-400 uppercase font-black tracking-[0.3em] leading-none">Practice makes perfect</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative text-white/70 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-slate-900 animate-pulse"></span>
          </Button>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger render={
              <button className="flex items-center justify-center h-10 w-10 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            } />
              <SheetContent side="right" className="bg-slate-950 text-white border-none p-0 w-72 shadow-2xl">
                <SheetHeader className="p-6 border-b border-white/5 bg-white/5 text-left">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-indigo-500 shadow-xl">
                      <AvatarFallback className="bg-indigo-600 text-white font-black text-lg">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <SheetTitle className="text-white text-base font-black uppercase italic tracking-tight leading-none mb-1">{user.name}</SheetTitle>
                      <SheetDescription className="text-indigo-400 text-[10px] uppercase font-bold tracking-widest">Class {user.class} Scholar</SheetDescription>
                    </div>
                  </div>
                </SheetHeader>
                <div className="p-4 space-y-6">
                  <div className="space-y-1">
                    <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Navigation</p>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-11 hover:bg-white/10 text-slate-300" onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-11 hover:bg-white/10 text-slate-300" onClick={() => { setActiveTab('exams'); setIsMenuOpen(false); }}>
                      <FileText className="w-4 h-4" /> My Exams
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-11 hover:bg-white/10 text-slate-300" onClick={() => { setActiveTab('notes'); setIsMenuOpen(false); }}>
                      <BookOpen className="w-4 h-4" /> Study Notes
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-11 hover:bg-white/10 text-slate-300" onClick={() => { setActiveTab('due'); setIsMenuOpen(false); }}>
                      <CreditCard className="w-4 h-4" /> My Dues
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-11 hover:bg-white/10 text-slate-300" onClick={() => { setActiveTab('results'); setIsMenuOpen(false); }}>
                      <Trophy className="w-4 h-4" /> Performance
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Support</p>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-11 hover:bg-white/10 text-slate-300" onClick={() => { setIsMenuOpen(false); window.open('https://wa.me/911234567890', '_blank'); }}>
                      <HelpCircle className="w-4 h-4" /> Help Center
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-11 hover:bg-white/10 text-red-400" onClick={onLogout}>
                      <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-indigo-300">Class {user.class}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-visible">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 bg-white border-r flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="flex-1 p-4 space-y-2">
            <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={<FileText />} label="Exams" active={activeTab === 'exams'} onClick={() => setActiveTab('exams')} />
            <SidebarItem icon={<BookOpen />} label="Notes" active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
            <SidebarItem icon={<CreditCard />} label="My Due" active={activeTab === 'due'} onClick={() => setActiveTab('due')} />
            <SidebarItem icon={<Trophy />} label="Results" active={activeTab === 'results'} onClick={() => setActiveTab('results')} />
            <SidebarItem icon={<Users />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-slate-50 overflow-x-hidden pb-24 md:pb-0">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
              <div key={activeTab}>
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
                      <h2 className="text-3xl font-bold mb-2">Hello, {user.name}!</h2>
                      <p className="text-indigo-100 mb-6">You have {exams.length} upcoming exams and {notes.length} new notes to review.</p>
                      <div className="flex gap-4">
                        <Button className="bg-white text-indigo-600 hover:bg-indigo-50" onClick={() => setActiveTab('exams')}>View Exams</Button>
                        <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => setActiveTab('notes')}>Study Notes</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="md:col-span-2">
                        <CardHeader>
                          <CardTitle>Recent Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {results.slice(0, 3).map(res => (
                              <div key={res.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
                                <div>
                                  <p className="font-semibold">{res.examTitle}</p>
                                  <p className="text-xs text-slate-500">{new Date(res.timestamp).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-indigo-600">{res.score}/{res.total}</p>
                                  <p className="text-[10px] text-slate-400">Score</p>
                                </div>
                              </div>
                            ))}
                            {results.length === 0 && <p className="text-center text-slate-400 py-10">No exam results yet</p>}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Payment Status</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-6">
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${user.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {user.paymentStatus === 'paid' ? <CheckCircle2 className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
                          </div>
                          <h3 className="text-xl font-bold capitalize">{user.paymentStatus}</h3>
                          <p className="text-sm text-slate-500 text-center mt-2">
                            {user.paymentStatus === 'paid' ? 'Your account is up to date.' : 'Monthly fee is pending. Please pay soon.'}
                          </p>
                          <Button className="w-full mt-6" variant={user.paymentStatus === 'paid' ? 'outline' : 'default'} onClick={() => setActiveTab('due')}>
                            {user.paymentStatus === 'paid' ? 'View History' : 'Pay Now'}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === 'exams' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Available Exams</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {exams.map(exam => (
                        <Card key={exam.id} className="overflow-hidden border-t-4 border-t-indigo-600">
                          <CardHeader>
                            <CardTitle>{exam.title}</CardTitle>
                            <CardDescription>Class {exam.classId} • {exam.duration} Minutes</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <FileText className="w-4 h-4" />
                              <span>{exam.questions.length} Questions</span>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" onClick={() => handleStartExam(exam.id)}>Start Exam</Button>
                          </CardFooter>
                        </Card>
                      ))}
                      {exams.length === 0 && <p className="col-span-full text-center text-slate-400 py-20">No exams scheduled for your class</p>}
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-8">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                      <div className="relative z-10">
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-2">Library Hub</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Essential learning resources for Class {user.class}</p>
                      </div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl -mr-20 -mt-20 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {notes.map(note => (
                        <Card key={note.id} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[2rem] overflow-hidden bg-white">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <Badge className="bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {note.type === 'file' ? 'Document' : 'Study Note'}
                              </Badge>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(note.createdAt).toLocaleDateString()}</p>
                            </div>
                            <CardTitle className="text-xl font-black text-slate-800 uppercase italic tracking-tight mt-3">{note.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pb-6">
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 group-hover:bg-blue-50/30 transition-colors">
                              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 font-medium italic">
                                {note.content}
                              </p>
                              
                              {note.type === 'file' && note.fileUrl && (
                                <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                      <Paperclip className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                      <p className="text-[10px] font-black text-slate-900 uppercase">Attached File</p>
                                      <p className="text-[9px] text-slate-400 font-bold uppercase">Resource Link</p>
                                    </div>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    className="bg-slate-900 hover:bg-blue-600 rounded-full h-9 px-5 text-[10px] font-black uppercase tracking-widest transition-all"
                                    onClick={() => window.open(note.fileUrl, '_blank')}
                                  >
                                    <Download className="w-3.5 h-3.5 mr-2" /> Download
                                  </Button>
                                </div>
                              )}
                              
                              {note.type === 'text' && (
                                <div className="mt-4 pt-4 border-t border-slate-200/50">
                                  <details className="group/note">
                                    <summary className="list-none">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="w-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all text-blue-600 cursor-pointer"
                                      >
                                        <div>
                                          <span className="group-open/note:hidden">Read Full Note</span>
                                          <span className="hidden group-open/note:inline">Collapse Note</span>
                                        </div>
                                      </Button>
                                    </summary>
                                    <div className="mt-4 p-4 bg-white rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                                      {note.content}
                                    </div>
                                  </details>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {notes.length === 0 && (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center">
                          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                            <BookOpen className="w-10 h-10 text-slate-300" />
                          </div>
                          <p className="text-slate-400 font-black uppercase italic tracking-widest">No study resources available yet</p>
                          <p className="text-xs text-slate-300 font-bold uppercase mt-2 italic tracking-tighter">Stay tuned for updates from your teacher</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'due' && (
                  <div className="max-w-2xl mx-auto space-y-6">
                    <Card className="border-none shadow-xl overflow-hidden">
                      <div className="h-2 bg-indigo-600" />
                      <CardHeader>
                        <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Payment Portal</CardTitle>
                        <CardDescription>Securely pay your coaching fees</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                           <div className="flex-1 space-y-4">
                              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Balance</p>
                                <p className="text-4xl font-black text-slate-900 italic">₹{user.dueAmount || 500}</p>
                                <Badge className={`mt-3 ${user.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                  {user.paymentStatus.toUpperCase()}
                                </Badge>
                              </div>
                              
                              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-xl text-white">
                                  <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-blue-900">UPI ID</p>
                                  <p className="text-sm font-black text-blue-700">{payConfig.upiId}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => {
                                  navigator.clipboard.writeText(payConfig.upiId);
                                  toast.success('UPI ID copied');
                                }}>
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                           </div>

                           <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Scan to Pay Directly</p>
                              {payConfig.qrCodeUrl ? (
                                <div className="bg-white p-4 rounded-2xl shadow-md mb-4">
                                  <img src={payConfig.qrCodeUrl} alt="Payment QR" className="w-40 h-40 object-contain" />
                                </div>
                              ) : (
                                <div className="w-40 h-40 bg-slate-200 rounded-2xl flex items-center justify-center mb-4 text-center p-4">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase">No QR Uploaded by Admin</span>
                                </div>
                              )}
                              <p className="text-[10px] text-slate-400 font-bold uppercase text-center">Use any UPI App to scan</p>
                           </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-slate-100">
                          <Button 
                            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 text-lg font-black uppercase italic"
                            onClick={() => {
                              window.open(`upi://pay?pa=${payConfig.upiId}&pn=Rupak%20Math&am=${user.dueAmount || 500}&cu=INR`);
                            }}
                          >
                            Pay via UPI App
                          </Button>
                          <Button 
                            variant="outline"
                            className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-bold"
                            onClick={() => {
                              const text = `Hello Sir, I am ${user.name} from Class ${user.class}. I have paid ₹${user.dueAmount || 500} through UPI. Please verify my payment.`;
                              window.open(`https://wa.me/919800820296?text=${encodeURIComponent(text)}`);
                            }}
                          >
                            Confirm via WhatsApp
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'chats' && (
                  <StudentChatSection user={user} />
                )}

                {activeTab === 'profile' && (
                  <div className="max-w-2xl mx-auto space-y-6">
                    <Card>
                      <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                          <Avatar className="h-24 w-24 border-4 border-indigo-100">
                            <AvatarFallback className="text-2xl bg-indigo-600 text-white">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                        <CardDescription>Student Profile</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-xl border">
                            <p className="text-xs text-slate-500 uppercase font-bold">Class</p>
                            <p className="text-lg font-semibold text-indigo-600">{user.class}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border">
                            <p className="text-xs text-slate-500 uppercase font-bold">Username</p>
                            <p className="text-lg font-semibold text-indigo-600">{user.username}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border">
                            <p className="text-xs text-slate-500 uppercase font-bold">WhatsApp</p>
                            <p className="text-lg font-semibold text-indigo-600">{user.whatsapp}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border">
                            <p className="text-xs text-slate-500 uppercase font-bold">Payment</p>
                            <Badge variant={user.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                              {user.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t">
                          <h3 className="font-semibold mb-4">Account Security</h3>
                          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-sm">
                            To change your password or update profile details, please contact your teacher.
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'results' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 leading-none">Result Analytics</h2>
                      <Trophy className="w-6 h-6 text-indigo-600" />
                    </div>

                    <Tabs defaultValue="my-scores" className="w-full">
                      <TabsList className="bg-slate-100/50 p-1 rounded-2xl mb-6">
                        <TabsTrigger value="my-scores" className="rounded-xl font-bold text-xs px-6 py-3">My Performance</TabsTrigger>
                        <TabsTrigger value="class-chart" className="rounded-xl font-bold text-xs px-6 py-3">Class Result Chart</TabsTrigger>
                      </TabsList>

                      <TabsContent value="my-scores">
                        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                  <TableHead className="text-[10px] font-black uppercase">Exam Title</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase">Date</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase">Score</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase text-right">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {results.map(res => (
                                  <TableRow key={res.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-bold text-slate-800 text-xs">{res.examTitle}</TableCell>
                                    <TableCell className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(res.timestamp).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                      <Badge className={`${res.score / res.total >= 0.7 ? 'bg-emerald-500' : 'bg-indigo-600'} text-[10px] font-black h-5`}>
                                        {res.score}/{res.total}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50" onClick={() => navigate(`/results/${res.id}`)}>
                                        Details <ChevronRight className="ml-1 h-3 w-3" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                                {results.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-slate-400 py-20 font-bold uppercase italic tracking-widest text-xs">No exams taken yet</TableCell></TableRow>}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="class-chart">
                        <div className="space-y-6">
                           {store.getExams().filter(e => e.classId === user.class && e.resultsPublished).length === 0 ? (
                             <div className="py-20 text-center bg-white rounded-[2rem] shadow-xl border border-dashed border-slate-200">
                               <p className="text-slate-400 font-black uppercase italic tracking-widest text-sm">No full result charts published yet</p>
                               <p className="text-[10px] text-slate-300 font-bold uppercase mt-2 tracking-widest">Wait for your teacher to publish class rankings</p>
                             </div>
                           ) : (
                             store.getExams().filter(e => e.classId === user.class && e.resultsPublished).map(exam => {
                               const examResults = store.getResults().filter(r => r.examId === exam.id).sort((a, b) => b.score - a.score);
                               
                               return (
                                 <Card key={exam.id} className="border-none shadow-xl rounded-[2rem] overflow-hidden">
                                   <CardHeader className="bg-slate-900 text-white">
                                     <div className="flex justify-between items-center">
                                       <div>
                                         <CardTitle className="text-lg font-black uppercase italic tracking-tight">{exam.title}</CardTitle>
                                         <CardDescription className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Full Class Scoreboard</CardDescription>
                                       </div>
                                       <Award className="w-8 h-8 text-amber-400" />
                                     </div>
                                   </CardHeader>
                                   <CardContent className="p-0">
                                     <Table>
                                       <TableHeader className="bg-slate-50/50">
                                         <TableRow>
                                           <TableHead className="w-12 text-[10px] font-black uppercase">Rank</TableHead>
                                           <TableHead className="text-[10px] font-black uppercase">Student</TableHead>
                                           <TableHead className="text-[10px] font-black uppercase">Score</TableHead>
                                           <TableHead className="text-[10px] font-black uppercase text-right">Badge</TableHead>
                                         </TableRow>
                                       </TableHeader>
                                       <TableBody>
                                         {examResults.map((res, index) => (
                                           <TableRow key={res.id} className={res.studentId === user.id ? "bg-indigo-50/50" : ""}>
                                             <TableCell className="font-black text-slate-400 italic text-sm">#{index + 1}</TableCell>
                                             <TableCell className="font-bold text-slate-800 text-xs">
                                               {res.studentName}
                                               {res.studentId === user.id && <span className="ml-2 text-[8px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full uppercase">You</span>}
                                             </TableCell>
                                             <TableCell className="font-black text-slate-900 text-sm italic">{res.score}/{res.total}</TableCell>
                                             <TableCell className="text-right">
                                               {index === 0 && <Badge className="bg-amber-400 text-amber-950 font-black tracking-tighter italic">GOLD</Badge>}
                                               {index === 1 && <Badge className="bg-slate-300 text-slate-950 font-black tracking-tighter italic">SILVER</Badge>}
                                               {index === 2 && <Badge className="bg-orange-300 text-orange-950 font-black tracking-tighter italic">BRONZE</Badge>}
                                             </TableCell>
                                           </TableRow>
                                         ))}
                                       </TableBody>
                                     </Table>
                                   </CardContent>
                                 </Card>
                               );
                             })
                           )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bar Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-white/10 px-6 py-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest leading-none">Dash</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('exams')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'exams' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <FileText className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest leading-none">Exams</span>
        </button>

        <button 
          onClick={() => setActiveTab('chats')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'chats' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest leading-none">Chat</span>
        </button>

        <button 
          onClick={() => setActiveTab('due')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'due' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <CreditCard className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest leading-none">Dues</span>
        </button>

        <button 
          onClick={() => setIsMenuOpen(true)}
          className="flex flex-col items-center justify-center gap-1 transition-all text-slate-400"
        >
          <MoreVertical className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest leading-none">More</span>
        </button>
      </div>
    </div>
  );
}

function StudentChatSection({ user }: { user: User }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const classGroupName = `Infinity Class ${user.class}`;

  useEffect(() => {
    setMessages(store.getMessages().filter(m => m.classId === classGroupName || m.classId === 'Global Chat'));
  }, [classGroupName]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      text: newMessage,
      timestamp: Date.now(),
      classId: classGroupName
    };

    const updated = [...store.getMessages(), msg];
    store.setMessages(updated);
    setMessages(updated.filter(m => m.classId === classGroupName || m.classId === 'Global Chat'));
    setNewMessage('');
    toast.success('Message sent');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[600px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 italic">
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter shadow-sm">{classGroupName}</h3>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Connect with your peers</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6 bg-slate-50">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                msg.senderId === user.id 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{msg.senderName}</p>
                <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                <p className="text-[8px] font-black uppercase mt-2 opacity-50 tabular-nums">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <Input 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          placeholder="Write deep thoughts..." 
          className="rounded-xl h-11 border-slate-200 focus:ring-blue-500 font-bold"
        />
        <Button type="submit" className="h-11 w-11 rounded-xl p-0 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <span className={active ? 'text-white' : 'text-indigo-600'}>{icon}</span>
      <span className="font-semibold hidden md:block">{label}</span>
    </button>
  );
}
