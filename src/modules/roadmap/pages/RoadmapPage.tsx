import { useState, useEffect } from 'react';
import { tokenStore } from '@/modules/auth/store/token.store';
import { toast } from 'sonner';

// ==========================================
// 1. Mock Data Structure (Powering the UI)
// ==========================================
interface ExternalResource {
  title: string;
  sourceName: string;
  url: string;
}

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  subtopics: string[];
  externalResources: ExternalResource[];
}

interface CareerPath {
  id: string;
  careerTitle: string;
  description: string;
  skills: string[];
  roadmapSteps: RoadmapStep[];
}

const careerPaths: CareerPath[] = [
  {
    id: 'frontend',
    careerTitle: 'Frontend Developer',
    description: 'Learn to structure, style, and build highly interactive, modern client-side web interfaces.',
    skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vite', 'Tailwind CSS'],
    roadmapSteps: [
      {
        id: 'fe-internet',
        title: 'Internet & Web Protocols',
        description: 'Understand the fundamental architecture of the web: DNS servers, domain hosting, client-server models, and secure HTTP request lifecycles.',
        subtopics: ['DNS & Name Servers', 'HTTP Requests & Response Codes', 'Domain Registration & Hosting Models'],
        externalResources: [
          {
            title: 'How the Web Works',
            sourceName: 'MDN Web Docs',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works'
          },
          {
            title: 'HTTP Overview and Specifications',
            sourceName: 'IETF Standards',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP'
          }
        ]
      },
      {
        id: 'fe-html-css',
        title: 'HTML & CSS Layout Architecture',
        description: 'Construct pages using semantic tags and style them using modern layout engines like Grid and Flexbox for responsive designs.',
        subtopics: ['Semantic markup systems', 'CSS Flexbox alignment model', 'CSS Grid template specifications'],
        externalResources: [
          {
            title: 'CSS Grid Guide',
            sourceName: 'CSS-Tricks Documentation',
            url: 'https://css-tricks.com/snippets/css/complete-guide-grid/'
          },
          {
            title: 'HTML Living Standard Spec',
            sourceName: 'WHATWG HTML Reference',
            url: 'https://html.spec.whatwg.org/'
          }
        ]
      },
      {
        id: 'fe-javascript',
        title: 'Asynchronous JavaScript & DOM',
        description: 'Learn modern ES6+ runtime mechanics, asynchronous flows via Promises and async-await, and DOM event bindings.',
        subtopics: ['ESNext modules and lexical scoping', 'Event Loop mechanics', 'Promises, microtasks, and async actions'],
        externalResources: [
          {
            title: 'Modern JS Tutorial',
            sourceName: 'JavaScript.info Guide',
            url: 'https://javascript.info/'
          },
          {
            title: 'Fetch API and Request Specifications',
            sourceName: 'WHATWG Fetch Standard',
            url: 'https://fetch.spec.whatwg.org/'
          }
        ]
      },
      {
        id: 'fe-react',
        title: 'React Framework & Hook Models',
        description: 'Implement complex modular user interfaces using component-driven declarative design, rendering cycles, and state variables.',
        subtopics: ['Fiber reconciler cycle', 'Hook flows (useState, useEffect, useMemo)', 'Local and state management contexts'],
        externalResources: [
          {
            title: 'React Developer Documentation',
            sourceName: 'React.dev Reference',
            url: 'https://react.dev/'
          }
        ]
      }
    ]
  },
  {
    id: 'backend',
    careerTitle: 'Backend Developer',
    description: 'Learn to design APIs, structure relational/non-relational databases, write business logic, and handle scaling.',
    skills: ['Node.js', 'Express', 'SQL', 'MongoDB', 'REST APIs', 'JWT Security', 'Docker'],
    roadmapSteps: [
      {
        id: 'be-runtime',
        title: 'JavaScript Runtime (Node.js)',
        description: 'Understand writing server-side JavaScript using the Node.js runtime environment, filesystem utilities, and package dependencies.',
        subtopics: ['Event-driven asynchronous I/O', 'Node Package Manager syntax', 'Environment configurations'],
        externalResources: [
          {
            title: 'Node.js Developer Guide',
            sourceName: 'NodeJS.org Reference',
            url: 'https://nodejs.org/en/docs'
          }
        ]
      },
      {
        id: 'be-apis',
        title: 'REST API Design & Routing',
        description: 'Build endpoints using correct HTTP methods, payload formats, status codes, query strings, and request parsers.',
        subtopics: ['REST architectural principles', 'Express routing and middleware configuration', 'JSON serialization'],
        externalResources: [
          {
            title: 'Architectural Styles and REST',
            sourceName: 'Fielding Dissertation Reference',
            url: 'https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm'
          },
          {
            title: 'HTTP Status Response Codes Reference',
            sourceName: 'MDN Web Docs',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status'
          }
        ]
      },
      {
        id: 'be-databases',
        title: 'Relational Databases (PostgreSQL)',
        description: 'Design database tables, indexes, constraints, write structured queries, and handle migrations.',
        subtopics: ['Database normalization rules', 'SQL query join optimization', 'ACID transactions specifications'],
        externalResources: [
          {
            title: 'PostgreSQL Manuals',
            sourceName: 'PostgreSQL.org Reference Docs',
            url: 'https://www.postgresql.org/docs/'
          }
        ]
      },
      {
        id: 'be-security',
        title: 'API Authentication & Token Security',
        description: 'Secure backend resources using JSON Web Tokens (JWT), session cookies, secure storage, and request rate-limiting.',
        subtopics: ['JWT signature verification', 'CORS rules and cross-origin controls', 'Hash mechanisms for passwords'],
        externalResources: [
          {
            title: 'JWT Introduction',
            sourceName: 'JWT.io Specs',
            url: 'https://jwt.io/introduction/'
          },
          {
            title: 'OWASP Security Threat Checklist',
            sourceName: 'OWASP Security Foundation Docs',
            url: 'https://owasp.org/www-project-top-ten/'
          }
        ]
      }
    ]
  },
  {
    id: 'devops',
    careerTitle: 'DevOps Engineer',
    description: 'Automate build pipelines, orchestrate container clusters, and manage cloud infrastructure reliably.',
    skills: ['Linux Shell', 'Docker', 'CI/CD Pipelines', 'Kubernetes', 'AWS Services', 'Nginx Configuration'],
    roadmapSteps: [
      {
        id: 'do-linux',
        title: 'Linux Systems & Shell Scripting',
        description: 'Master Unix directory architectures, process controls, user permissions, network diagnostics, and shell tools.',
        subtopics: ['POSIX standard commands', 'Bash scripts variables', 'SSH and keys exchange methods'],
        externalResources: [
          {
            title: 'GNU Bash Manual',
            sourceName: 'GNU Software Reference',
            url: 'https://www.gnu.org/software/bash/manual/'
          }
        ]
      },
      {
        id: 'do-containers',
        title: 'Containerization (Docker)',
        description: 'Isolate services into lightweight containers. Write custom configurations to compile performant containers.',
        subtopics: ['Layered filesystem builds', 'Multi-stage builds optimizations', 'Network bridges specifications'],
        externalResources: [
          {
            title: 'Docker Guide and Reference Docs',
            sourceName: 'Docker Docs Manual',
            url: 'https://docs.docker.com/'
          }
        ]
      },
      {
        id: 'do-pipelines',
        title: 'Continuous Integration & Pipelines',
        description: 'Build pipelines that test, build, lint, and deploy code changes dynamically to cluster instances.',
        subtopics: ['Pipeline triggers configuration', 'Cache build dependencies strategies', 'Deploy tokens storage'],
        externalResources: [
          {
            title: 'GitHub Actions Documentation',
            sourceName: 'GitHub Documentation Reference',
            url: 'https://docs.github.com/en/actions'
          }
        ]
      },
      {
        id: 'do-k8s',
        title: 'Container Orchestration (Kubernetes)',
        description: 'Manage clusters of containers across distributed networks. Automate scalability and fault tolerance.',
        subtopics: ['Deployments, pods, and services mapping', 'ConfigMaps and Secrets mounting', 'Ingress controller systems'],
        externalResources: [
          {
            title: 'Kubernetes Overview and API Docs',
            sourceName: 'Kubernetes.io Specs',
            url: 'https://kubernetes.io/docs/home/'
          }
        ]
      }
    ]
  }
];

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
              <div
                key={career.id}
                className="border-2 border-foreground bg-card text-card-foreground p-6 rounded-[4px] flex flex-col justify-between space-y-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,0.15)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="space-y-4">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-foreground bg-muted text-foreground uppercase rounded-[2px] tracking-wider">
                    MODULE
                  </span>
                  <h2 className="text-xl font-bold uppercase tracking-tight font-mono">
                    {career.careerTitle}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
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
                  onClick={() => handleSelectCareer(career)}
                  className="w-full py-2.5 mt-2 border-2 border-foreground bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 hover:opacity-95 rounded-[2px] cursor-pointer"
                >
                  View Roadmap
                </button>
              </div>
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
          <section className="relative pl-8 sm:pl-16 space-y-10">
            {/* Vertical timeline connector line */}
            <div className="absolute left-[20px] sm:left-[36px] top-4 bottom-4 w-1 bg-foreground z-0" />

            {selectedCareer.roadmapSteps.map((step, index) => {
              const isCompleted = completedNodes.includes(step.id);
              const isExpanded = expandedNode === step.id;

              return (
                <div key={step.id} className="relative group z-10">
                  {/* Connector Dot */}
                  <div
                    onClick={(e) => toggleNodeCompletion(step.id, e)}
                    className={`absolute -left-[28px] sm:-left-[44px] top-1.5 size-6 sm:size-8 border-2 border-foreground rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 z-20 ${
                      isCompleted
                        ? 'bg-primary text-primary-foreground scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-background hover:bg-muted text-muted-foreground'
                    }`}
                    title="Toggle Node Completion"
                  >
                    {isCompleted ? (
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-foreground">{index + 1}</span>
                    )}
                  </div>

                  {/* Step Card Box */}
                  <div
                    onClick={() => setExpandedNode(isExpanded ? null : step.id)}
                    className={`border-2 border-foreground bg-card text-card-foreground p-5 rounded-[4px] cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(250,250,250,0.15)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 ${
                      isExpanded ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-extrabold uppercase font-mono tracking-tight flex items-center gap-2">
                          {step.title}
                          {isCompleted && (
                            <span className="text-[9px] font-mono font-bold bg-primary text-primary-foreground border border-foreground px-1.5 py-0.5 rounded-[2px]">
                              DONE
                            </span>
                          )}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed line-clamp-2 sm:line-clamp-none">
                          {step.description}
                        </p>
                      </div>

                      {/* Arrow */}
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

                    {/* Subtopics & Automated Resources */}
                    {isExpanded && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-5 pt-4 border-t border-foreground space-y-5 cursor-default animate-fadeIn"
                      >
                        {/* Subtopics Checklist chips */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground block uppercase">
                            Concept Checklist:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {step.subtopics.map((topic) => (
                              <div
                                key={topic}
                                className="text-xs font-mono font-medium px-2.5 py-1 border border-foreground bg-muted text-foreground rounded-[2px]"
                              >
                                {topic}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Automated Resource Cards Mapping */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground block uppercase">
                            Reference Resources:
                          </span>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {step.externalResources.map((res) => (
                              <a
                                key={res.title}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-dashed border-foreground bg-muted/40 p-3 rounded-[2px] flex flex-col justify-between hover:bg-primary/5 hover:border-solid hover:border-primary transition-all duration-150 group/res"
                              >
                                <div className="space-y-1">
                                  <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">
                                    {res.sourceName}
                                  </span>
                                  <h4 className="text-xs font-bold font-mono tracking-tight text-foreground group-hover/res:text-primary transition-colors">
                                    {res.title}
                                  </h4>
                                </div>
                                <div className="mt-3 flex items-center gap-1 text-[10px] font-mono font-bold text-primary group-hover/res:underline">
                                  View Docs
                                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      )}
    </div>
  );
};
