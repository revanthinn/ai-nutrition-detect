import { useCallback, useState } from "react";
import { Upload, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FirebaseService } from "@/services/firebase";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

interface ImageUploaderProps {
  onAnalysisComplete: (result: any) => void;
}

export const ImageUploader = ({ onAnalysisComplete }: ImageUploaderProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const { toast } = useToast();
  const { user } = useFirebaseAuth();

  // Compress image before processing
  const compressImage = (file: File, maxWidth: number = 1024, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const analyzeImage = async (file: File) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to analyze images.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    
    try {
      // Step 1: Compress image (10%)
      setCurrentStep('Compressing image...');
      setProgress(10);
      const compressedFile = await compressImage(file);
      
      // Step 2: Analyze image with OpenAI (20-80%)
      setCurrentStep('Analyzing with AI...');
      setProgress(20);
      
      const analysisResult = await FirebaseService.analyzeFoodImage(compressedFile, (progress) => {
        setProgress(20 + (progress * 0.6)); // 20% to 80%
      });

      // Step 3: Upload image to Firebase Storage (80-100%)
      setCurrentStep('Saving to cloud...');
      setProgress(80);
      
      const imageUrl = await FirebaseService.uploadImage(compressedFile, user.uid);
      setProgress(100);

      onAnalysisComplete({
        ...analysisResult,
        imageUrl,
      });

      toast({
        title: "Analysis complete!",
        description: "Your meal has been analyzed successfully.",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      analyzeImage(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      analyzeImage(file);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
        dragActive
          ? 'border-primary bg-primary/5 scale-105'
          : 'border-border hover:border-primary/50'
      } ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
          {isAnalyzing ? (
            <div className="animate-spin">
              <Loader2 className="w-12 h-12 text-primary" />
            </div>
          ) : (
            <Upload className="w-12 h-12 text-primary" />
          )}
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">
            {isAnalyzing ? 'Analyzing your meal...' : 'Upload a food image'}
          </h3>
          <p className="text-muted-foreground">
            {isAnalyzing ? currentStep : 'Drag and drop or click to select'}
          </p>
        </div>

        {isAnalyzing && (
          <div className="w-full max-w-xs space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            variant="hero"
            size="lg"
            disabled={isAnalyzing}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className="w-5 h-5" />
            Choose File
          </Button>
          <Button
            variant="secondary"
            size="lg"
            disabled={isAnalyzing}
            onClick={() => document.getElementById('camera-input')?.click()}
          >
            <Camera className="w-5 h-5" />
            Take Photo
          </Button>
        </div>

        <input
          id="file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          id="camera-input"
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};