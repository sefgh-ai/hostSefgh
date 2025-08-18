/**
 * Event types and data contracts for the thinking/thought-process preview system.
 * This module defines privacy-safe, structured events - no raw chain-of-thought.
 */

export type ThoughtStepStatus = "pending" | "active" | "done" | "error";

export type ThoughtStepId = 
  | "understand" 
  | "plan" 
  | "retrieve" 
  | "tool" 
  | "compose" 
  | "finalize";

export interface ThoughtStep {
  id: ThoughtStepId;
  label: string;              // e.g., "Planning response"
  status: ThoughtStepStatus;  // pending|active|done|error
  startedAt?: number;
  endedAt?: number;
  toolName?: string;          // optional: "web", "api", "code-run"
  note?: string;              // short, high-level note ONLY (no chain-of-thought)
}

export interface ChatThinkingState {
  visible: boolean;
  canCancel: boolean;
  steps: ThoughtStep[];
  activeStep?: ThoughtStepId;
}

export interface StreamChunk {
  id: string;                 // message id
  delta: string;              // streamed text
  done?: boolean;
  error?: string;
}

export interface ChatEvents {
  onCancel?: () => void;
  onRetry?: () => void;
}

export interface StreamingState {
  isStreaming: boolean;
  messageId?: string;
  content: string;
  error?: string;
  done: boolean;
}

// Type guards for runtime type checking
export function isThoughtStep(obj: unknown): obj is ThoughtStep {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'label' in obj &&
    'status' in obj
  );
}

export function isStreamChunk(obj: unknown): obj is StreamChunk {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'delta' in obj
  );
}

// Default steps for the thinking timeline
export const DEFAULT_THINKING_STEPS: Omit<ThoughtStep, 'startedAt' | 'endedAt'>[] = [
  {
    id: "understand",
    label: "Understanding request",
    status: "pending"
  },
  {
    id: "plan", 
    label: "Planning response",
    status: "pending"
  },
  {
    id: "retrieve",
    label: "Searching knowledge",
    status: "pending"
  },
  {
    id: "compose",
    label: "Composing answer",
    status: "pending"
  },
  {
    id: "finalize",
    label: "Finalizing",
    status: "pending"
  }
];

// Tool event types for inline chips
export type ToolEventType = "search" | "fetch" | "plan" | "code-run";

export interface ToolEvent {
  type: ToolEventType;
  label: string;
  icon: string; // lucide icon name
}

export const TOOL_EVENTS: Record<ToolEventType, ToolEvent> = {
  search: {
    type: "search",
    label: "Search",
    icon: "Search"
  },
  fetch: {
    type: "fetch", 
    label: "Fetch",
    icon: "Globe"
  },
  plan: {
    type: "plan",
    label: "Plan", 
    icon: "Brain"
  },
  "code-run": {
    type: "code-run",
    label: "Tool: code-run",
    icon: "Code"
  }
};