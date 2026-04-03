'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Bug, 
  Scan, 
  FileWarning, 
  Lock, 
  Radio,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { TutorialLayout } from '@/components/layout/tutorial-layout';

const SECURITY_MODULES = [
  {
    id: 'sandwich-attack',
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    difficulty: 'Beginner',
    difficultyColor: 'text-green-500',
  },
  {
    id: 'front-running',
    icon: Eye,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    difficulty: 'Beginner',
    difficultyColor: 'text-green-500',
  },
  {
    id: 'reentrancy',
    icon: Bug,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    difficulty: 'Intermediate',
    difficultyColor: 'text-yellow-500',
  },
  {
    id: 'oracle-manipulation',
    icon: Scan,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    difficulty: 'Intermediate',
    difficultyColor: 'text-yellow-500',
  },
  {
    id: 'rogue-proposer',
    icon: FileWarning,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    difficulty: 'Intermediate',
    difficultyColor: 'text-yellow-500',
  },
  {
    id: 'double-signing',
    icon: Lock,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    difficulty: 'Advanced',
    difficultyColor: 'text-red-500',
  },
  {
    id: 'eclipse-attack',
    icon: Radio,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    difficulty: 'Advanced',
    difficultyColor: 'text-red-500',
  },
  {
    id: '51-percent',
    icon: FileWarning,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    difficulty: 'Advanced',
    difficultyColor: 'text-red-500',
  },
];

export default function SecurityPage() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <TutorialLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 text-center overflow-hidden bg-gradient-to-b from-red-500/5 via-background to-background">
          <div className="container relative mx-auto px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30"
            >
              <Shield className="size-8 text-red-500" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight md:text-5xl"
            >
              Ethereum Security
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
            >
              Learn about major attack vectors, vulnerabilities, and how to protect yourself and your protocols
            </motion.p>

            {/* Warning Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="size-5 text-yellow-500 shrink-0" />
                <p className="text-sm text-yellow-700">
                  <strong>Educational Purpose Only:</strong> These simulations demonstrate attack mechanics for learning. Never use this knowledge maliciously. Always prioritize defensive security.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-red-500">$3.6B+</p>
                <p className="text-xs text-muted-foreground mt-1">Lost to DeFi hacks (2020-2024)</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-orange-500">600+</p>
                <p className="text-xs text-muted-foreground mt-1">Documented attacks</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-yellow-500">8</p>
                <p className="text-xs text-muted-foreground mt-1">Interactive modules</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-green-500">100%</p>
                <p className="text-xs text-muted-foreground mt-1">Prevention focus</p>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold">Attack Vectors & Defenses</h2>
              <p className="text-muted-foreground mt-2">
                Interactive simulations of real-world attack scenarios
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SECURITY_MODULES.map((module, index) => {
                const Icon = module.icon;
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/${locale}/security/${module.id}`}
                      className={`group block rounded-xl border ${module.borderColor} ${module.bgColor} p-6 transition-all duration-300 hover:shadow-lg hover:border-opacity-50`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`flex size-12 items-center justify-center rounded-xl bg-card ${module.color} shadow-sm`}>
                          <Icon className="size-6" />
                        </div>
                        <span className={`text-xs font-medium ${module.difficultyColor} bg-card px-2 py-1 rounded-full border border-border`}>
                          {module.difficulty}
                        </span>
                      </div>
                      
                      <h3 className="mt-4 text-lg font-semibold capitalize">
                        {module.id.replace(/-/g, ' ')}
                      </h3>
                      
                      <p className="mt-2 text-sm text-muted-foreground">
                        Interactive demonstration with both Beginner and Advanced modes
                      </p>

                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
                        Start Learning
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Learning Path */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-center mb-8">Recommended Learning Path</h2>
              
              <div className="space-y-4">
                {[
                  { step: 1, title: 'MEV Attacks', desc: 'Start with Sandwich Attacks and Front-Running - the most common DeFi exploits', modules: ['Sandwich Attack', 'Front-Running'] },
                  { step: 2, title: 'Smart Contract Vulnerabilities', desc: 'Learn about Reentrancy and Oracle manipulation - critical for developers', modules: ['Reentrancy', 'Oracle Manipulation'] },
                  { step: 3, title: 'Consensus Attacks', desc: 'Understand validator misbehavior and slashing conditions', modules: ['Rogue Proposer', 'Double-Signing'] },
                  { step: 4, title: 'Network-Level Attacks', desc: 'Advanced topics on network topology and majority attacks', modules: ['Eclipse Attack', '51% Attack'] },
                ].map((phase) => (
                  <div key={phase.step} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {phase.step}
                    </div>
                    <div>
                      <h3 className="font-semibold">{phase.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{phase.desc}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {phase.modules.map((mod) => (
                          <span key={mod} className="text-xs bg-secondary px-2 py-1 rounded">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Defense Reminder */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
              <CheckCircle2 className="mx-auto size-12 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold">Defense First Mindset</h2>
              <p className="mt-4 text-muted-foreground">
                Every module in this section includes comprehensive defensive measures. Understanding how attacks work is the first step to building secure protocols and protecting user funds.
              </p>
              <div className="mt-6 flex justify-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-500" />
                  Attack Prevention
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-500" />
                  Detection Methods
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-500" />
                  Mitigation Strategies
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 bg-background">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Security content based on real-world incidents and academic research.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Always follow responsible disclosure practices when discovering vulnerabilities.
            </p>
          </div>
        </footer>
      </div>
    </TutorialLayout>
  );
}
