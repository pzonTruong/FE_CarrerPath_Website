import React from 'react';
import { ExternalLink } from 'lucide-react';
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
      className="border-2 border-foreground bg-card text-card-foreground p-4 rounded-lg flex flex-col justify-between hover:bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(250,250,250,0.15)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(250,250,250,0.25)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 group/res"
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] font-mono text-muted-foreground font-bold uppercase tracking-widest block truncate">
            {resource.sourceName}
          </span>
          <ExternalLink className="size-3 text-muted-foreground group-hover/res:text-foreground transition-colors shrink-0" />
        </div>
        <h4 className="text-xs sm:text-sm font-bold font-sans tracking-wide text-foreground group-hover/res:text-primary transition-colors line-clamp-2 pt-1">
          {resource.title}
        </h4>
      </div>
      <div className="mt-4 flex items-center gap-1 text-[10px] font-mono font-bold text-primary tracking-widest uppercase group-hover/res:underline">
        View Docs
        <span className="text-xs transition-transform duration-250 group-hover/res:translate-x-0.5">&gt;</span>
      </div>
    </a>
  );
};
