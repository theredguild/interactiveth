'use client';

import { useState } from 'react';
import { Sidebar, MobileMenuButton } from './sidebar';

interface TutorialLayoutProps {
  children: React.ReactNode;
}

export function TutorialLayout({ children }: TutorialLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <MobileMenuButton onClick={() => setSidebarOpen(true)} />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-[250px]">
        {children}
      </main>
    </div>
  );
}
