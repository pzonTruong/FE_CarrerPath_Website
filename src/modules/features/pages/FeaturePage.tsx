import { Link } from 'react-router-dom';

export const FeaturePage = () => {
  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* Page Header */}
      <section className="border-2 border-foreground p-6 bg-card text-card-foreground rounded-[4px] space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
          Specifications
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight uppercase font-mono">
          Platform Capabilities
        </h1>
        <p className="text-sm text-muted-foreground font-sans">
          Discover the features designed to optimize your software engineering career trajectory and learning efficiency.
        </p>
      </section>

      {/* Bento Box Grid Layout */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Interactive Flowcharts (Spans 2 cols on md) */}
        <div className="border-2 border-foreground bg-card text-card-foreground p-6 rounded-[4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,0.15)] md:col-span-2 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-foreground bg-primary/10 text-primary uppercase rounded-[2px]">
                CAPABILITY
              </span>
              <svg className="size-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold font-mono uppercase tracking-tight">
              Interactive Path Flowcharts
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Explore complex technical tracks with visual nodes. Expand nodes to reveal underlying sub-concepts, curate your own checkboxes to save progress, and refer directly to specifications and MDN manuals. No filler content, just pure developer progression.
            </p>
          </div>
          <Link
            to="/roadmap"
            className="self-start text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1.5"
          >
            Launch Interactive Path
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Card 2: Developer Guides (Spans 1 col) */}
        <div className="border-2 border-foreground bg-card text-card-foreground p-6 rounded-[4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,0.15)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-foreground bg-muted text-foreground uppercase rounded-[2px]">
                RESOURCE
              </span>
              <svg className="size-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-bold font-mono uppercase tracking-tight">
              Curated Guides
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Read focused articles and checklists addressing specific architectures, patterns, and code optimization rules without marketing fluff.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-muted-foreground">
            UPDATED WEEKLY
          </span>
        </div>

        {/* Card 3: Multi-device Progress (Spans 1 col) */}
        <div className="border-2 border-foreground bg-card text-card-foreground p-6 rounded-[4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,0.15)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-foreground bg-muted text-foreground uppercase rounded-[2px]">
                CLOUD
              </span>
              <svg className="size-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold font-mono uppercase tracking-tight">
              Progress Syncing
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Save your achievements. Link your GitHub or local credentials to instantly restore your progress states across multiple devices.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-muted-foreground">
            SECURE ACCESS
          </span>
        </div>

        {/* Card 4: High Contrast Themes (Spans 2 cols on md) */}
        <div className="border-2 border-foreground bg-card text-card-foreground p-6 rounded-[4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,0.15)] md:col-span-2 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-foreground bg-primary/10 text-primary uppercase rounded-[2px]">
                THEMING
              </span>
              <svg className="size-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold font-mono uppercase tracking-tight">
              IDE-Inspired High Contrast Themes
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Toggle between stark, high-contrast light mode and monochromatic dark mode. Our visual system is designed to complement developer environments like VS Code, JetBrains IDEs, or Neovim. Ensures comfortable reading over long study hours.
            </p>
          </div>
          <div className="text-xs font-mono font-bold text-muted-foreground">
            COMPATIBLE WITH WCAG CONTRAST RATIOS
          </div>
        </div>

        {/* Card 5: Community Built (Spans 3 cols full width on md) */}
        <div className="border-2 border-foreground bg-card text-card-foreground p-6 rounded-[4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,0.15)] md:col-span-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-foreground bg-muted text-foreground uppercase rounded-[2px]">
              DEVELOPER COMMUNITY
            </span>
            <h2 className="text-xl font-bold font-mono uppercase tracking-tight">
              Open-Source & Community-Driven Content
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We believe knowledge should be public. Submit roadmaps, propose modifications to nodes, review open issues, and join other developers in editing guides.
            </p>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 border-2 border-foreground bg-foreground text-background font-mono font-bold text-xs uppercase tracking-wider hover:bg-muted hover:text-foreground transition-all duration-150 rounded-[2px] shrink-0"
          >
            Contribute on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
