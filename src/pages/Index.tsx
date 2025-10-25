import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { MealCard } from "@/components/MealCard";
import { AuthForm } from "@/components/AuthForm";
import { FirebaseDiagnostic } from "@/components/FirebaseDiagnostic";
import { AuthDebugger } from "@/components/AuthDebugger";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { FirebaseService } from "@/services/firebase";
import { Utensils, LogOut, History } from "lucide-react";
import type { Meal } from "@/types/firebase";
import heroFood from "@/assets/hero-food.jpg";

const Index = () => {
  const [currentMeal, setCurrentMeal] = useState<any>(null);
  const [mealHistory, setMealHistory] = useState<Meal[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  const { user, loading, logout } = useFirebaseAuth();

  // Debug: Log authentication state
  console.log('Index - User:', user);
  console.log('Index - Loading:', loading);

  useEffect(() => {
    if (user) {
      console.log('User is logged in, loading meal history...');
      loadMealHistory();
    } else {
      console.log('No user logged in');
    }
  }, [user]);

  const loadMealHistory = async () => {
    if (!user) return;
    
    try {
      const meals = await FirebaseService.getUserMeals(user.uid, 10);
      setMealHistory(meals);
    } catch (error) {
      console.error('Error loading meal history:', error);
      toast({
        title: "Error loading history",
        description: "Failed to load your meal history.",
        variant: "destructive",
      });
    }
  };

  const handleAnalysisComplete = async (result: any) => {
    setCurrentMeal(result);

    if (user) {
      try {
        await FirebaseService.saveMeal({
          userId: user.uid,
          imageUrl: result.imageUrl,
          foodItems: result.foodItems || [],
          totalNutrition: result.totalNutrition || {
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
            fiber: 0,
            sugar: 0,
            sodium: 0
          },
          analysis: result.analysis || {
            mealType: 'meal',
            healthRating: 'moderate',
            recommendations: [],
            warnings: []
          }
        });
        
        loadMealHistory();
      } catch (error) {
        console.error('Error saving meal:', error);
        toast({
          title: "Failed to save meal",
          description: "Your meal analysis is still available, but couldn't be saved to history.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setCurrentMeal(null);
      setMealHistory([]);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="w-full max-w-2xl space-y-6">
          <AuthForm />
          <AuthDebugger />
          <FirebaseDiagnostic />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative">
      {/* Hero background image */}
      <div 
        className="fixed inset-0 opacity-5 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${heroFood})` }}
      />
      
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-10 relative">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FoodVision
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-5 h-5" />
              History
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl relative">
        <div className="mb-8 text-center space-y-2">
          <h2 className="text-4xl font-bold">Track Your Nutrition</h2>
          <p className="text-lg text-muted-foreground">
            Upload a food image and get instant calorie and nutrition analysis
          </p>
        </div>

        {!showHistory ? (
          <div className="space-y-8">
            <ImageUploader onAnalysisComplete={handleAnalysisComplete} />

            {currentMeal && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-semibold mb-4">Analysis Results</h3>
                <MealCard
                  imageUrl={currentMeal.imageUrl}
                  foodItems={currentMeal.foodItems || []}
                  totalNutrition={currentMeal.totalNutrition || {
                    calories: currentMeal.dishes?.reduce((sum: number, dish: any) => sum + dish.calories, 0) || 0,
                    protein: 0,
                    fat: 0,
                    carbs: 0,
                    fiber: 0,
                    sugar: 0,
                    sodium: 0
                  }}
                  analysis={currentMeal.analysis || {
                    mealType: 'meal',
                    healthRating: 'moderate',
                    recommendations: [],
                    warnings: []
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Meal History</h3>
              <Button variant="outline" onClick={() => setShowHistory(false)}>
                Back to Upload
              </Button>
            </div>
            
            {mealHistory.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No meals tracked yet. Start by uploading your first meal!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {mealHistory.map((meal) => (
                  <MealCard
                    key={meal.id}
                    imageUrl={meal.imageUrl}
                    foodItems={meal.foodItems}
                    totalNutrition={meal.totalNutrition}
                    analysis={meal.analysis}
                    timestamp={meal.createdAt.toISOString()}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;