/**
 * ThoughtTimeline - Collapsible timeline showing structured thinking steps
 * Privacy-safe: only shows high-level statuses, no chain-of-thought
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  XCircle, 
  Loader2,
  Brain,
  Search,
  FileText,
  Zap,
  Target
} from 'lucide-react';
import { useChat } from '@/providers/ChatProvider';
import { ThoughtStep, ThoughtStepStatus } from '@/lib/chatEvents';

interface ThoughtTimelineProps {
  visible?: boolean;
  className?: string;
}

export function ThoughtTimeline({ 
  visible = true, 
  className = '' 
}: ThoughtTimelineProps) {
  const { thinking } = useChat();
  
  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!visible || !thinking.visible) {
    return null;
  }
  
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="text-xs font-medium text-muted-foreground mb-2">
        What I'm doing
      </div>
      
      <div className="space-y-2">
        <AnimatePresence>
          {thinking.steps.map((step, index) => (
            <StepRow 
              key={step.id} 
              step={step} 
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface StepRowProps {
  step: ThoughtStep;
  index: number;
  prefersReducedMotion: boolean;
}

function StepRow({ step, index, prefersReducedMotion }: StepRowProps) {
  // Calculate duration if step is done
  const duration = step.startedAt && step.endedAt 
    ? step.endedAt - step.startedAt 
    : undefined;
  
  // Get appropriate icon and colors based on status
  const getStepIcon = (status: ThoughtStepStatus) => {
    switch (status) {
      case 'active':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case 'done':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  // Get step-specific icon
  const getContextIcon = (stepId: string) => {
    switch (stepId) {
      case 'understand':
        return <Brain className="h-3 w-3" />;
      case 'plan':
        return <Target className="h-3 w-3" />;
      case 'retrieve':
        return <Search className="h-3 w-3" />;
      case 'tool':
        return <Zap className="h-3 w-3" />;
      case 'compose':
        return <FileText className="h-3 w-3" />;
      case 'finalize':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };
  
  // Get rail color based on status
  const getRailColor = (status: ThoughtStepStatus) => {
    switch (status) {
      case 'active':
        return 'border-primary';
      case 'done':
        return 'border-green-500';
      case 'error':
        return 'border-destructive';
      default:
        return 'border-muted';
    }
  };
  
  const animations = prefersReducedMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 }
  } : {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { 
      duration: 0.2, 
      delay: index * 0.08,
      ease: [0.4, 0, 0.2, 1] as const
    }
  };
  
  const iconAnimations = prefersReducedMotion ? {} : {
    scale: step.status === 'active' ? [1, 1.1, 1] : 1,
    transition: step.status === 'active' ? {
      duration: 1.5,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1] as const
    } : { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }
  };
  
  return (
    <motion.div
      className="flex items-start gap-3 relative"
      {...animations}
    >
      {/* Left rail with status indicator */}
      <div className="flex flex-col items-center">
        {/* Status icon */}
        <motion.div
          className="relative z-10 bg-card border-2 rounded-full p-1"
          animate={iconAnimations}
        >
          {getStepIcon(step.status)}
        </motion.div>
        
        {/* Connecting line */}
        <div 
          className={`w-0.5 h-6 border-l-2 mt-1 ${getRailColor(step.status)}`}
          style={{ opacity: index < 4 ? 1 : 0 }} // Hide line after last step
        />
      </div>
      
      {/* Step content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-center gap-2 mb-1">
          {/* Context icon */}
          <div className="text-muted-foreground">
            {getContextIcon(step.id)}
          </div>
          
          {/* Step label */}
          <span className="text-sm font-medium text-card-foreground">
            {step.label}
            {step.toolName && (
              <span className="text-muted-foreground ml-1">
                ({step.toolName})
              </span>
            )}
          </span>
        </div>
        
        {/* Optional note */}
        {step.note && (
          <p className="text-xs text-muted-foreground mt-1">
            {step.note}
          </p>
        )}
        
        {/* Duration badge */}
        <div className="flex items-center justify-between mt-1">
          <div></div> {/* Spacer */}
          {duration && (
            <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
              {duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(1)}s`}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Export hook for managing timeline visibility
export function useThoughtTimeline() {
  const [isVisible, setIsVisible] = React.useState(false);
  
  // Persist visibility preference
  React.useEffect(() => {
    const saved = localStorage.getItem('thought-timeline-visible');
    if (saved !== null) {
      setIsVisible(JSON.parse(saved));
    }
  }, []);
  
  const toggle = React.useCallback(() => {
    setIsVisible(prev => {
      const newValue = !prev;
      localStorage.setItem('thought-timeline-visible', JSON.stringify(newValue));
      return newValue;
    });
  }, []);
  
  return {
    isVisible,
    toggle,
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false)
  };
}