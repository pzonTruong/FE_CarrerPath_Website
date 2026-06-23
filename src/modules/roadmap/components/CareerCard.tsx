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
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-foreground bg-muted text-foreground uppercase rounded-[2px] tracking-wider inline-block">
          MODULE
        </span>
        <h2 className="text-xl font-bold uppercase tracking-tight font-mono">
          {career.careerTitle}
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed font-sans">
          {career.description}
        </p>

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
