import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Camera, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface ProfilePictureUploadProps {
  avatar: string;
  name: string;
  onAvatarChange?: (url: string) => void;
}

export const ProfilePictureUpload = ({ avatar, name, onAvatarChange }: ProfilePictureUploadProps) => {
  const { uploadAvatar } = useUser();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Animations
  const avatarVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: shouldReduceMotion ? { scale: 1 } : { scale: 1.02, rotate: 1 },
    uploading: shouldReduceMotion ? { scale: 1 } : { scale: 0.98, rotate: 0 }
  };

  const overlayVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  // Enhanced file validation
  const validateFile = (file: File): string | null => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a JPG, PNG, GIF, or WebP image.';
    }

    if (file.size > MAX_SIZE) {
      return 'Image size must be less than 5MB.';
    }

    return null;
  };

  const handleFileSelect = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Invalid file",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadComplete(false);

      // Simulate realistic upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 150);

      const newAvatarUrl = await uploadAvatar(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadComplete(true);
      
      // Show completion state briefly
      setTimeout(() => {
        onAvatarChange?.(newAvatarUrl);
        setUploadComplete(false);
      }, 1000);
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCount = prev - 1;
      if (newCount === 0) {
        setIsDragging(false);
      }
      return newCount;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  // Keyboard support
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerFileInput();
    }
  }, []);

  // Paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) return;
      
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            handleFileSelect(file);
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div ref={containerRef} className="space-y-4">
      <motion.div 
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      >
        <div className="relative">
          <motion.div
            className={`relative group cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full ${
              isDragging ? 'scale-105 ring-2 ring-primary' : ''
            }`}
            variants={avatarVariants}
            initial="idle"
            whileHover="hover"
            animate={isUploading ? "uploading" : "idle"}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={triggerFileInput}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Change profile picture for ${name}. Current picture: ${avatar ? 'custom image' : 'default avatar'}`}
            aria-describedby="avatar-instructions"
          >
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={avatar} alt={name} className="object-cover" />
              <AvatarFallback className="text-2xl font-semibold bg-muted">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            
            {/* Hover overlay */}
            <AnimatePresence>
              {!isUploading && (
                <motion.div 
                  className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                >
                  <div className="text-white text-center">
                    <Camera className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Change</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Drag overlay */}
            <AnimatePresence>
              {isDragging && (
                <motion.div 
                  className="absolute inset-0 bg-primary/20 rounded-full flex items-center justify-center border-2 border-dashed border-primary"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                >
                  <div className="text-primary text-center">
                    <Upload className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Drop here</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Upload progress */}
            <AnimatePresence>
              {isUploading && (
                <motion.div 
                  className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-white text-center w-20">
                    {uploadComplete ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                      >
                        <CheckCircle className="h-8 w-8 mx-auto mb-1 text-green-400" />
                        <span className="text-xs">Complete!</span>
                      </motion.div>
                    ) : (
                      <>
                        <Progress value={uploadProgress} className="mb-2" />
                        <span className="text-xs">{Math.round(uploadProgress)}%</span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="text-center">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p id="avatar-instructions" className="text-sm text-muted-foreground mt-1">
            Click, drag & drop, or paste to upload a new photo
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG, GIF, WebP • Max 5MB
          </p>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={triggerFileInput}
              disabled={isUploading}
              className="hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-primary"
              aria-describedby="upload-button-description"
            >
              <Camera className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload New Photo'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p id="upload-button-description">Upload a new profile picture</p>
          </TooltipContent>
        </Tooltip>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Upload profile picture file"
        />
      </motion.div>
    </div>
  );
};