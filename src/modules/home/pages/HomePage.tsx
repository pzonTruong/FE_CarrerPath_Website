import { Link } from 'react-router-dom';

const popularTopics = [
  {
    title: 'Frontend Developer',
    category: 'ROADMAP',
    description: 'Step-by-step guide to modern frontend development. Learn HTML, CSS, JavaScript, React, and build tools.',
    icon: (
      <svg className="size-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    to: '/roadmap',
    accent: 'bg-primary/10'
  },
  {
    title: 'Backend Developer',
    category: 'ROADMAP',
    description: 'Master API design, databases, server architectures, caching, system design, and security protocols.',
    icon: (
      <svg className="size-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    to: '/roadmap',
    accent: 'bg-primary/10'
  },
  {
    title: 'DevOps Roadmap',
    category: 'ROADMAP',
    description: 'Learn infrastructure, CI/CD pipelines, containerization with Docker, orchestration with Kubernetes, and Cloud providers.',
    icon: (
      <svg className="size-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    to: '/roadmap',
    accent: 'bg-primary/10'
  },
  {
    title: 'React Guide',
    category: 'GUIDE',
    description: 'An in-depth technical exploration of hooks, concurrency, server components, and routing patterns.',
    icon: (
      <svg className="size-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    to: '/features',
    accent: 'bg-muted'
  },
  {
    title: 'System Design',
    category: 'GUIDE',
    description: 'Learn how to scale applications to millions of active users. Load balancing, CDNs, and sharding.',
    icon: (
      <svg className="size-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    to: '/features',
    accent: 'bg-muted'
  },
  {
    title: 'API Security',
    category: 'BEST PRACTICE',
    description: 'Securing public endpoints. Best practices for OAuth2, JWT, rate limiting, and CORS compliance.',
    icon: (
      <svg className="size-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    to: '/features',
    accent: 'bg-muted'
  }
];

export const HomePage = () => {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto py-10 space-y-6">
        <div className="inline-block px-3 py-1 text-xs font-mono font-bold border-2 border-foreground bg-primary/10 text-primary uppercase tracking-widest rounded-[2px]">
          Interactive Developer Learning
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none text-foreground">
          Step-by-Step paths to Developer Mastery
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto font-sans leading-relaxed">
          roadmap.dev is a community effort to create roadmaps, guides and other educational content to help guide developers in picking up a path.
        </p>
        <div className="pt-4">
          <Link
            to="/roadmap"
            className="inline-block px-8 py-4 font-mono font-bold text-sm sm:text-base border-2 border-foreground bg-primary text-primary-foreground transition-all duration-150 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(250,250,250,1)] rounded-[2px]"
          >
            Explore Roadmaps
          </Link>
        </div>
      </section>

      {/* Grid of Topics / Recent Guides */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b-2 border-foreground pb-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase font-mono">
            Popular Topics
          </h2>
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            6 Paths Available
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popularTopics.map((topic) => (
            <Link
              key={topic.title}
              to={topic.to}
              className="group block relative border-2 border-foreground bg-card text-card-foreground p-6 rounded-[4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,0.15)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(250,250,250,0.3)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 border-2 border-foreground rounded-[2px] bg-background">
                  {topic.icon}
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-foreground rounded-[2px] bg-muted uppercase tracking-wider">
                  {topic.category}
                </span>
              </div>
              <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">
                {topic.title}
              </h3>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                {topic.description}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-mono font-bold text-primary group-hover:underline">
                View Roadmap
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
