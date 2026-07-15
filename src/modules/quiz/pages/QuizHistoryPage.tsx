import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, ClipboardList, Filter, RotateCcw, Search, Target, TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { quizApi } from '../api/quiz.api';
import type { QuizHistoryItem } from '../api/quiz.api';
import careerPathsData from '@/modules/roadmap/data/careers.json';
import type { CareerPath } from '@/modules/roadmap/types';

const careerPaths = careerPathsData as CareerPath[];

const stepLookup = new Map(
  careerPaths.flatMap((career) =>
    career.roadmapSteps.map((step) => [
      `${career.id}:${step.id}`,
      {
        careerId: career.id,
        careerTitle: career.careerTitle,
        stepId: step.id,
        stepTitle: step.title.replace(/^\d+\.\s*/, '')
      }
    ])
  )
);

type StatusFilter = 'all' | 'passed' | 'review';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--background))',
  border: '2px solid hsl(var(--foreground))',
  borderRadius: 6,
  color: 'hsl(var(--foreground))',
  boxShadow: '3px 3px 0 rgba(0,0,0,0.45)'
};

const chartColors = ['#7c3aed', '#16a34a', '#f59e0b', '#ef4444', '#0ea5e9', '#db2777'];

export const QuizHistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [careerFilter, setCareerFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');
  const [selectedStepKey, setSelectedStepKey] = useState('');

  useEffect(() => {
    quizApi.getHistory()
      .then((response) => setHistory(response.data.data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const decoratedHistory = useMemo(() => {
    return history.map((item) => {
      const meta = stepLookup.get(`${item.careerId}:${item.stepId}`);
      return {
        ...item,
        careerTitle: meta?.careerTitle ?? item.careerId ?? 'Unknown roadmap',
        stepTitle: meta?.stepTitle ?? item.stepId ?? 'Unknown step'
      };
    });
  }, [history]);

  const filteredHistory = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return decoratedHistory.filter((item) => {
      const matchesCareer = careerFilter === 'all' || item.careerId === careerFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'passed' && item.passed) ||
        (statusFilter === 'review' && !item.passed);
      const matchesQuery =
        !normalizedQuery ||
        item.careerTitle.toLowerCase().includes(normalizedQuery) ||
        item.stepTitle.toLowerCase().includes(normalizedQuery);

      return matchesCareer && matchesStatus && matchesQuery;
    });
  }, [careerFilter, decoratedHistory, query, statusFilter]);

  const stats = useMemo(() => {
    const attempts = filteredHistory.length;
    const passed = filteredHistory.filter((item) => item.passed).length;
    const best = attempts > 0 ? Math.max(...filteredHistory.map((item) => item.percentageScore)) : 0;
    const average = attempts > 0
      ? filteredHistory.reduce((sum, item) => sum + item.percentageScore, 0) / attempts
      : 0;
    const needsReview = filteredHistory.filter((item) => item.percentageScore < 80).length;

    return { attempts, passed, best, average, needsReview };
  }, [filteredHistory]);

  const latestByStep = useMemo(() => {
    const seen = new Set<string>();
    return decoratedHistory.filter((item) => {
      const key = `${item.careerId}:${item.stepId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [decoratedHistory]);

  const reviewQueue = latestByStep
    .filter((item) => item.percentageScore < 80)
    .slice(0, 4);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));

  const stepOptions = useMemo(() => {
    const map = new Map<string, { key: string; label: string }>();
    decoratedHistory.forEach((item) => {
      const key = `${item.careerId}:${item.stepId}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          label: `${item.careerTitle} - ${item.stepTitle}`
        });
      }
    });
    return Array.from(map.values());
  }, [decoratedHistory]);

  useEffect(() => {
    if (!selectedStepKey && stepOptions[0]) {
      setSelectedStepKey(stepOptions[0].key);
    }
  }, [selectedStepKey, stepOptions]);

  const selectedStepTrend = useMemo(() => {
    const [careerId, stepId] = selectedStepKey.split(':');
    return decoratedHistory
      .filter((item) => item.careerId === careerId && item.stepId === stepId)
      .slice()
      .reverse()
      .map((item, index) => ({
        attempt: `L${index + 1}`,
        score: Math.round(item.percentageScore),
        rawScore: `${item.score}/${item.totalQuestions}`,
        date: formatDate(item.createdAt)
      }));
  }, [decoratedHistory, selectedStepKey]);

  const comparisonSeries = useMemo(() => {
    const groups = new Map<string, { key: string; name: string; scores: number[] }>();

    decoratedHistory.forEach((item) => {
      const key = `${item.careerId}:${item.stepId}`;
      const existing = groups.get(key) ?? {
        key,
        name: item.stepTitle.length > 18 ? `${item.stepTitle.slice(0, 18)}...` : item.stepTitle,
        scores: []
      };

      existing.scores.push(Math.round(item.percentageScore));
      groups.set(key, existing);
    });

    return Array.from(groups.values())
      .map((item, index) => ({
        ...item,
        dataKey: `quiz${index}`,
        color: chartColors[index % chartColors.length],
        scores: item.scores.slice().reverse()
      }))
      .slice(0, 6);
  }, [decoratedHistory]);

  const comparisonData = useMemo(() => {
    const maxAttempts = Math.max(0, ...comparisonSeries.map((series) => series.scores.length));

    return Array.from({ length: maxAttempts }, (_, index) => {
      const row: Record<string, string | number | null> = { attempt: `L${index + 1}` };
      comparisonSeries.forEach((series) => {
        row[series.dataKey] = series.scores[index] ?? null;
      });
      return row;
    });
  }, [comparisonSeries]);

  const aiInsights = useMemo(() => {
    const insights: string[] = [];
    const latestReview = reviewQueue[0];
    const trendStart = selectedStepTrend[0]?.score;
    const trendEnd = selectedStepTrend[selectedStepTrend.length - 1]?.score;

    if (latestReview) {
      insights.push(`Ưu tiên ôn "${latestReview.stepTitle}" vì lần gần nhất chỉ đạt ${latestReview.score}/${latestReview.totalQuestions}.`);
    }

    if (trendStart !== undefined && trendEnd !== undefined && selectedStepTrend.length >= 2) {
      if (trendEnd > trendStart) {
        insights.push(`Bài đang chọn có xu hướng tăng ${trendEnd - trendStart} điểm phần trăm qua các lần làm.`);
      } else if (trendEnd < trendStart) {
        insights.push(`Bài đang chọn đang giảm ${trendStart - trendEnd} điểm phần trăm, nên xem lại trước khi học tiếp.`);
      } else {
        insights.push('Bài đang chọn đang đi ngang, cần đổi cách ôn thay vì chỉ làm lại quiz.');
      }
    }

    if (stats.average < 80) {
      insights.push(`Điểm trung bình hiện là ${stats.average.toFixed(0)}%, mục tiêu ngắn hạn là kéo lên tối thiểu 80%.`);
    } else if (stats.attempts > 0) {
      insights.push('Hiệu suất tổng quan đã ổn, nên tập trung vào các bài còn gắn Review để làm sạch roadmap.');
    }

    return insights.slice(0, 4);
  }, [reviewQueue, selectedStepTrend, stats.average, stats.attempts]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-[8px] border-2 border-foreground bg-card p-6 text-card-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Quiz Review</span>
            <h1 className="mt-2 font-mono text-3xl font-extrabold uppercase tracking-tight">Tổng quan bài kiểm tra</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Xem lại toàn bộ lịch sử quiz ở tất cả roadmap, lọc theo phần cần cải thiện và quay lại ôn nhanh.
            </p>
          </div>
          <Link
            to="/roadmap"
            className="inline-flex items-center justify-center gap-2 rounded border-2 border-foreground bg-primary px-4 py-3 font-mono text-xs font-bold uppercase text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Browse roadmaps
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[8px] border-2 border-foreground bg-background p-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase">
            <ClipboardList className="h-4 w-4 text-primary" />
            Attempts
          </div>
          <div className="font-mono text-3xl font-bold">{stats.attempts}</div>
        </div>
        <div className="rounded-[8px] border-2 border-foreground bg-background p-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase">
            <Target className="h-4 w-4 text-primary" />
            Passed
          </div>
          <div className="font-mono text-3xl font-bold">{stats.passed}</div>
        </div>
        <div className="rounded-[8px] border-2 border-foreground bg-background p-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase">
            <TrendingUp className="h-4 w-4 text-primary" />
            Best
          </div>
          <div className="font-mono text-3xl font-bold">{stats.best.toFixed(0)}%</div>
        </div>
        <div className="rounded-[8px] border-2 border-foreground bg-background p-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase">
            <BarChart3 className="h-4 w-4 text-primary" />
            Average
          </div>
          <div className="font-mono text-3xl font-bold">{stats.average.toFixed(0)}%</div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="rounded-[8px] border-2 border-foreground bg-background p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-mono text-sm font-bold uppercase">Same quiz trend</div>
              <p className="text-xs text-muted-foreground">Biểu đồ đường so sánh các lần test cùng một bài.</p>
            </div>
            <select
              value={selectedStepKey}
              onChange={(event) => setSelectedStepKey(event.target.value)}
              className="h-10 rounded border-2 border-foreground bg-background px-3 text-xs font-bold"
            >
              {stepOptions.map((option) => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="h-72">
            {selectedStepTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedStepTrend} margin={{ left: 0, right: 18, top: 12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--muted-foreground))" opacity={0.45} />
                  <XAxis dataKey="attempt" tickLine={false} />
                  <YAxis domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ stroke: chartColors[0], strokeWidth: 2, strokeDasharray: '4 4' }}
                    formatter={(value, _name, props) => [`${value}% (${props.payload.rawScore})`, 'Score']}
                    labelFormatter={(label) => `Attempt ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Score"
                    stroke={chartColors[0]}
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2, fill: '#ffffff', stroke: chartColors[0] }}
                    activeDot={{ r: 7, strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Chưa có dữ liệu trend.</div>
            )}
          </div>
        </div>

        <div className="rounded-[8px] border-2 border-foreground bg-background p-4">
          <div className="mb-4">
            <div className="font-mono text-sm font-bold uppercase">AI insights</div>
            <p className="text-xs text-muted-foreground">Các kết luận rút ra từ lịch sử và biểu đồ.</p>
          </div>

          {aiInsights.length > 0 ? (
            <div className="space-y-3">
              {aiInsights.map((insight, index) => (
                <div key={insight} className="rounded border-2 border-foreground bg-muted/40 p-3 text-sm">
                  <span className="mr-2 font-mono font-bold text-primary">{String(index + 1).padStart(2, '0')}</span>
                  {insight}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Làm thêm quiz để hệ thống có đủ dữ liệu phân tích.</p>
          )}
        </div>
      </section>

      <section className="rounded-[8px] border-2 border-foreground bg-background p-4">
        <div className="mb-4">
          <div className="font-mono text-sm font-bold uppercase">Compare quizzes</div>
          <p className="text-xs text-muted-foreground">Biểu đồ đường so sánh điểm trung bình và điểm tốt nhất giữa các bài.</p>
        </div>
        <div className="h-80">
          {comparisonData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData} margin={{ left: 0, right: 18, top: 12, bottom: 20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--muted-foreground))" opacity={0.45} />
                <XAxis dataKey="attempt" tickLine={false} />
                <YAxis domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ stroke: chartColors[0], strokeWidth: 2, strokeDasharray: '4 4' }}
                  formatter={(value, name) => {
                    const series = comparisonSeries.find((item) => item.dataKey === name);
                    return [`${value}%`, series?.name ?? name];
                  }}
                />
                <Legend />
                {comparisonSeries.map((series) => (
                  <Line
                    key={series.dataKey}
                    type="monotone"
                    dataKey={series.dataKey}
                    name={series.name}
                    stroke={series.color}
                    strokeWidth={3}
                    connectNulls
                    dot={{ r: 5, strokeWidth: 2, fill: '#ffffff', stroke: series.color }}
                    activeDot={{ r: 7, strokeWidth: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Chưa có dữ liệu so sánh.</div>
          )}
        </div>
      </section>

      {reviewQueue.length > 0 && (
        <section className="rounded-[8px] border-2 border-amber-500 bg-amber-50 p-4 text-amber-950 dark:border-amber-400 dark:bg-amber-950/30 dark:text-amber-100">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="font-mono text-sm font-bold uppercase">Cần cải thiện trước</div>
            <span className="rounded border border-amber-500 bg-amber-100 px-2 py-1 font-mono text-[11px] font-bold uppercase text-amber-900 dark:border-amber-300 dark:bg-amber-300/15 dark:text-amber-100">
              Priority
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {reviewQueue.map((item) => (
              <div key={`${item.careerId}-${item.stepId}`} className="rounded border-2 border-amber-500 bg-background p-3 text-foreground dark:border-amber-400">
                <div className="font-bold">{item.stepTitle}</div>
                <div className="mt-1 text-sm text-muted-foreground">{item.careerTitle}</div>
                <div className="mt-3 inline-flex rounded border border-amber-500 bg-amber-100 px-2 py-1 font-mono text-xs font-bold text-amber-900 dark:border-amber-300 dark:bg-amber-300/15 dark:text-amber-100">
                  Điểm hiện tại {item.score}/{item.totalQuestions}
                </div>
                <button
                  onClick={() => navigate(`/quiz/${item.stepId}?careerId=${item.careerId}&stepId=${item.stepId}`)}
                  className="mt-3 flex w-fit items-center gap-2 rounded border-2 border-foreground bg-primary px-3 py-2 font-mono text-xs font-bold uppercase text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retake
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-[8px] border-2 border-foreground bg-background p-4">
        <div className="mb-4 flex items-center gap-2 font-mono text-sm font-bold uppercase">
          <Filter className="h-4 w-4 text-primary" />
          Filters
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search roadmap or step..."
              className="h-11 w-full rounded border-2 border-foreground bg-background pl-10 pr-3 text-sm outline-none"
            />
          </label>
          <select
            value={careerFilter}
            onChange={(event) => setCareerFilter(event.target.value)}
            className="h-11 rounded border-2 border-foreground bg-background px-3 text-sm font-bold"
          >
            <option value="all">All roadmaps</option>
            {careerPaths.map((career) => (
              <option key={career.id} value={career.id}>{career.careerTitle}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="h-11 rounded border-2 border-foreground bg-background px-3 text-sm font-bold"
          >
            <option value="all">All status</option>
            <option value="passed">Passed</option>
            <option value="review">Needs review</option>
          </select>
        </div>
      </section>

      <section className="rounded-[8px] border-2 border-foreground bg-background">
        <div className="border-b-2 border-foreground px-4 py-3 font-mono text-sm font-bold uppercase">
          All quiz attempts
        </div>

        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading history...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">Chưa có lịch sử phù hợp với bộ lọc.</div>
        ) : (
          <div className="divide-y divide-border">
            {filteredHistory.map((item) => (
              <article key={item.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <div className="font-bold">{item.stepTitle}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{item.careerTitle} - {formatDate(item.createdAt)}</div>
                </div>
                <div className="font-mono text-xl font-bold">
                  {item.score}/{item.totalQuestions}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded border px-2 py-1 text-[11px] font-bold uppercase ${
                    item.passed ? 'border-green-700 bg-green-100 text-green-700' : 'border-red-700 bg-red-100 text-red-700'
                  }`}>
                    {item.passed ? 'Pass' : 'Review'}
                  </span>
                  <button
                    onClick={() => navigate(`/quiz/${item.stepId}?careerId=${item.careerId}&stepId=${item.stepId}`)}
                    className="rounded border border-foreground px-3 py-1.5 font-mono text-[11px] font-bold uppercase hover:bg-muted"
                  >
                    Retake
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
