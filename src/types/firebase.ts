// Firebase Firestore types for the AI nutrition detection app

export interface FoodItem {
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

export interface Analysis {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  healthRating: 'excellent' | 'good' | 'moderate' | 'poor';
  recommendations: string[];
  warnings: string[];
}

export interface TotalNutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface Meal {
  id: string;
  userId: string;
  imageUrl: string;
  foodItems: FoodItem[];
  totalNutrition: TotalNutrition;
  analysis: Analysis;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

// OpenAI API response types
export interface OpenAIAnalysisResponse {
  foodItems: FoodItem[];
  totalNutrition: TotalNutrition;
  analysis: Analysis;
}

// Firebase Auth user type
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}
