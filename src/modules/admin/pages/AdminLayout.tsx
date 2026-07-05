import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Briefcase, Layers, Map, Users, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navItems = [
  { name: 'Careers', path: '/admin/careers', icon: Briefcase },
  { name: 'Skills', path: '/admin/skills', icon: Layers },
  { name: 'Roadmaps', path: '/admin/roadmaps', icon: Map },
  { name: 'Users', path: '/admin/users', icon: Users },
];

export const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-64 border-r border-border bg-card p-4 flex flex-col">
        <h2 className="mb-6 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
          Admin Menu
        </h2>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                twMerge(
                  clsx(
                    'group flex items-center rounded-[2px] px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out font-mono uppercase tracking-wide border border-transparent',
                    isActive
                      ? 'bg-primary text-primary-foreground border-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:border-foreground'
                  )
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-auto pt-4 border-t border-border">
          <NavLink
            to="/"
            className="group flex items-center rounded-[2px] px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out font-mono uppercase tracking-wide border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground hover:border-foreground"
          >
            <ArrowLeft className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            Back to Website
          </NavLink>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};
