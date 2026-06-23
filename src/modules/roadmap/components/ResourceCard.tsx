import React from 'react';
import type { ExternalResource } from '../types';

interface ResourceCardProps {
  resource: ExternalResource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="border border-dashed border-foreground/50 bg-muted/45 p-3 rounded-[2px] flex flex-col justify-between hover:bg-primary/5 hover:border-solid hover:border-primary transition-all duration-150 group/res"
    >
      <div className="space-y-1">
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">
          {resource.sourceName}
        </span>
        <h4 className="text-xs font-bold font-mono tracking-tight text-foreground group-hover/res:text-primary transition-colors">
          {resource.title}
        </h4>
      </div>
      <div className="mt-3 flex items-center gap-1 text-[10px] font-mono font-bold text-primary group-hover/res:underline">
        View Docs
        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  );
};
