import { useState, useEffect } from 'react';
import { tokenStore } from '@/modules/auth/store/token.store';
import { toast } from 'sonner';
import type { CareerPath } from '../types';
import { CareerCard } from '../components/CareerCard';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import careerPathsData from '../data/careers.json';
import { progressApi } from '../api/progress.api';

const careerPaths = careerPathsData as CareerPath[];

export const RoadmapPage = () => {
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Authentication & progress sync
  useEffect(() => {
    const signedIn = Boolean(tokenStore.get());
    setIsSignedIn(signedIn);

    if (signedIn && selectedCareer) {
      // Sync progress from backend database
      progressApi.getDashboard()
        .then((res) => {
          if (res.data?.success) {
            const progress = res.data.data.careerPaths.find(
              (p: any) => p.careerId === selectedCareer.id
            );
            if (progress) {
              setCompletedNodes(progress.completedSteps || []);
              setIsEnrolled(progress.isEnrolled || false);
              const storedKey = `roadmap_progress_${selectedCareer.id}`;
              localStorage.setItem(storedKey, JSON.stringify(progress.completedSteps || []));
            } else {
              setCompletedNodes([]);
              setIsEnrolled(false);
            }
          }
        })
        .catch(() => {
          // Fallback to local storage
          const storedKey = `roadmap_progress_${selectedCareer.id}`;
          const stored = localStorage.getItem(storedKey);
          if (stored) {
            try {
              setCompletedNodes(JSON.parse(stored));
            } catch {
              setCompletedNodes([]);
            }
          } else {
            setCompletedNodes([]);
          }
          setIsEnrolled(false);
        });
    } else if (!signedIn) {
      // Default mock completion tags for guest mode
      setCompletedNodes(['fe-internet', 'fe-html-css', 'be-runtime', 'do-linux']);
      setIsEnrolled(false);
    }
  }, [selectedCareer]);

  const toggleEnrollment = async () => {
    if (!isSignedIn) {
      toast.info('Sign in to add this career roadmap to your dashboard!');
      return;
    }
    if (!selectedCareer) return;

    const previousIsEnrolled = isEnrolled;
    const nextIsEnrolled = !isEnrolled;

    // Optimistic UI Update
    setIsEnrolled(nextIsEnrolled);

    try {
      await progressApi.enroll(selectedCareer.id, nextIsEnrolled);
      toast.success(
        nextIsEnrolled
          ? 'Roadmap successfully added to your dashboard'
          : 'Roadmap successfully removed from your dashboard'
      );
    } catch (error) {
      // Rollback
      setIsEnrolled(previousIsEnrolled);
      toast.error('Failed to update dashboard subscription. Changes have been rolled back.');
    }
  };

  const toggleNodeCompletion = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSignedIn) {
      toast.info('Sign in to track, save, and update your career roadmap progress!');
      return;
    }

    if (selectedCareer) {
      const previousCompletedNodes = [...completedNodes];
      const previousIsEnrolled = isEnrolled;
      const isCurrentlyCompleted = completedNodes.includes(id);
      const updatedNodes = isCurrentlyCompleted
        ? completedNodes.filter((item) => item !== id)
        : [...completedNodes, id];

      // Optimistic update - completing a step auto-enrolls the roadmap
      setCompletedNodes(updatedNodes);
      setIsEnrolled(true);
      const storedKey = `roadmap_progress_${selectedCareer.id}`;
      localStorage.setItem(storedKey, JSON.stringify(updatedNodes));

      try {
        await progressApi.toggleStep({
          careerId: selectedCareer.id,
          stepId: id
        });
        toast.success(
          isCurrentlyCompleted
            ? 'Completed skill removed successfully'
            : 'Skill marked as completed successfully'
        );
      } catch (error) {
        // Rollback
        setCompletedNodes(previousCompletedNodes);
        setIsEnrolled(previousIsEnrolled);
        localStorage.setItem(storedKey, JSON.stringify(previousCompletedNodes));
        toast.error('Failed to sync progress on server. Changes have been rolled back.');
      }
    }
  };

  const handleSelectCareer = (career: CareerPath) => {
    setSelectedCareer(career);
    // Expand the first node by default in the detail view
    if (career.roadmapSteps.length > 0) {
      setExpandedNode(career.roadmapSteps[0].id);
    }
  };

  const handleBackToCareers = () => {
    setSelectedCareer(null);
    setExpandedNode(null);
  };

  const progressPercentage = selectedCareer
    ? Math.round((selectedCareer.roadmapSteps.filter(step => completedNodes.includes(step.id)).length / selectedCareer.roadmapSteps.length) * 100)
    : 0;

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* Global Auth Notice (Banner) */}
      {!isSignedIn && (
        <div className="border-2 border-primary bg-primary/10 text-primary p-4 rounded-[4px] font-mono text-xs uppercase tracking-wider flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            [GUEST MODE] YOU ARE VIEWING THIS ROADMAP IN PREVIEW MODE WITH MOCK INFO.
          </div>
          <button
            onClick={() => {
              window.location.href = '/login';
            }}
            className="px-4 py-2 border-2 border-primary bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all rounded-[2px] cursor-pointer shrink-0"
          >
            SIGN IN TO SAVE PROGRESS
          </button>
        </div>
      )}

      {/* MASTER VIEW (Career List) */}
      {!selectedCareer ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Header */}
          <section className="border-2 border-foreground p-6 bg-card text-card-foreground rounded-[4px] space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
              Directory
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase font-mono">
              Career Roadmaps
            </h1>
            <p className="text-sm text-muted-foreground font-sans">
              Select an interactive path below to explore essential competencies, skills mappings, and curated learning guidelines.
            </p>
          </section>

          {/* Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {careerPaths.map((career) => (
              <CareerCard
                key={career.id}
                career={career}
                onViewRoadmap={handleSelectCareer}
              />
            ))}
          </div>
        </div>
      ) : (
        /* DETAIL VIEW (Specific Career Path Roadmap) */
        <div className="space-y-8 animate-fadeIn">
          {/* Back button */}
          <button
            onClick={handleBackToCareers}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-foreground bg-card hover:bg-muted font-mono font-bold text-xs uppercase tracking-wider transition-all rounded-[2px] cursor-pointer"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Careers
          </button>

          {/* Header */}
          <section className="border-2 border-foreground p-6 bg-card text-card-foreground rounded-[4px] space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                  ACTIVE ROADMAP
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight uppercase font-mono">
                  {selectedCareer.careerTitle}
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-foreground bg-primary text-primary-foreground uppercase rounded-[2px] tracking-wider shrink-0 mt-1">
                  {selectedCareer.roadmapSteps.length} NODES
                </span>
                {isSignedIn && (
                  <button
                    onClick={toggleEnrollment}
                    className={`text-[10px] font-mono font-bold px-3 py-1 border-2 border-foreground uppercase rounded-[2px] tracking-wider transition-all duration-150 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                      isEnrolled
                        ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {isEnrolled ? 'Remove from Dashboard' : 'Add to Dashboard'}
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-sans">
              Follow this vertical timeline of technology steps. Connect to resource hubs and documentation logs at each node to structure your practice.
            </p>

            {/* Progress Tracker */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span>PATH PROGRESS</span>
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

          {/* Vertical Nodes Flowchart */}
          <RoadmapTimeline
            career={selectedCareer}
            completedNodes={completedNodes}
            expandedNode={expandedNode}
            onToggleNodeCompletion={toggleNodeCompletion}
            onToggleNodeExpand={setExpandedNode}
          />
        </div>
      )}
    </div>
  );
};
