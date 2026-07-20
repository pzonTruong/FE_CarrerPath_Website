import React from 'react';
import type { CareerPath } from '../types';

interface CareerCardProps {
  career: CareerPath;
  onViewRoadmap: (career: CareerPath) => void;
}

export const CareerCard: React.FC<CareerCardProps> = ({ career, onViewRoadmap }) => {
  return (
    <div
      className="border-2 border-foreground bg-card text-card-foreground p-6 rounded-[4px] flex flex-col justify-between space-y-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,0.15)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-foreground bg-muted text-foreground uppercase rounded-[2px] tracking-wider inline-block">
            {career.category ?? 'Career Path'}
          </span>
          {career.difficulty && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-foreground bg-background text-foreground uppercase rounded-[2px] tracking-wider inline-block">
              {career.difficulty}
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold uppercase tracking-tight font-mono">
          {career.careerTitle}
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed font-sans">
          {career.description}
        </p>
        <div className="grid grid-cols-2 gap-2 border-y border-dashed border-foreground/30 py-3 font-mono text-[10px] uppercase">
          <div>
            <span className="block text-muted-foreground">Duration</span>
            <strong className="text-foreground">{career.duration ?? `${career.roadmapSteps.length} stages`}</strong>
          </div>
          <div>
            <span className="block text-muted-foreground">Outcome</span>
            <strong className="text-foreground">{career.outcome ?? 'Job-ready basics'}</strong>
          </div>
        </div>

        {/* Skills tags mapping */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
            Core Skills:
          </span>
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
        </div>
      </div>

      <button
        onClick={() => onViewRoadmap(career)}
        className="w-full py-2.5 mt-2 border-2 border-foreground bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 hover:opacity-95 rounded-[2px] cursor-pointer"
      >
        View Roadmap
      </button>
    </div>
  );
};
