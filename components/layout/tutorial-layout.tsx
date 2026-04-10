'use client';

import { useState, useEffect } from 'react';
import { Sidebar, MobileMenuButton } from './sidebar';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';
import { PageNavigation } from '@/components/navigation/page-nav';
import { SearchModal } from '@/components/navigation/search-modal';

interface TutorialLayoutProps {
  children: React.ReactNode;
}

export function TutorialLayout({ children }: TutorialLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Global keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <MobileMenuButton onClickAction={() => setSidebarOpen(true)} />
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onSearchOpen={() => setSearchOpen(true)}
      />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-[250px]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Breadcrumbs />
          {children}
          <PageNavigation />
        </div>
      </main>
      
      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
