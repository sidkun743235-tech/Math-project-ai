import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, CheckCircle2, XCircle, ChevronLeft, LayoutDashboard, ListChecks } from 'lucide-react';
import { store } from '@/lib/store';
import { User, Result, Exam } from '@/types';
import { motion } from 'motion/react';

interface ResultsPageProps {
  user: User;
}

export default function ResultsPage({ user }: ResultsPageProps) {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<Result | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [showPosition, setShowPosition] = useState(false);

  useEffect(() => {
    const allResults = store.getResults();
    const foundResult = allResults.find(r => r.id === resultId);
    if (foundResult) {
      setResult(foundResult);
      const allExams = store.getExams();
      setExam(allExams.find(e => e.id === foundResult.examId) || null);

      // Calculate position
      const examResults = allResults
        .filter(r => r.examId === foundResult.examId)
        .sort((a, b) => b.score - a.score);
      const pos = examResults.findIndex(r => r.id === foundResult.id) + 1;
      setPosition(pos);
    } else {
      navigate('/student');
    }
  }, [resultId, navigate]);

  if (!result || !exam) return null;

  const percentage = Math.round((result.score / result.total) * 100);
  const isPassed = percentage >= 40;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className={`h-4 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`} />
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                {isPassed ? <Trophy className="w-10 h-10 text-yellow-500" /> : <XCircle className="w-10 h-10 text-red-500" />}
              </div>
              <CardTitle className="text-3xl font-bold">{isPassed ? 'Congratulations!' : 'Keep Practicing!'}</CardTitle>
              <CardDescription className="text-lg">You completed {result.examTitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-6 rounded-2xl text-center border">
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Score</p>
                  <p className="text-4xl font-black text-indigo-600 mt-1">{result.score}/{result.total}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl text-center border">
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Percentage</p>
                  <p className="text-4xl font-black text-indigo-600 mt-1">{percentage}%</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl text-center border">
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Status</p>
                  <Badge className={`mt-2 text-lg px-4 py-1 ${isPassed ? 'bg-green-600' : 'bg-red-600'}`}>
                    {isPassed ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setShowPosition(true)} className="bg-indigo-600 hover:bg-indigo-700 gap-2 h-12 px-8">
                  <Trophy className="w-5 h-5" /> View My Position
                </Button>
                <Button variant="outline" onClick={() => navigate(user.role === 'admin' ? '/admin' : '/student')} className="gap-2 h-12 px-8">
                  <LayoutDashboard className="w-5 h-5" /> Back to Dashboard
                </Button>
              </div>

              {showPosition && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-indigo-50 border-2 border-indigo-100 p-6 rounded-2xl text-center"
                >
                  <h3 className="text-indigo-900 font-bold text-xl">Your Rank: #{position}</h3>
                  <p className="text-indigo-600 text-sm">Out of {store.getResults().filter(r => r.examId === result.examId).length} students who took this exam</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Answer Key */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ListChecks className="w-6 h-6 text-indigo-600" />
              <CardTitle>Detailed Answer Key</CardTitle>
            </div>
            <CardDescription>Review your answers and learn from mistakes</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="divide-y">
                {exam.questions.map((q, idx) => {
                  const studentAnswer = result.answers[idx];
                  const isCorrect = studentAnswer === q.correctAnswerIndex;

                  return (
                    <div key={q.id} className="p-6 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-semibold text-lg leading-relaxed flex-1">
                          <span className="text-slate-400 mr-2">Q{idx + 1}.</span>
                          {q.text}
                        </h4>
                        {isCorrect ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Correct
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="w-3 h-3" /> Incorrect
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, optIdx) => {
                          const isCorrectOpt = optIdx === q.correctAnswerIndex;
                          const isStudentOpt = optIdx === studentAnswer;

                          let variantClass = 'bg-white border-slate-100';
                          if (isCorrectOpt) variantClass = 'bg-green-50 border-green-200 text-green-800 ring-2 ring-green-500/20';
                          if (isStudentOpt && !isCorrect) variantClass = 'bg-red-50 border-red-200 text-red-800 ring-2 ring-red-500/20';

                          return (
                            <div key={optIdx} className={`p-4 rounded-xl border-2 text-sm font-medium flex justify-between items-center ${variantClass}`}>
                              <span>{opt}</span>
                              {isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                              {isStudentOpt && !isCorrect && <XCircle className="w-4 h-4 text-red-600" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
