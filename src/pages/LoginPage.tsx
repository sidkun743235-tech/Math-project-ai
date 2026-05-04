import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/Logo';
import { MessageSquare, Send, Calculator, LogIn, Crown, ShieldCheck, QrCode, Upload, CheckCircle2 } from 'lucide-react';
import { store } from '@/lib/store';
import { User, Message } from '@/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatName, setChatName] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    setMessages(store.getMessages());
    const interval = setInterval(() => {
      setMessages(store.getMessages());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = store.getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      if (user.needsPasswordSetup) {
        // This shouldn't normally happen at login unless they didn't finish setup
        onLogin(user);
        navigate('/admin'); // Dashboard should handle setup if still needed
        return;
      }
      store.setCurrentUser(user);
      onLogin(user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/student');
    } else {
      toast.error('Invalid username or password');
    }
  };

  const handleAdminDemo = () => {
    const users = store.getUsers();
    const admin = users.find(u => u.username === 'admin');
    if (admin) {
      store.setCurrentUser(admin);
      onLogin(admin);
      toast.success('Entering Admin Demo Mode');
      navigate('/admin');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatName.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      senderId: 'anonymous',
      senderName: chatName,
      classId: 'global',
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, msg];
    store.setMessages(updatedMessages);
    setMessages(updatedMessages);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-indigo-950 flex flex-col items-center justify-center p-4 relative touch-pan-y">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Branding */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-6 text-center"
        >
          <Logo size="lg" className="mb-2" />
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white bg-clip-text text-transparent bg-linear-to-b from-white to-white/60 uppercase italic leading-none">
              INFINITY BONGAON
            </h1>
            <p className="text-blue-400 font-black tracking-[0.5em] uppercase text-xs sm:text-sm">
              practice makes perfect
            </p>
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-2xl border-white/10 bg-white/5 backdrop-blur-2xl text-white">
            <CardHeader className="space-y-1 text-center border-b border-white/5 pb-4">
              <CardTitle className="text-2xl font-bold tracking-tight">Portal Login</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Access your personalized dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-slate-300 text-xs ml-1">Username</Label>
                  <Input 
                    id="username" 
                    placeholder="admin or student" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-11 focus:ring-blue-500/50"
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-slate-300 text-xs ml-1">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-11 focus:ring-blue-500/50"
                    required 
                  />
                </div>
                <Button type="submit" className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 h-12 text-sm font-bold shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98]">
                  Sign In
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-white/5 pt-4">
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button variant="outline" className="h-14 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl flex flex-col items-center justify-center p-2 group" onClick={handleAdminDemo}>
                  <LogIn className="w-4 h-4 text-blue-400 group-hover:scale-110 mb-1 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Admin Demo</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-14 bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20 rounded-xl flex flex-col items-center justify-center p-2 group" 
                  onClick={() => navigate("/admin-payment")}
                >
                  <Crown className="w-4 h-4 text-yellow-500 group-hover:scale-110 mb-1 transition-transform animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">New Admin</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Global Access Section */}
        <div className="grid grid-cols-1 gap-3">
          {/* Community Hub Button */}
          <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
            <SheetTrigger render={
              <Button variant="outline" className="w-full h-14 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white rounded-2xl gap-3 group transition-all" />
            }>
              <div className="bg-indigo-500/20 p-2 rounded-lg group-hover:bg-indigo-500/40 transition-colors">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-sm">Community Hub</p>
                <p className="text-[10px] text-slate-400">Connect with everyone instantly</p>
              </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] bg-slate-950 border-white/10 text-white rounded-t-[32px] p-0 overflow-hidden">
              <div className="h-full flex flex-col">
                <SheetHeader className="p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl">
                  <SheetTitle className="text-white flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    Community Hub
                  </SheetTitle>
                  <SheetDescription className="text-slate-400">
                    Join the conversation. Chat now with students and teachers.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="flex-1 overflow-hidden p-6 bg-linear-to-b from-slate-950 to-indigo-950/20">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-6">
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                            <MessageSquare className="w-10 h-10 opacity-20" />
                          </div>
                          <p className="text-sm font-medium">No messages yet. Be the first to say hi!</p>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <div key={msg.id} className="flex gap-4">
                            <Avatar className="w-10 h-10 border border-white/10">
                              <AvatarFallback className="bg-indigo-600 text-white font-bold">
                                {msg.senderName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-baseline gap-3">
                                <span className="font-bold text-indigo-400">{msg.senderName}</span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none mt-2 text-slate-200 leading-relaxed shadow-sm">
                                {msg.text}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <div className="p-6 border-t border-white/5 bg-slate-900/80 backdrop-blur-2xl">
                  <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input 
                        placeholder="Your Name" 
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-12 md:col-span-1 border-indigo-500/20"
                      />
                      <div className="flex gap-2 md:col-span-3">
                        <Input 
                          placeholder="Type a message..." 
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="bg-white/5 border-white/10 text-white h-12 flex-1"
                        />
                        <Button type="submit" size="icon" className="bg-indigo-600 hover:bg-indigo-700 h-12 w-12 shrink-0 rounded-xl shadow-lg shadow-indigo-500/20">
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
