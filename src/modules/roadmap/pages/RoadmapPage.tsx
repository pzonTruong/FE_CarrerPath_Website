import { useNavigate } from 'react-router-dom';
import { tokenStore } from '@/modules/auth/store/token.store';
import type { CareerPath } from '../types';
import { CareerCard } from '../components/CareerCard';
import careerPathsData from '../data/careers.json';

const careerPaths = careerPathsData as CareerPath[];

export const RoadmapPage = () => {
  const navigate = useNavigate();
  const isSignedIn = Boolean(tokenStore.get());

  const handleSelectCareer = (career: CareerPath) => {
    navigate(`/roadmap/${career.id}`);
  };

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {!isSignedIn && (
        <div className="border-2 border-primary bg-primary/10 text-primary p-4 rounded-lg font-mono text-xs uppercase tracking-wider flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            [GUEST MODE] YOU ARE VIEWING THIS ROADMAP IN PREVIEW MODE WITH MOCK INFO.
          </div>
          <button
            onClick={() => {
              window.location.href = '/login';
            }}
            className="px-4 py-2 border-2 border-primary bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all rounded-[2px] cursor-pointer shrink-0"
          >
            SIGN IN TO SAVE PROGRESS
          </button>
        </div>
      )}

      <div className="space-y-8 animate-fadeIn">
        <section className="border-2 border-foreground p-6 bg-card text-card-foreground rounded-lg space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            Directory
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight uppercase font-mono">
            Career Roadmaps
          </h1>
          <p className="text-sm text-muted-foreground font-sans">
            Select an interactive path below to explore ordered stages, skill requirements, and curated learning resources.
          </p>
        </section>

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
    </div>
  );
};
