import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Apple, Clock, TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface FoodItem {
  name: string;
  description: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  portion: string;
  healthScore: number;
}

interface Analysis {
  mealType: string;
  healthRating: string;
  recommendations: string[];
  warnings: string[];
}

interface MealCardProps {
  imageUrl?: string;
  foodItems: FoodItem[];
  totalNutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  analysis: Analysis;
  timestamp?: string;
}

export const MealCard = ({ imageUrl, foodItems, totalNutrition, analysis, timestamp }: MealCardProps) => {
  const getHealthRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍪';
      default: return '🍽️';
    }
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/50 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-[1.02]">
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Meal" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6 space-y-6">
        {/* Header with total calories and meal type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Calories</p>
              <p className="text-3xl font-bold text-primary">{totalNutrition.calories}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{getMealTypeIcon(analysis.mealType)}</span>
              <Badge variant="outline" className="capitalize">
                {analysis.mealType}
              </Badge>
            </div>
            {timestamp && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(timestamp).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Health Rating */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="font-medium">Health Rating:</span>
          </div>
          <Badge className={`capitalize ${getHealthRatingColor(analysis.healthRating)}`}>
            {analysis.healthRating}
          </Badge>
        </div>

        {/* Total Nutrition Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="text-sm text-muted-foreground">Protein</p>
            <p className="text-lg font-semibold">{totalNutrition.protein}g</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="text-sm text-muted-foreground">Fat</p>
            <p className="text-lg font-semibold">{totalNutrition.fat}g</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="text-sm text-muted-foreground">Carbs</p>
            <p className="text-lg font-semibold">{totalNutrition.carbs}g</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="text-sm text-muted-foreground">Fiber</p>
            <p className="text-lg font-semibold">{totalNutrition.fiber}g</p>
          </div>
        </div>

        {/* Food Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Apple className="w-5 h-5 text-primary" />
            Food Items ({foodItems.length})
          </h3>
          
          {foodItems.map((item, index) => (
            <div 
              key={index}
              className="p-4 rounded-xl bg-muted/50 space-y-3 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{item.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Portion: {item.portion}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="secondary">
                    {item.nutrition.calories} cal
                  </Badge>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Health:</span>
                    <span className={`text-xs font-medium ${item.healthScore >= 7 ? 'text-green-600' : item.healthScore >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {item.healthScore}/10
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Ingredients */}
              <div className="flex flex-wrap gap-1">
                {item.ingredients.map((ingredient, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {ingredient}
                  </Badge>
                ))}
              </div>
              
              {/* Nutrition breakdown */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center p-2 rounded bg-background/50">
                  <p className="text-muted-foreground">Protein</p>
                  <p className="font-medium">{item.nutrition.protein}g</p>
                </div>
                <div className="text-center p-2 rounded bg-background/50">
                  <p className="text-muted-foreground">Fat</p>
                  <p className="font-medium">{item.nutrition.fat}g</p>
                </div>
                <div className="text-center p-2 rounded bg-background/50">
                  <p className="text-muted-foreground">Carbs</p>
                  <p className="font-medium">{item.nutrition.carbs}g</p>
                </div>
                <div className="text-center p-2 rounded bg-background/50">
                  <p className="text-muted-foreground">Sugar</p>
                  <p className="font-medium">{item.nutrition.sugar}g</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations and Warnings */}
        {(analysis.recommendations.length > 0 || analysis.warnings.length > 0) && (
          <div className="space-y-3">
            {analysis.recommendations.length > 0 && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <h4 className="font-semibold text-green-800 flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysis.warnings.length > 0 && (
              <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  Warnings
                </h4>
                <ul className="space-y-1">
                  {analysis.warnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-yellow-700 flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};