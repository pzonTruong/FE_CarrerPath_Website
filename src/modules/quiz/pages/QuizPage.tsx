import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { quizApi } from '../api/quiz.api';
import type { QuizQuestion, SubmitQuizResult } from '../api/quiz.api';
import {
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Target,
  TrendingUp,
  ListChecks,
  History,
  RotateCcw,
  ClipboardCheck,
  Flag
} from 'lucide-react';

const readinessMeta = {
  beginner: { label: 'Beginner', className: 'border-red-700 bg-red-100 text-red-700' },
  developing: { label: 'Developing', className: 'border-yellow-700 bg-yellow-100 text-yellow-700' },
  ready: { label: 'Ready', className: 'border-green-700 bg-green-100 text-green-700' }
};

const priorityMeta = {
  review: { label: 'Review', className: 'border-red-700 bg-red-100 text-red-700' },
  learn: { label: 'Learn', className: 'border-blue-700 bg-blue-100 text-blue-700' },
  practice: { label: 'Practice', className: 'border-green-700 bg-green-100 text-green-700' }
};

type SubmitModalStage = 'idle' | 'submitting' | 'success';

export const QuizPage: React.FC = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const [searchParams] = useSearchParams();
  const careerId = searchParams.get('careerId');
  const stepId = searchParams.get('stepId');
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(900);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitModalStage, setSubmitModalStage] = useState<SubmitModalStage>('idle');
  const [submitProgress, setSubmitProgress] = useState(0);
  const [result, setResult] = useState<SubmitQuizResult | null>(null);
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<string[]>([]);

  const answeredCount = Object.keys(answers).length;

  const handleSubmit = async () => {
    if (!skillId || !careerId || !stepId) {
      setError('Missing required parameters for submission.');
      return;
    }

    setIsSubmitting(true);
    setSubmitModalStage('submitting');
    setSubmitProgress(8);

    try {
      const response = await quizApi.submitQuiz({
        careerId,
        stepId,
        skillId,
        answers
      });

      setSubmitProgress(100);
      window.setTimeout(() => {
        setResult(response.data.data);
        setSubmitModalStage('success');
        setIsSubmitting(false);
      }, 750);
    } catch (err: any) {
      setSubmitModalStage('idle');
      setSubmitProgress(0);
      setError(err.message || 'Failed to submit quiz.');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!skillId) return;

    const fetchQuestions = async () => {
      try {
        const response = await quizApi.getQuizzes(skillId);
        setQuestions(response.data.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [skillId]);

  useEffect(() => {
    if (submitModalStage !== 'submitting') return;

    const timer = window.setInterval(() => {
      setSubmitProgress((current) => Math.min(current + 9, 92));
    }, 180);

    return () => window.clearInterval(timer);
  }, [submitModalStage]);

  useEffect(() => {
    if (loading || result || isSubmitting) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timeLeft, loading, result, isSubmitting]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (result || isSubmitting) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setAnswers({});
    setFlaggedQuestionIds([]);
    setCurrentIndex(0);
    setTimeLeft(900);
    setSubmitModalStage('idle');
    setSubmitProgress(0);
  };

  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestionIds((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId]
    );
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatAttemptDate = (value: string) =>
    new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));

  const renderSubmitModal = () => {
    if (submitModalStage === 'idle') return null;

    const modalResult = result;
    const needsImprovement = modalResult ? modalResult.percentageScore < 80 : false;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-[8px] border-2 border-foreground bg-background p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          {submitModalStage === 'submitting' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-foreground bg-primary text-primary-foreground">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-mono text-lg font-bold uppercase">Đang nộp bài</h2>
                  <p className="text-sm text-muted-foreground">Hệ thống đang chấm điểm và tạo learning plan.</p>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between font-mono text-xs font-bold uppercase">
                  <span>Processing</span>
                  <span>{submitProgress}%</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full border-2 border-foreground bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${submitProgress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded border border-border p-2">
                  <div className="font-mono font-bold">{answeredCount}/{questions.length}</div>
                  <div className="text-muted-foreground">Answered</div>
                </div>
                <div className="rounded border border-border p-2">
                  <div className="font-mono font-bold">{formatTime(timeLeft)}</div>
                  <div className="text-muted-foreground">Time left</div>
                </div>
                <div className="rounded border border-border p-2">
                  <div className="font-mono font-bold">AI</div>
                  <div className="text-muted-foreground">Analysis</div>
                </div>
              </div>
            </div>
          )}

          {submitModalStage === 'success' && modalResult && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                {modalResult.isPassed ? (
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-500" />
                )}
                <div>
                  <h2 className="font-mono text-lg font-bold uppercase">Nộp bài thành công</h2>
                  <p className="text-sm text-muted-foreground">
                    {modalResult.isPassed ? 'Bạn đã qua bài kiểm tra này.' : 'Bạn cần cải thiện thêm trước khi qua node này.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded border-2 border-foreground p-3 text-center">
                  <div className="font-mono text-2xl font-bold">{modalResult.score}/{modalResult.totalQuestions}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
                <div className="rounded border-2 border-foreground p-3 text-center">
                  <div className="font-mono text-2xl font-bold">{modalResult.percentageScore.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Percent</div>
                </div>
                <div className="rounded border-2 border-foreground p-3 text-center">
                  <div className="font-mono text-2xl font-bold">{modalResult.learningPath?.estimatedStudyHours ?? 0}h</div>
                  <div className="text-xs text-muted-foreground">Study</div>
                </div>
              </div>

              <div className={`rounded border-2 p-3 text-sm ${needsImprovement ? 'border-red-700 bg-red-50 text-red-800' : 'border-green-700 bg-green-50 text-green-800'}`}>
                <span className="font-bold">Điểm hiện tại: {modalResult.score}/{modalResult.totalQuestions}. </span>
                {needsImprovement
                  ? 'Cần xem lại skill gaps, làm checkpoints và retake để đạt tối thiểu 8/10.'
                  : 'Đã đạt yêu cầu. Bạn có thể tiếp tục roadmap hoặc xem learning plan để học chắc hơn.'}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => setSubmitModalStage('idle')}
                  className="flex-1 rounded border-2 border-foreground bg-primary px-4 py-3 font-mono text-xs font-bold uppercase text-primary-foreground"
                >
                  Xem kết quả chi tiết
                </button>
                <button
                  onClick={handleRetake}
                  className="flex-1 rounded border-2 border-foreground px-4 py-3 font-mono text-xs font-bold uppercase"
                >
                  Làm lại
                </button>
                <button
                  onClick={() => setSubmitModalStage('idle')}
                  className="flex-1 rounded border-2 border-foreground px-4 py-3 font-mono text-xs font-bold uppercase"
                >
                  Đóng popup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <div className="text-xl font-bold text-destructive">Load failed</div>
        <div className="text-muted-foreground">{error}</div>
        <button onClick={() => navigate(-1)} className="rounded bg-primary px-4 py-2 text-primary-foreground">
          Back
        </button>
      </div>
    );
  }

  if (result) {
    const needsImprovement = result.percentageScore < 80;
    const historyItems = result.quizHistory ?? [];

    return (
      <div className="mx-auto max-w-4xl">
        {renderSubmitModal()}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate(`/roadmap/${careerId}`)}
            className="inline-flex items-center gap-2 rounded border-2 border-foreground px-4 py-2 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to roadmap
          </button>
          <button
            onClick={handleRetake}
            className="inline-flex items-center gap-2 rounded border-2 border-foreground bg-primary px-4 py-2 font-mono text-xs font-bold uppercase text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          >
            <RotateCcw className="h-4 w-4" />
            Retake
          </button>
          <button
            onClick={() => setSubmitModalStage('success')}
            className="inline-flex items-center gap-2 rounded border-2 border-foreground px-4 py-2 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-muted"
          >
            <ClipboardCheck className="h-4 w-4" />
            Back to result popup
          </button>
        </div>

        <div className="mb-6 rounded-[8px] border-2 border-foreground bg-background p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-6 flex flex-col items-center text-center">
            {result.isPassed ? (
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            )}
            <h2 className="font-mono text-3xl font-bold uppercase">
              {result.isPassed ? 'Passed' : 'Needs review'}
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              {result.isPassed
                ? 'Great work. Your progress was updated and the AI plan below can help you keep momentum.'
                : 'You need at least 80% to pass. Use the AI plan below, then retake the quiz.'}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[6px] border-2 border-foreground p-4 text-center">
              <div className="mb-1 text-sm font-bold uppercase">Score</div>
              <div className="font-mono text-3xl font-bold">{result.percentageScore.toFixed(0)}%</div>
            </div>
            <div className="rounded-[6px] border-2 border-foreground p-4 text-center">
              <div className="mb-1 text-sm font-bold uppercase">Correct answers</div>
              <div className="font-mono text-3xl font-bold">{result.score} / {result.totalQuestions}</div>
            </div>
          </div>

          <div className={`mt-4 rounded-[6px] border-2 p-4 ${needsImprovement ? 'border-red-700 bg-red-50 text-red-800' : 'border-green-700 bg-green-50 text-green-800'}`}>
            <div className="font-mono text-sm font-bold uppercase">
              Điểm hiện tại: {result.score}/{result.totalQuestions}
            </div>
            <p className="mt-1 text-sm">
              {needsImprovement
                ? 'Bạn cần cải thiện thêm nhiều phần khác trước khi qua node này. Ưu tiên các skill gaps và checkpoints bên dưới, sau đó làm lại bài để đạt tối thiểu 8/10.'
                : 'Bạn đã đạt mốc yêu cầu. Có thể tiếp tục roadmap, nhưng vẫn nên xem lại các gợi ý để học chắc hơn.'}
            </p>
          </div>
        </div>

        {result.learningPath && (
          <div className="mb-8 overflow-hidden rounded-[8px] border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-foreground bg-primary/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-mono text-sm font-bold uppercase">AI Learning Plan</h3>
              </div>
              <span className="rounded border border-foreground bg-background px-2 py-1 text-[11px] font-bold uppercase">
                {result.learningPath.source === 'ai' ? 'Gemini' : 'Fallback'}
              </span>
            </div>

            <div className="space-y-5 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{result.learningPath.summary}</p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[6px] border-2 border-foreground p-3">
                  <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase">
                    <Target className="h-4 w-4 text-primary" />
                    Readiness
                  </div>
                  <span className={`inline-flex rounded border-2 px-2 py-1 text-xs font-bold ${readinessMeta[result.learningPath.readinessLevel].className}`}>
                    {readinessMeta[result.learningPath.readinessLevel].label}
                  </span>
                </div>
                <div className="rounded-[6px] border-2 border-foreground p-3">
                  <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Confidence
                  </div>
                  <div className="font-mono text-2xl font-bold">{result.learningPath.confidenceScore}%</div>
                </div>
                <div className="rounded-[6px] border-2 border-foreground p-3">
                  <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase">
                    <Clock className="h-4 w-4 text-primary" />
                    Study time
                  </div>
                  <div className="font-mono text-2xl font-bold">{result.learningPath.estimatedStudyHours}h</div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[6px] border-2 border-foreground p-4">
                  <div className="mb-2 font-mono text-xs font-bold uppercase">Skill gaps</div>
                  <div className="flex flex-wrap gap-2">
                    {result.learningPath.weakSkills.map((skill) => (
                      <span key={skill} className="rounded border-2 border-foreground bg-background px-3 py-1 text-xs font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[6px] border-2 border-foreground p-4">
                  <div className="mb-2 font-mono text-xs font-bold uppercase">Strengths</div>
                  <div className="flex flex-wrap gap-2">
                    {result.learningPath.strengths.map((strength) => (
                      <span key={strength} className="rounded border-2 border-green-700 bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[6px] border-2 border-foreground p-4">
                <div className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase">
                  <ListChecks className="h-4 w-4 text-primary" />
                  Next actions
                </div>
                <div className="grid gap-2">
                  {result.learningPath.nextActions.map((action, index) => (
                    <div key={action} className="flex gap-3 text-sm">
                      <span className="font-mono font-bold text-primary">{String(index + 1).padStart(2, '0')}</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {result.learningPath.recommendedSteps.map((step, index) => (
                  <div key={step.stepId} className="rounded-[6px] border-2 border-foreground p-4">
                    <div className="mb-3 flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-primary text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h4 className="font-bold">{step.title}</h4>
                          <span className={`rounded border-2 px-2 py-0.5 text-[11px] font-bold uppercase ${priorityMeta[step.priority].className}`}>
                            {priorityMeta[step.priority].label}
                          </span>
                          <span className="rounded border border-foreground px-2 py-0.5 text-[11px] font-bold">
                            {step.estimatedHours}h
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.reason}</p>
                        <div className="mt-3 rounded border border-dashed border-foreground/50 bg-muted/40 px-3 py-2 text-sm">
                          <span className="font-bold">Checkpoint: </span>
                          {step.checkpoint}
                        </div>
                      </div>
                    </div>

                    {step.resources.length > 0 && (
                      <div className="mt-3 grid gap-2">
                        {step.resources.map((resource) => (
                          <a
                            key={resource.url}
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded border border-border px-3 py-2 text-sm hover:bg-muted"
                          >
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="font-medium">{resource.title}</span>
                            <span className="ml-auto text-xs text-muted-foreground">{resource.sourceName}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 rounded-[8px] border-2 border-foreground bg-background p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <h3 className="font-mono text-sm font-bold uppercase">Lịch sử làm bài</h3>
            </div>
            <span className="rounded border border-foreground px-2 py-1 text-[11px] font-bold uppercase">
              {historyItems.length} attempts
            </span>
          </div>

          {historyItems.length > 0 ? (
            <div className="grid gap-2">
              {historyItems.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded border border-border px-3 py-2 text-sm"
                >
                  <span className="font-mono font-bold text-primary">#{historyItems.length - index}</span>
                  <div>
                    <div className="font-bold">
                      {item.score}/{item.totalQuestions} ({item.percentageScore.toFixed(0)}%)
                    </div>
                    <div className="text-xs text-muted-foreground">{formatAttemptDate(item.createdAt)}</div>
                  </div>
                  <span className={`rounded border px-2 py-1 text-[11px] font-bold uppercase ${
                    item.passed ? 'border-green-700 bg-green-100 text-green-700' : 'border-red-700 bg-red-100 text-red-700'
                  }`}>
                    {item.passed ? 'Pass' : 'Review'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có lịch sử cho bài quiz này.</p>
          )}
        </div>

        <button
          onClick={() => navigate(`/roadmap/${careerId}`)}
          className="w-full border-2 border-foreground bg-primary py-3 font-mono text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          Back to roadmap
        </button>
      </div>
    );
  }

  if (!questions.length) return null;

  const currentQuestion = questions[currentIndex];
  const progressPercentage = (answeredCount / questions.length) * 100;

  return (
    <div className="mx-auto max-w-6xl">
      {renderSubmitModal()}

      <button
        onClick={() => navigate(`/roadmap/${careerId}`)}
        className="mb-4 inline-flex items-center gap-2 rounded border-2 border-foreground px-4 py-2 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to roadmap
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-mono text-2xl font-bold uppercase">Quiz</h1>
        <div className={`flex items-center gap-2 rounded border-2 border-foreground px-4 py-2 font-mono text-lg font-bold ${timeLeft < 60 ? 'border-red-500 text-red-500' : ''}`}>
          <Clock className="h-5 w-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex justify-between font-mono text-sm font-bold">
          <span>Progress</span>
          <span>{answeredCount} / {questions.length} answered</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full border-2 border-foreground bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="mb-6 min-h-[300px] rounded-[8px] border-2 border-foreground bg-background p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-6 flex items-center gap-2">
          <span className="rounded border-2 border-primary bg-primary/10 px-3 py-1 font-mono text-sm font-bold text-primary">Question {currentIndex + 1}</span>
          <span className={`rounded border-2 px-3 py-1 font-mono text-xs font-bold ${
            currentQuestion.difficulty === 'Easy' ? 'border-green-700 bg-green-100 text-green-700' :
            currentQuestion.difficulty === 'Medium' ? 'border-yellow-700 bg-yellow-100 text-yellow-700' :
            'border-red-700 bg-red-100 text-red-700'
          }`}>
            {currentQuestion.difficulty}
          </span>
          <button
            type="button"
            onClick={() => handleToggleFlag(currentQuestion.id)}
            className={`ml-auto inline-flex items-center gap-2 rounded border-2 px-3 py-1 font-mono text-xs font-bold uppercase ${
              flaggedQuestionIds.includes(currentQuestion.id)
                ? 'border-yellow-700 bg-yellow-100 text-yellow-800'
                : 'border-foreground bg-background hover:bg-muted'
            }`}
          >
            <Flag className="h-4 w-4" />
            {flaggedQuestionIds.includes(currentQuestion.id) ? 'Flagged' : 'Flag'}
          </button>
        </div>

        <h3 className="mb-8 text-xl font-medium leading-relaxed">{currentQuestion.questionText}</h3>

        <div className="flex flex-col gap-4">
          {currentQuestion.options.map((opt, i) => (
            <label
              key={i}
              className={`flex cursor-pointer items-center rounded-[4px] border-2 p-4 transition-all ${
                answers[currentQuestion.id] === i
                  ? 'translate-x-[-2px] translate-y-[-2px] border-primary bg-primary/5 shadow-[2px_2px_0px_0px_var(--theme-primary)]'
                  : 'border-muted-foreground/30 hover:border-foreground hover:bg-muted'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                className="hidden"
                checked={answers[currentQuestion.id] === i}
                onChange={() => handleSelectOption(currentQuestion.id, i)}
              />
              <div className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border-2 ${answers[currentQuestion.id] === i ? 'border-primary bg-primary' : 'border-muted-foreground/50'}`}>
                {answers[currentQuestion.id] === i && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
              </div>
              <span className="text-base">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0 || isSubmitting}
          className="flex items-center gap-2 border-2 border-foreground px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-muted disabled:opacity-50 disabled:shadow-none"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || answeredCount < questions.length}
            className="flex items-center gap-2 border-2 border-foreground bg-primary px-8 py-3 font-mono text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <ClipboardCheck className="h-4 w-4" />
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 border-2 border-foreground px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-muted disabled:opacity-50"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[8px] border-2 border-foreground bg-background p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-mono text-sm font-bold uppercase">Review board</div>
              <span className="rounded border border-foreground px-2 py-1 text-[11px] font-bold">
                {answeredCount}/{questions.length}
              </span>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-border p-2">
                <div className="font-mono font-bold">{questions.length - answeredCount}</div>
                <div className="text-muted-foreground">Chưa làm</div>
              </div>
              <div className="rounded border border-border p-2">
                <div className="font-mono font-bold">{flaggedQuestionIds.length}</div>
                <div className="text-muted-foreground">Gắn cờ</div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const isAnswered = answers[question.id] !== undefined;
                const isFlagged = flaggedQuestionIds.includes(question.id);
                const isCurrent = currentIndex === index;

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`relative flex h-10 items-center justify-center rounded border-2 font-mono text-xs font-bold ${
                      isCurrent
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isAnswered
                          ? 'border-green-700 bg-green-100 text-green-700'
                          : 'border-foreground bg-background text-foreground hover:bg-muted'
                    }`}
                    title={`Question ${index + 1}${isFlagged ? ' - flagged' : ''}`}
                  >
                    {index + 1}
                    {isFlagged && (
                      <Flag className="absolute -right-1 -top-1 h-3 w-3 fill-yellow-400 text-yellow-700" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded border border-green-700 bg-green-100" />
                Đã làm
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded border border-foreground bg-background" />
                Chưa làm
              </div>
              <div className="flex items-center gap-2">
                <Flag className="h-3 w-3 fill-yellow-400 text-yellow-700" />
                Gắn cờ để xem lại
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
