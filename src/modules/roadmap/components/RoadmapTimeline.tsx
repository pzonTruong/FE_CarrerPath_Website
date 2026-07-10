import React from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { CareerPath } from '../types';
import { ResourceCard } from './ResourceCard';
import { NodeTest } from './NodeTest';

interface RoadmapTimelineProps {
  career: CareerPath;
  completedNodes: string[];
  expandedNode: string | null;
  onToggleNodeCompletion: (id: string, e: React.MouseEvent) => void;
  onToggleNodeExpand: (id: string | null) => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  career,
  completedNodes,
  expandedNode,
  onToggleNodeCompletion,
  onToggleNodeExpand,
}) => {
  return (
    <section className="relative pl-10 sm:pl-16 space-y-8 animate-fadeIn">
      {/* Vertical timeline connector line (dashed, foreground-based color) */}
      <div className="absolute left-[23px] sm:left-[35px] top-6 bottom-6 w-[2px] border-l-2 border-dashed border-foreground/30 z-0" />

      {career.roadmapSteps.map((step, index) => {
        const isCompleted = completedNodes.includes(step.id);
        const isExpanded = expandedNode === step.id;

        return (
          <div key={step.id} className="relative group z-10">
            {/* Step Completion Circle Dot */}
            <div
              onClick={(e) => onToggleNodeCompletion(step.id, e)}
              className={`absolute -left-[28px] sm:-left-[44px] top-1.5 size-7 sm:size-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-20 ${
                isCompleted
                  ? 'bg-primary border-2 border-foreground text-primary-foreground scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(250,250,250,0.15)] hover:opacity-95'
                  : 'bg-background border-2 border-foreground text-foreground hover:bg-muted'
              }`}
              title={isCompleted ? 'Mark stage as incomplete' : 'Mark stage as completed'}
            >
              {isCompleted ? (
                <Check className="size-4 sm:size-4.5 stroke-[3]" />
              ) : (
                <span className="text-xs font-mono font-bold">{index + 1}</span>
              )}
            </div>

            {/* Stage Box Card Container */}
            <div
              onClick={() => onToggleNodeExpand(isExpanded ? null : step.id)}
              className={`border-2 border-foreground bg-card text-card-foreground p-5 sm:p-6 rounded-lg cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(250,250,250,0.15)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(250,250,250,0.25)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 ${
                isExpanded ? 'ring-2 ring-primary border-primary' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-extrabold uppercase font-mono tracking-wide flex flex-wrap items-center gap-2">
                    <span className="text-foreground">{step.title}</span>
                    {isCompleted && (
                      <span className="text-[9px] font-mono font-bold bg-primary text-primary-foreground border border-foreground px-2 py-0.5 rounded-[2px] tracking-wider">
                        DONE
                      </span>
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {step.description}
                  </p>
                </div>

                {/* Collapse / Expand chevron button */}
                <div className="text-foreground shrink-0 border border-foreground p-1 rounded-[2px] bg-background">
                  {isExpanded ? (
                    <ChevronUp className="size-4 stroke-[3]" />
                  ) : (
                    <ChevronDown className="size-4 stroke-[3]" />
                  )}
                </div>
              </div>

              {/* Subtopics Checklist & Reference Resources (Visible when expanded) */}
              {isExpanded && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-6 pt-5 border-t-2 border-foreground space-y-6 cursor-default animate-fadeIn"
                >
                  {/* Concept Checklist pills */}
                  {step.subtopics && step.subtopics.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground block uppercase">
                        Concept Checklist
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {step.subtopics.map((topic) => (
                          <div
                            key={topic}
                            className="flex items-center gap-2 text-xs font-mono font-medium px-3.5 py-1.5 border-2 border-foreground bg-muted text-foreground rounded-[2px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:shadow-[1px_1px_0px_0px_rgba(250,250,250,0.15)]"
                          >
                            <Check className="size-3.5 text-primary stroke-[3]" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reference Resources Grid */}
                  {step.externalResources && step.externalResources.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground block uppercase">
                        Reference Resources
                      </span>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {step.externalResources.map((res) => (
                          <ResourceCard key={res.title} resource={res} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Section */}
                  <div className="pt-5 border-t border-dashed border-foreground/30 flex items-center justify-between gap-4">
                    {isCompleted ? (
                      <button
                        onClick={(e) => onToggleNodeCompletion(step.id, e)}
                        className="px-4 py-2 border-2 border-foreground font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(250,250,250,0.15)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none bg-destructive text-destructive-foreground hover:bg-destructive/95 rounded-[2px]"
                      >
                        Mark as Incomplete
                      </button>
                    ) : (
                      <div className="w-full">
                        <NodeTest 
                          careerId={career.id} 
                          stepId={step.id} 
                          onCompleteSuccess={() => onToggleNodeCompletion(step.id, {} as React.MouseEvent)} 
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
};
