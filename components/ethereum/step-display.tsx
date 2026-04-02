'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { SimulationStep } from '@/lib/ethereum-types';
import { 
  FileText, 
  Key, 
  Radio, 
  Inbox, 
  Users, 
  Box, 
  Send, 
  Vote, 
  Lock, 
  CheckCircle2,
  MapPin,
  User
} from 'lucide-react';

interface StepDisplayProps {
  currentStep: SimulationStep;
  progress: number;
}

const steps = [
  { key: 'creating-tx', icon: <FileText className="size-3 sm:size-4" /> },
  { key: 'signing-tx', icon: <Key className="size-3 sm:size-4" /> },
  { key: 'broadcasting', icon: <Radio className="size-3 sm:size-4" /> },
  { key: 'mempool', icon: <Inbox className="size-3 sm:size-4" /> },
  { key: 'selecting-validator', icon: <Users className="size-3 sm:size-4" /> },
  { key: 'building-block', icon: <Box className="size-3 sm:size-4" /> },
  { key: 'proposing-block', icon: <Send className="size-3 sm:size-4" /> },
  { key: 'attesting', icon: <Vote className="size-3 sm:size-4" /> },
  { key: 'finalizing', icon: <Lock className="size-3 sm:size-4" /> },
  { key: 'complete', icon: <CheckCircle2 className="size-3 sm:size-4" /> },
] as const;

const stepOrder = steps.map(s => s.key);

export function StepDisplay({ currentStep, progress }: StepDisplayProps) {
  const t = useTranslations();
  const currentIndex = stepOrder.indexOf(currentStep as typeof stepOrder[number]);
  
  const getStepLabel = (stepKey: string) => {
    const labelMap: Record<string, string> = {
      'creating-tx': t('simulator.steps.create'),
      'signing-tx': t('simulator.steps.sign'),
      'broadcasting': t('simulator.steps.broadcast'),
      'mempool': t('simulator.steps.mempool'),
      'selecting-validator': t('simulator.steps.select'),
      'building-block': t('simulator.steps.build'),
      'proposing-block': t('simulator.steps.propose'),
      'attesting': t('simulator.steps.attest'),
      'finalizing': t('simulator.steps.finalize'),
      'complete': t('simulator.steps.done'),
    };
    return labelMap[stepKey] || stepKey;
  };
  
  const stepInfo = currentStep === 'idle' ? null : {
    title: t(`simulator.stepDescriptions.${currentStep}.title`),
    description: t(`simulator.stepDescriptions.${currentStep}.description`),
    actor: t(`simulator.stepDescriptions.${currentStep}.actor`),
    location: t(`simulator.stepDescriptions.${currentStep}.location`),
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      {/* Header with progress */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground sm:text-base">{t('simulator.steps.lifecycle')}</h3>
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary sm:w-32">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary"
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{t('simulator.steps.progress', { percent: Math.round(progress) })}</span>
        </div>
      </div>

      {/* Compact horizontal step indicators */}
      <div className="flex items-center justify-between gap-1">
        {steps.map((step, index) => {
          const isComplete = currentIndex > index || currentStep === 'complete';
          const isCurrent = currentStep === step.key;
          const isPending = currentIndex < index && currentStep !== 'complete';

          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex w-full flex-col items-center">
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`flex size-6 items-center justify-center rounded-full transition-all sm:size-8 ${
                    isComplete
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                      ? 'bg-accent text-accent-foreground ring-2 ring-accent ring-offset-1 ring-offset-background'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {isComplete ? <CheckCircle2 className="size-3 sm:size-4" /> : step.icon}
                </motion.div>
                <span
                  className={`mt-1 hidden text-xs sm:block ${
                    isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {getStepLabel(step.key)}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-0.5 h-0.5 flex-1 sm:mx-1 ${
                    isComplete ? 'bg-primary' : 'bg-secondary'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current step description */}
      {stepInfo && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-lg bg-secondary/50 p-3 sm:p-4"
        >
          <h4 className="text-sm font-semibold text-foreground sm:text-base">{stepInfo.title}</h4>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stepInfo.description}</p>
          
          {/* Actor and Location - inline for compactness */}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <div className="flex items-center gap-1">
              <User className="size-3 text-primary" />
              <span className="text-muted-foreground">{stepInfo.actor}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="size-3 text-accent" />
              <span className="text-muted-foreground">{stepInfo.location}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
