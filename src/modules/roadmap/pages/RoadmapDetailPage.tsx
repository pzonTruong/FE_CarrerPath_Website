import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { tokenStore } from '@/modules/auth/store/token.store';
import { roadmapApi } from '../api/roadmap.api';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import type { CareerPath } from '../types';

const guestPreviewCompletedNodes = ['fe-internet', 'fe-html-css', 'be-runtime', 'do-linux'];

const getStoredCompletedNodes = (careerId: string, isSignedIn: boolean) => {
  if (!isSignedIn) {
    return guestPreviewCompletedNodes;
  }

  const stored = localStorage.getItem(`roadmap_progress_${careerId}`);
  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const RoadmapDetailPage = () => {
  const { careerId = '' } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState<CareerPath | null>(null);
  const [completedProgress, setCompletedProgress] = useState<{ careerId: string; nodes: string[] } | null>(null);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [loadedCareerId, setLoadedCareerId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const isSignedIn = Boolean(tokenStore.get());
  const isLoading = loadedCareerId !== careerId;

  useEffect(() => {
    let ignore = false;

    roadmapApi.getByCareerId(careerId)
      .then((res) => {
        if (ignore) {
          return;
        }

        setCareer(res.data);
        setExpandedNode(res.data.roadmapSteps[0]?.id ?? null);
        setError('');
      })
      .catch((err) => {
        if (ignore) {
          return;
        }

        setCareer(null);
        setError(err?.response?.data?.message ?? 'Unable to load roadmap.');
      })
      .finally(() => {
        if (!ignore) {
          setLoadedCareerId(careerId);
        }
      });

    return () => {
      ignore = true;
    };
  }, [careerId]);

  const completedNodes = useMemo(() => {
    if (!career) {
      return [];
    }

    if (completedProgress?.careerId === career.id) {
      return completedProgress.nodes;
    }

    return getStoredCompletedNodes(career.id, isSignedIn);
  }, [career, completedProgress, isSignedIn]);

  const progressPercentage = useMemo(() => {
    if (!career || career.roadmapSteps.length === 0) {
      return 0;
    }

    const validNodeIds = new Set(career.roadmapSteps.map((step) => step.id));
    const completedCount = completedNodes.filter((id) => validNodeIds.has(id)).length;
    return Math.round((completedCount / career.roadmapSteps.length) * 100);
  }, [career, completedNodes]);

  const toggleNodeCompletion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isSignedIn) {
      toast.info('Sign in to track, save, and update your career roadmap progress!');
      return;
    }

    if (!career) {
      return;
    }

    setCompletedProgress(() => {
      const updated = completedNodes.includes(id)
        ? completedNodes.filter((item) => item !== id)
        : [...completedNodes, id];
      localStorage.setItem(`roadmap_progress_${career.id}`, JSON.stringify(updated));
      return { careerId: career.id, nodes: updated };
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[45vh] items-center justify-center">
        <div className="flex items-center gap-3 border-2 border-foreground bg-card px-5 py-4 font-mono text-sm uppercase tracking-wider rounded-lg">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading roadmap
        </div>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 border-2 border-foreground bg-card p-6 rounded-lg">
        <p className="font-mono text-sm font-bold uppercase text-destructive">{error || 'Roadmap not found.'}</p>
        <button
          onClick={() => navigate('/roadmap')}
          className="border-2 border-foreground bg-primary px-4 py-2 font-mono text-xs font-bold uppercase text-primary-foreground rounded-[2px]"
        >
          Back to Roadmaps
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto animate-fadeIn">
      <Link
        to="/roadmap"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-foreground bg-card hover:bg-muted font-mono font-bold text-xs uppercase tracking-wider transition-all rounded-[2px]"
      >
        Back to Careers
      </Link>

      {!isSignedIn && (
        <div className="border-2 border-primary bg-primary/10 text-primary p-4 rounded-lg font-mono text-xs uppercase tracking-wider flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>[GUEST MODE] SIGN IN TO SAVE YOUR ROADMAP PROGRESS.</div>
          <Link
            to="/login"
            className="px-4 py-2 border-2 border-primary bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all rounded-[2px] shrink-0"
          >
            Sign in
          </Link>
        </div>
      )}

      <section className="border-2 border-foreground p-6 bg-card text-card-foreground rounded-lg space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
              Active Roadmap
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase font-mono">
              {career.careerTitle}
            </h1>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-foreground bg-primary text-primary-foreground uppercase rounded-[2px] tracking-wider shrink-0">
            {career.roadmapSteps.length} stages
          </span>
        </div>

        <p className="text-sm text-muted-foreground font-sans">
          {career.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {career.skills.map((skill) => (
            <span
              key={skill}
              className="text-[10px] font-mono px-2 py-0.5 border border-foreground bg-muted rounded-[2px] uppercase font-bold"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span>Path Progress</span>
            <span className="text-primary">{progressPercentage}%</span>
          </div>
          <div className="w-full border-2 border-foreground bg-muted h-6 flex items-center p-0.5 rounded-[2px] overflow-hidden">
            <div
              className="bg-primary h-full border-r border-foreground transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </section>

      <RoadmapTimeline
        career={career}
        completedNodes={completedNodes}
        expandedNode={expandedNode}
        onToggleNodeCompletion={toggleNodeCompletion}
        onToggleNodeExpand={setExpandedNode}
      />
    </div>
  );
};
