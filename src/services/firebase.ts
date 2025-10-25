import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { Meal, User, FirebaseUser } from '../types/firebase';

export class FirebaseService {
  // Meals collection operations
  static async saveMeal(mealData: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const mealsRef = collection(db, 'meals');
      const docRef = await addDoc(mealsRef, {
        ...mealData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving meal:', error);
      throw error;
    }
  }

  static async getUserMeals(userId: string, limitCount: number = 10): Promise<Meal[]> {
    try {
      const mealsRef = collection(db, 'meals');
      const q = query(
        mealsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const meals: Meal[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        meals.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Meal);
      });
      
      return meals;
    } catch (error) {
      console.error('Error fetching user meals:', error);
      throw error;
    }
  }

  static async getMeal(mealId: string): Promise<Meal | null> {
    try {
      const mealRef = doc(db, 'meals', mealId);
      const mealSnap = await getDoc(mealRef);
      
      if (mealSnap.exists()) {
        const data = mealSnap.data();
        return {
          id: mealSnap.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Meal;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching meal:', error);
      throw error;
    }
  }

  static async updateMeal(mealId: string, updateData: Partial<Meal>): Promise<void> {
    try {
      const mealRef = doc(db, 'meals', mealId);
      await updateDoc(mealRef, {
        ...updateData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  }

  static async deleteMeal(mealId: string): Promise<void> {
    try {
      const mealRef = doc(db, 'meals', mealId);
      await deleteDoc(mealRef);
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  }

  // User operations
  static async saveUser(userData: Omit<User, 'createdAt' | 'lastLoginAt'>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, {
        ...userData,
        createdAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
      });
    } catch (error) {
      // If user doesn't exist, create it
      try {
        const usersRef = collection(db, 'users');
        await addDoc(usersRef, {
          ...userData,
          createdAt: Timestamp.now(),
          lastLoginAt: Timestamp.now(),
        });
      } catch (createError) {
        console.error('Error creating user:', createError);
        throw createError;
      }
    }
  }

  static async getUser(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
          lastLoginAt: data.lastLoginAt.toDate(),
        } as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Storage operations
  static async uploadImage(file: File, userId: string): Promise<string> {
    try {
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `meal-images/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // OpenAI API call - Direct integration for better performance
  static async analyzeFoodImage(imageFile: File, onProgress?: (progress: number) => void): Promise<any> {
    try {
      onProgress?.(0);
      
      // Convert image to base64
      const arrayBuffer = await imageFile.arrayBuffer();
      onProgress?.(20);
      
      const base64Image = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data: string, byte: number) => data + String.fromCharCode(byte),
          ''
        )
      );
      onProgress?.(40);

      const imageUrl = `data:${imageFile.type};base64,${base64Image}`;

      // OpenAI API key
      const OPENAI_API_KEY = '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';

      onProgress?.(60);

      // Call OpenAI Vision API with optimized prompt
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `Analyze this food image and return ONLY valid JSON with this structure:
{
  "foodItems": [{"name": "string", "description": "string", "ingredients": ["string"], "nutrition": {"calories": number, "protein": number, "fat": number, "carbs": number, "fiber": number, "sugar": number, "sodium": number}, "portion": "string", "healthScore": number}],
  "totalNutrition": {"calories": number, "protein": number, "fat": number, "carbs": number, "fiber": number, "sugar": number, "sodium": number},
  "analysis": {"mealType": "breakfast|lunch|dinner|snack", "healthRating": "excellent|good|moderate|poor", "recommendations": ["string"], "warnings": ["string"]}
}`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this food image for nutrition information.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl,
                    detail: 'low' // Reduced detail for faster processing
                  }
                }
              ]
            }
          ],
          max_tokens: 1000, // Reduced token limit
          temperature: 0.1 // Lower temperature for faster response
        }),
      });

      onProgress?.(80);

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error('OpenAI API error:', openaiResponse.status, errorText);
        
        if (openaiResponse.status === 401) {
          throw new Error('Invalid OpenAI API key. Please check your configuration.');
        }
        
        if (openaiResponse.status === 429) {
          throw new Error('OpenAI rate limit exceeded. Please try again later.');
        }
        
        if (openaiResponse.status === 402) {
          throw new Error('OpenAI API quota exceeded. Please add credits to your account.');
        }
        
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const openaiData = await openaiResponse.json();
      onProgress?.(90);

      let content = openaiData.choices[0].message.content;
      
      // Clean up the response - remove any markdown formatting
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Parse the JSON response
      const result = JSON.parse(content);
      onProgress?.(100);

      return result;
    } catch (error) {
      console.error('Error analyzing food image:', error);
      throw error;
    }
  }
}
