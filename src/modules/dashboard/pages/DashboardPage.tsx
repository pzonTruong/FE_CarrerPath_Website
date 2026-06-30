import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressApi } from '@/modules/roadmap/api/progress.api';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { toast } from 'sonner';

interface CareerPathProgress {
  careerId: string;
  careerTitle: string;
  percentage: number;
  completedCount: number;
  totalCount: number;
  isEnrolled: boolean;
}

interface HistoryPoint {
  date: string;
  completedCount: number;
}

interface DashboardData {
  overallCompletion: number;
  careerPaths: CareerPathProgress[];
  history: HistoryPoint[];
}

export const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await progressApi.getDashboard();
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (error) {
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center font-mono text-sm uppercase">
        Loading analytics dataset...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border-2 border-foreground bg-card p-6 text-center font-mono rounded-[4px]">
        No dashboard data available. Please sign in or complete some skills first.
      </div>
    );
  }

  const enrolledCareers = data.careerPaths.filter((p) => p.isEnrolled);
  const BAR_COLORS = ['var(--primary)', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <section className="border-2 border-foreground p-6 bg-card text-card-foreground rounded-[4px] space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
          User Analytics
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight uppercase font-mono">
          Learning Dashboard
        </h1>
        <p className="text-sm text-muted-foreground font-sans">
          Overview of your career path development milestones, completed concepts, and practice timeline logs.
        </p>
      </section>

      {enrolledCareers.length === 0 ? (
        /* Empty State for Enrolled Careers */
        <div className="border-2 border-foreground bg-card p-10 text-center rounded-[4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-mono uppercase">Your Dashboard is Empty</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You haven't added any career roadmaps to your dashboard yet. Browse active roadmaps and add them to monitor your overall progress.
            </p>
          </div>
          <button
            onClick={() => navigate('/roadmap')}
            className="px-6 py-3 border-2 border-foreground bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[0px] active:translate-y-[0px] rounded-[2px] cursor-pointer"
          >
            Explore Career Roadmaps
          </button>
        </div>
      ) : (
        <>
          {/* Stats Cards Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1: Overall completion */}
            <div className="border-2 border-foreground bg-card p-6 rounded-[4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Overall Completion</span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-mono text-primary">{data.overallCompletion}%</span>
              </div>
              <div className="w-full mt-4 border border-foreground bg-muted h-3 rounded-[2px] overflow-hidden p-[1px]">
                <div 
                  className="bg-primary h-full transition-all duration-500" 
                  style={{ width: `${data.overallCompletion}%` }}
                />
              </div>
            </div>

            {/* Card 2: Active Enrolled Careers */}
            <div className="border-2 border-foreground bg-card p-6 rounded-[4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Enrolled Careers</span>
              <div className="mt-4">
                <span className="text-4xl font-extrabold font-mono text-foreground">
                  {enrolledCareers.length} / {data.careerPaths.length}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-mono mt-4 uppercase">Tracked Career Roadmaps</span>
            </div>

            {/* Card 3: Total Completed skills across enrolled paths */}
            <div className="border-2 border-foreground bg-card p-6 rounded-[4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Skills Mastered</span>
              <div className="mt-4">
                <span className="text-4xl font-extrabold font-mono text-foreground">
                  {enrolledCareers.reduce((acc, curr) => acc + curr.completedCount, 0)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-mono mt-4 uppercase">Steps across enrolled paths</span>
            </div>
          </div>

          {/* Charts section */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Chart 1: BarChart for career comparison */}
            <div className="border-2 border-foreground bg-card p-5 rounded-[4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider border-b border-foreground pb-2">
                Progress per Enrolled Path
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrolledCareers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.15} />
                    <XAxis dataKey="careerTitle" tick={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--foreground)' }} />
                    <YAxis unit="%" tick={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--foreground)' }} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '11px', 
                        backgroundColor: 'var(--card)',
                        color: 'var(--card-foreground)',
                        border: '2px solid var(--border)', 
                        borderRadius: '4px' 
                      }}
                      itemStyle={{ color: 'var(--card-foreground)' }}
                      labelStyle={{ color: 'var(--muted-foreground)', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="percentage" name="Completion Rate">
                      {enrolledCareers.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: AreaChart for Timeline History */}
            <div className="border-2 border-foreground bg-card p-5 rounded-[4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider border-b border-foreground pb-2">
                Weekly Mastery Trend
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.history} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.15} />
                    <XAxis dataKey="date" tick={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--foreground)' }} />
                    <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--foreground)' }} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '11px', 
                        backgroundColor: 'var(--card)',
                        color: 'var(--card-foreground)',
                        border: '2px solid var(--border)', 
                        borderRadius: '4px' 
                      }} 
                      itemStyle={{ color: 'var(--card-foreground)' }}
                      labelStyle={{ color: 'var(--muted-foreground)', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="completedCount" 
                      name="Completed Nodes" 
                      stroke="var(--primary)" 
                      fill="var(--primary)" 
                      fillOpacity={0.15} 
                      strokeWidth={2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default DashboardPage;
