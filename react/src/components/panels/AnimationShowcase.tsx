import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/ui/FadeIn';
import { HoverCard } from '@/components/ui/HoverCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SkeletonPulse } from '@/components/ui/SkeletonPulse';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Sparkles, Heart, Star, Zap } from 'lucide-react';

interface AnimationShowcaseProps {
  onNavigate?: (view: string) => void;
}

export function AnimationShowcase({ onNavigate }: AnimationShowcaseProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const handleSkeletonDemo = () => {
    setShowSkeleton(true);
    setTimeout(() => setShowSkeleton(false), 2000);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">UI Animation Showcase</h1>
        <p className="text-muted-foreground">
          Explore the enhanced UI components with smooth animations and interactions
        </p>
      </div>

      {/* FadeIn Animations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Fade In Animations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FadeIn direction="up" delay={0.1}>
            <Card className="text-center p-4">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-medium">Fade Up</h3>
            </Card>
          </FadeIn>
          <FadeIn direction="down" delay={0.2}>
            <Card className="text-center p-4">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <h3 className="font-medium">Fade Down</h3>
            </Card>
          </FadeIn>
          <FadeIn direction="left" delay={0.3}>
            <Card className="text-center p-4">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-medium">Fade Left</h3>
            </Card>
          </FadeIn>
          <FadeIn direction="right" delay={0.4}>
            <Card className="text-center p-4">
              <Zap className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-medium">Fade Right</h3>
            </Card>
          </FadeIn>
        </div>
      </div>

      {/* Hover Effects */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Hover Effects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HoverCard className="text-center p-6">
            <h3 className="font-medium mb-2">Hover Me!</h3>
            <p className="text-sm text-muted-foreground">This card lifts on hover</p>
          </HoverCard>
          <HoverCard className="text-center p-6">
            <h3 className="font-medium mb-2">Interactive Card</h3>
            <p className="text-sm text-muted-foreground">Smooth hover animations</p>
          </HoverCard>
          <HoverCard className="text-center p-6">
            <h3 className="font-medium mb-2">Enhanced UX</h3>
            <p className="text-sm text-muted-foreground">Better user feedback</p>
          </HoverCard>
        </div>
      </div>

      {/* Button Interactions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Button Interactions</h2>
        <div className="flex flex-wrap gap-4">
          <AnimatedButton>Animated Button</AnimatedButton>
          <AnimatedButton variant="outline">Outline Style</AnimatedButton>
          <AnimatedButton variant="secondary">Secondary</AnimatedButton>
          <AnimatedButton variant="destructive">Destructive</AnimatedButton>
        </div>
      </div>

      {/* Loading States */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Loading States</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={handleLoadingDemo} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Show Loading Demo'}
            </Button>
            {isLoading && <LoadingSpinner size="md" />}
          </div>
          
          <div className="flex items-center gap-4">
            <LoadingSpinner size="sm" />
            <span className="text-sm">Small</span>
            <LoadingSpinner size="md" />
            <span className="text-sm">Medium</span>
            <LoadingSpinner size="lg" />
            <span className="text-sm">Large</span>
          </div>
        </div>
      </div>

      {/* Skeleton Loading */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Skeleton Loading</h2>
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={handleSkeletonDemo}>Show Skeleton Demo</Button>
        </div>
        <Card className="p-4">
          {showSkeleton ? (
            <div className="space-y-3">
              <SkeletonPulse height="24px" width="60%" />
              <SkeletonPulse height="16px" width="100%" />
              <SkeletonPulse height="16px" width="80%" />
              <div className="flex gap-2">
                <SkeletonPulse height="32px" width="80px" />
                <SkeletonPulse height="32px" width="80px" />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium mb-2">Content Loaded</h3>
              <p className="text-muted-foreground mb-2">
                This content shows after the skeleton loading state.
              </p>
              <p className="text-muted-foreground">
                Skeleton loaders provide better perceived performance.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm">Action 1</Button>
                <Button size="sm" variant="outline">Action 2</Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Scroll Reveal */}
      <ScrollReveal>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Scroll Reveal</h2>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">This content animates on scroll</h3>
            <p className="text-muted-foreground">
              Scroll up and down to see the reveal animation. The component uses 
              Framer Motion's useInView hook to trigger animations when elements 
              come into the viewport.
            </p>
          </Card>
        </div>
      </ScrollReveal>

      {/* Gradient Background */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Interactive Background</h2>
        <div className="relative h-32 rounded-lg overflow-hidden">
          <GradientBackground className="h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white font-medium bg-black/20 px-4 py-2 rounded">
              Move your mouse around to see the gradient follow
            </p>
          </div>
        </div>
      </div>

      {/* Back to main app */}
      <div className="pt-8 border-t">
        <AnimatedButton 
          onClick={() => onNavigate?.('chat')}
          className="w-full"
        >
          Back to Chat
        </AnimatedButton>
      </div>
    </div>
  );
}