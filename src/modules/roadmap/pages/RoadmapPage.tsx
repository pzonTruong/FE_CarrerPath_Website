import { useState } from 'react';

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  subtopics: string[];
  links: { label: string; url: string }[];
}

const roadmapNodes: RoadmapNode[] = [
  {
    id: 'internet',
    title: '1. Internet & Protocols',
    description: 'Understand the foundation of the web. Learn how data moves across networks, how clients and servers talk, and what happens when you type a URL in the browser.',
    subtopics: ['How does the internet work?', 'What is HTTP/HTTPS?', 'DNS and how it works', 'Domain Names and Hosting'],
    links: [
      { label: 'MDN: How the Web Works', url: 'https://developer.mozilla.org' },
      { label: 'HTTP Crash Course', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP' }
    ]
  },
  {
    id: 'html-css',
    title: '2. HTML & CSS Basics',
    description: 'Learn semantic HTML to structure your web pages correctly and CSS to apply layout styles, grids, flexbox, and responsive rules.',
    subtopics: ['Semantic HTML5 tags', 'CSS Selectors & Specificity', 'Flexbox & Grid Layouts', 'Media Queries & Responsive Design'],
    links: [
      { label: 'HTML Living Standard', url: 'https://html.spec.whatwg.org' },
      { label: 'CSS Grid Guide', url: 'https://css-tricks.com' }
    ]
  },
  {
    id: 'javascript',
    title: '3. JavaScript Fundamentals',
    description: 'Master the language of the web. Focus on DOM manipulation, asynchronous code with Promises/async-await, API fetches, and modern ES6+ features.',
    subtopics: ['JavaScript Syntax & Types', 'DOM Manipulation & Events', 'Fetch API & Axios', 'Promises & Async/Await', 'ES6+ Syntax Extensions'],
    links: [
      { label: 'JavaScript.info', url: 'https://javascript.info' },
      { label: 'Eloquent JavaScript', url: 'https://eloquentjavascript.net' }
    ]
  },
  {
    id: 'git',
    title: '4. Version Control (Git)',
    description: 'Crucial for collaboration. Learn to track changes in code, branching strategies, resolving merge conflicts, and pushing/pulling to remote repositories.',
    subtopics: ['Basic Git Commands', 'Branching & Merging', 'Resolving Conflicts', 'GitHub & Pull Requests'],
    links: [
      { label: 'Git Documentation', url: 'https://git-scm.com' },
      { label: 'GitHub Guides', url: 'https://github.com' }
    ]
  },
  {
    id: 'package-managers',
    title: '5. Package Managers & npm',
    description: 'Understand how libraries and modules are shared and installed in modern web applications. Learn how package.json stores project dependencies.',
    subtopics: ['npm commands', 'yarn vs pnpm vs npm', 'Package versioning & semver', 'Node Modules architecture'],
    links: [
      { label: 'npm Documentation', url: 'https://docs.npmjs.com' }
    ]
  },
  {
    id: 'react-framework',
    title: '6. Frontend Frameworks (React)',
    description: 'Select a framework to build complex single-page apps. We recommend React due to its component architecture, hook-based state management, and broad community.',
    subtopics: ['JSX & Rendering', 'State & Props', 'Hooks (useState, useEffect, useContext)', 'Component Lifecycle', 'Virtual DOM & Reconciliation'],
    links: [
      { label: 'React Docs', url: 'https://react.dev' }
    ]
  },
  {
    id: 'build-tools',
    title: '7. Build Tools & Linters',
    description: 'Learn tools that optimize, package, and lint your code to compile modern React applications into performant browser-ready bundles.',
    subtopics: ['Vite & Hot Module Replacement', 'ESLint configuration', 'Prettier formatter code rules', 'npm build pipeline'],
    links: [
      { label: 'Vite Guide', url: 'https://vite.dev' },
      { label: 'ESLint Rules', url: 'https://eslint.org' }
    ]
  }
];

export const RoadmapPage = () => {
  const [completedNodes, setCompletedNodes] = useState<string[]>(['internet', 'html-css']);
  const [expandedNode, setExpandedNode] = useState<string | null>('javascript');

  const toggleNodeCompletion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedNodes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleExpandNode = (id: string) => {
    setExpandedNode((prev) => (prev === id ? null : id));
  };

  const progressPercentage = Math.round((completedNodes.length / roadmapNodes.length) * 100);

  return (
    <div className="space-y-10 py-4 max-w-4xl mx-auto">
      {/* Page Header */}
      <section className="border-2 border-foreground p-6 bg-card text-card-foreground rounded-[4px] space-y-4">
        <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
          Core Module
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight uppercase font-mono">
          Frontend Career Roadmap
        </h1>
        <p className="text-sm text-muted-foreground font-sans">
          Follow this node-based flowchart to progress from absolute basics to a professional frontend engineer. Check off items as you learn them to track your status.
        </p>

        {/* Progress Tracker */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span>PROGRESS COMPLETED</span>
            <span className="text-primary">{progressPercentage}% ({completedNodes.length}/{roadmapNodes.length})</span>
          </div>
          <div className="w-full border-2 border-foreground bg-muted h-6 flex items-center p-0.5 rounded-[2px] overflow-hidden">
            <div
              className="bg-primary h-full border-r border-foreground transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </section>

      {/* Vertical Roadmap Nodes Flowchart */}
      <section className="relative pl-8 sm:pl-16 space-y-12">
        {/* Vertical connecting background line */}
        <div className="absolute left-[20px] sm:left-[36px] top-4 bottom-4 w-1 bg-foreground z-0" />

        {roadmapNodes.map((node, index) => {
          const isCompleted = completedNodes.includes(node.id);
          const isExpanded = expandedNode === node.id;

          return (
            <div key={node.id} className="relative group z-10">
              {/* Connector Dot / SVG Icon Container */}
              <div
                onClick={(e) => toggleNodeCompletion(node.id, e)}
                className={`absolute -left-[28px] sm:-left-[44px] top-1.5 size-6 sm:size-8 border-2 border-foreground rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 z-20 ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-background hover:bg-muted text-muted-foreground'
                }`}
                title="Toggle completion status"
              >
                {isCompleted ? (
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-foreground">{index + 1}</span>
                )}
              </div>

              {/* Node Card */}
              <div
                onClick={() => toggleExpandNode(node.id)}
                className={`border-2 border-foreground bg-card text-card-foreground p-5 rounded-[4px] cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(250,250,250,0.15)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 ${
                  isExpanded ? 'ring-2 ring-primary border-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-extrabold uppercase font-mono tracking-tight flex items-center gap-2">
                      {node.title}
                      {isCompleted && (
                        <span className="text-[9px] font-mono font-bold bg-primary text-primary-foreground border border-foreground px-1.5 py-0.5 rounded-[2px]">
                          DONE
                        </span>
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {node.description}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="text-foreground shrink-0 border border-foreground p-1 rounded-[2px] bg-background">
                    <svg
                      className={`size-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Details section */}
                {isExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-5 pt-4 border-t border-foreground space-y-4 cursor-default animate-fadeIn"
                  >
                    {/* Key Topics List */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground block uppercase">
                        Core Concepts to Learn:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {node.subtopics.map((topic) => (
                          <div
                            key={topic}
                            className="text-xs font-mono font-medium px-2.5 py-1 border border-foreground bg-muted text-foreground rounded-[2px]"
                          >
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources & Links */}
                    {node.links.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground block uppercase">
                          Recommended Docs:
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {node.links.map((link) => (
                            <a
                              key={link.label}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono font-bold text-primary hover:underline inline-flex items-center gap-1"
                            >
                              {link.label}
                              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
