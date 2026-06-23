import { useState, useEffect } from 'react';
import { tokenStore } from '@/modules/auth/store/token.store';
import { toast } from 'sonner';
import type { CareerPath } from '../types';
import { CareerCard } from '../components/CareerCard';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import careerPathsData from '../data/careers.json';

const careerPaths = careerPathsData as CareerPath[];

export const RoadmapPage = () => {
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  // Authentication & progress sync
  useEffect(() => {
    const signedIn = Boolean(tokenStore.get());
    setTimeout(() => {
      setIsSignedIn(signedIn);

      if (signedIn && selectedCareer) {
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
      } else if (!signedIn) {
        // Default mock completion tags for guest mode
        setCompletedNodes(['fe-internet', 'fe-html-css', 'be-runtime', 'do-linux']);
      }
    }, 0);
  }, [selectedCareer]);

  const toggleNodeCompletion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSignedIn) {
      toast.info('Sign in to track, save, and update your career roadmap progress!');
      return;
    }

    if (selectedCareer) {
      setCompletedNodes((prev) => {
        const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
        const storedKey = `roadmap_progress_${selectedCareer.id}`;
        localStorage.setItem(storedKey, JSON.stringify(updated));
        return updated;
      });
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
    ? Math.round((completedNodes.filter(id => id.startsWith(selectedCareer.id.substring(0, 2))).length / selectedCareer.roadmapSteps.length) * 100)
    : 0;

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* 2. Global Auth Notice (Banner) */}
      {!isSignedIn && (
        <div className="border-2 border-primary bg-primary/10 text-primary p-4 rounded-[4px] font-mono text-xs uppercase tracking-wider flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            [GUEST MODE] YOU ARE VIEWING THIS ROADMAP IN PREVIEW MODE WITH MOCK INFO.
          </div>
          <button
            onClick={() => {
              // Direct navigation fallback simulation via dispatching event or browser redirect if route matches
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
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-foreground bg-primary text-primary-foreground uppercase rounded-[2px] tracking-wider shrink-0 mt-1">
                {selectedCareer.roadmapSteps.length} NODES
              </span>
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
