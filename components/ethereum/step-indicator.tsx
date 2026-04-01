'use client';

import { motion } from 'framer-motion';
import type { SimulationStep } from '@/lib/ethereum-types';
import { STEP_DESCRIPTIONS } from '@/lib/ethereum-utils';
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
  Circle,
  MapPin,
  User
} from 'lucide-react';

interface StepIndicatorProps {
  currentStep: SimulationStep;
  progress: number;
}

const steps: { key: SimulationStep; icon: React.ReactNode; label: string }[] = [
  { key: 'creating-tx', icon: <FileText className="size-4" />, label: 'Create' },
  { key: 'signing-tx', icon: <Key className="size-4" />, label: 'Sign' },
  { key: 'broadcasting', icon: <Radio className="size-4" />, label: 'Broadcast' },
  { key: 'mempool', icon: <Inbox className="size-4" />, label: 'Mempool' },
  { key: 'selecting-validator', icon: <Users className="size-4" />, label: 'Select' },
  { key: 'building-block', icon: <Box className="size-4" />, label: 'Build' },
  { key: 'proposing-block', icon: <Send className="size-4" />, label: 'Propose' },
  { key: 'attesting', icon: <Vote className="size-4" />, label: 'Attest' },
  { key: 'finalizing', icon: <Lock className="size-4" />, label: 'Finalize' },
  { key: 'complete', icon: <CheckCircle2 className="size-4" />, label: 'Done' },
];

const stepOrder = steps.map(s => s.key);

export function StepIndicator({ currentStep, progress }: StepIndicatorProps) {
  const currentIndex = stepOrder.indexOf(currentStep);
  const stepInfo = STEP_DESCRIPTIONS[currentStep] || STEP_DESCRIPTIONS['idle'];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Transaction Lifecycle</h3>
          <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary"
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="mb-6 flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const isComplete = currentIndex > index || currentStep === 'complete';
          const isCurrent = currentStep === step.key;
          const isPending = currentIndex < index && currentStep !== 'complete';

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`flex size-8 items-center justify-center rounded-full transition-all ${
                    isComplete
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                      ? 'bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2 ring-offset-background'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {isComplete ? <CheckCircle2 className="size-4" /> : step.icon}
                </motion.div>
                <span
                  className={`mt-1 text-xs ${
                    isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-1 h-0.5 w-4 ${
                    isComplete ? 'bg-primary' : 'bg-secondary'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current step info with actor and location */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-secondary/50 p-4"
      >
        <div className="flex items-center gap-2">
          {currentStep === 'idle' ? (
            <Circle className="size-5 text-muted-foreground" />
          ) : currentStep === 'complete' ? (
            <CheckCircle2 className="size-5 text-primary" />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              <Circle className="size-5 text-accent" />
            </motion.div>
          )}
          <h4 className="font-semibold text-foreground">{stepInfo.title}</h4>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{stepInfo.description}</p>
        
        {/* Actor and Location */}
        {currentStep !== 'idle' && (
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
            <div className="flex items-start gap-2">
              <User className="mt-0.5 size-4 text-primary" />
              <div>
                <p className="text-xs font-medium text-foreground">Who</p>
                <p className="text-xs text-muted-foreground">{stepInfo.actor}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 text-accent" />
              <div>
                <p className="text-xs font-medium text-foreground">Where</p>
                <p className="text-xs text-muted-foreground">{stepInfo.location}</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
