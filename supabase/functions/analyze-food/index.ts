import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      throw new Error('No image provided');
    }

    console.log('Analyzing food image with OpenAI...');

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );

    const imageUrl = `data:${imageFile.type};base64,${base64Image}`;

    // OpenAI API key
    const OPENAI_API_KEY = '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';

    // Call OpenAI Vision API
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
            content: `You are a professional nutritionist and food analyst. Your task is to analyze food images and provide detailed nutritional information.

IMPORTANT INSTRUCTIONS:
1. Identify ALL food items visible in the image
2. Estimate realistic portion sizes
3. Calculate accurate nutritional values
4. Provide detailed breakdown of ingredients
5. Return ONLY valid JSON format - no markdown, no code blocks, no explanations

Return a JSON object with this exact structure:
{
  "foodItems": [
    {
      "name": "Food item name",
      "description": "Brief description of the food",
      "ingredients": ["ingredient1", "ingredient2"],
      "nutrition": {
        "calories": number,
        "protein": number,
        "fat": number,
        "carbs": number,
        "fiber": number,
        "sugar": number,
        "sodium": number
      },
      "portion": "Estimated portion size",
      "healthScore": number
    }
  ],
  "totalNutrition": {
    "calories": number,
    "protein": number,
    "fat": number,
    "carbs": number,
    "fiber": number,
    "sugar": number,
    "sodium": number
  },
  "analysis": {
    "mealType": "breakfast|lunch|dinner|snack",
    "healthRating": "excellent|good|moderate|poor",
    "recommendations": ["recommendation1", "recommendation2"],
    "warnings": ["warning1", "warning2"]
  }
}

Be precise with nutritional values and realistic with portion estimates.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this food image and provide detailed nutritional analysis. Identify all food items, estimate portions, and calculate nutritional values.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', openaiResponse.status, errorText);
      
      if (openaiResponse.status === 401) {
        return new Response(
          JSON.stringify({ error: 'Invalid OpenAI API key. Please check your configuration.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (openaiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'OpenAI rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (openaiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'OpenAI API quota exceeded. Please add credits to your account.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    console.log('OpenAI Response received');

    let content = openaiData.choices[0].message.content;
    
    // Clean up the response - remove any markdown formatting
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the JSON response
    const result = JSON.parse(content);

    console.log('Parsed OpenAI result:', JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-food function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});