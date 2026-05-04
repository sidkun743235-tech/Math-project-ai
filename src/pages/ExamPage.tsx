import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle } from 'lucide-react';
import { store } from '@/lib/store';
import { User, Exam, Result } from '@/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface ExamPageProps {
  user: User;
}

export default function ExamPage({ user }: ExamPageProps) {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const allExams = store.getExams();
    const foundExam = allExams.find(e => e.id === examId);
    if (foundExam) {
      setExam(foundExam);
      setTimeLeft(foundExam.duration * 60);
      setAnswers(new Array(foundExam.questions.length).fill(-1));
    } else {
      toast.error('Exam not found');
      navigate('/student');
    }
  }, [examId, navigate]);

  const handleSubmit = useCallback(() => {
    if (!exam || isFinished) return;
    setIsFinished(true);

    let score = 0;
    exam.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswerIndex) {
        score++;
      }
    });

    const result: Result = {
      id: Date.now().toString(),
      studentId: user.id,
      studentName: user.name,
      examId: exam.id,
      examTitle: exam.title,
      score,
      total: exam.questions.length,
      answers: [...answers],
      timestamp: Date.now()
    };

    const allResults = store.getResults();
    store.setResults([...allResults, result]);
    
    toast.success('Exam submitted successfully!');
    navigate(`/results/${result.id}`);
  }, [exam, answers, isFinished, user, navigate]);

  useEffect(() => {
    if (timeLeft <= 0 && exam && !isFinished) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, exam, isFinished, handleSubmit]);

  if (!exam) return null;

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border shadow-sm sticky top-4 z-20">
          <div className="flex items-center gap-4">
            <Logo size="sm" className="border-2 border-blue-600/50 shadow-sm" />
            <div>
              <h1 className="text-xl font-bold text-slate-800">{exam.title}</h1>
              <p className="text-xs text-slate-500">Question {currentQuestionIndex + 1} of {exam.questions.length}</p>
            </div>
          </div>
          <div className={`flex items-center gap-3 px-6 py-3 rounded-xl font-mono text-xl font-bold border-2 ${timeLeft < 60 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
            <Clock className="w-6 h-6" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <Progress value={progress} className="h-2 rounded-full" />

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={answers[currentQuestionIndex].toString()} 
                  onValueChange={(val) => {
                    const newAnswers = [...answers];
                    newAnswers[currentQuestionIndex] = parseInt(val);
                    setAnswers(newAnswers);
                  }}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, idx) => (
                    <div key={idx} className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-slate-50 ${answers[currentQuestionIndex] === idx ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100'}`}>
                      <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} className="border-indigo-600 text-indigo-600" />
                      <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer font-medium text-lg">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between p-6 bg-slate-50/50">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                
                {currentQuestionIndex === exam.questions.length - 1 ? (
                  <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 gap-2 px-8">
                    Finish Exam <Send className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                    className="gap-2 px-8"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Question Navigator */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Question Navigator</h3>
          <div className="flex flex-wrap gap-2">
            {exam.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-10 h-10 rounded-lg font-bold transition-all border-2 ${
                  currentQuestionIndex === idx 
                    ? 'bg-indigo-600 text-white border-indigo-600 scale-110 shadow-md' 
                    : answers[idx] !== -1
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                      : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 justify-center text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Your progress is automatically saved. Do not refresh the page.</span>
        </div>
      </div>
    </div>
  );
}
