# FoodVision - AI-Powered Calorie Tracker

FoodVision is a production-ready web application that uses AI to analyze food images and provide instant calorie and nutritional information.

## Features

- 📸 **Image Upload & Camera Capture** - Upload food images or take photos directly
- 🤖 **AI-Powered Analysis** - Automatic food detection using Google Gemini 2.5 Flash
- 📊 **Nutritional Breakdown** - Detailed calories, protein, fat, and carbs for each dish
- 📜 **Meal History** - Track all your meals with timestamps
- 🔐 **User Authentication** - Secure email/password authentication
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🎨 **Modern Design System** - Fresh teal/green color scheme with smooth animations

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide Icons** for beautiful icons

### Backend (Lovable Cloud)
- **PostgreSQL Database** for meal storage
- **Supabase Auth** for authentication
- **Supabase Storage** for image hosting
- **Edge Functions** for serverless API
- **Lovable AI Gateway** for Google Gemini access

## Getting Started

1. Sign up with email and password
2. Upload a food image or take a photo
3. Get instant AI analysis with nutritional info
4. View your meal history anytime

## How It Works

1. **Image Upload**: Users upload food images via drag-drop or camera
2. **AI Processing**: Image sent to edge function which calls Lovable AI Gateway
3. **Vision Analysis**: Google Gemini 2.5 Flash analyzes the image
4. **Results Display**: Detected dishes with calories and macros shown in beautiful cards
5. **Storage**: Meals saved to PostgreSQL with RLS policies for security

## Security

- Row Level Security (RLS) policies on all database tables
- Authenticated uploads only
- Secure edge functions with API key protection
- Auto-confirm email signups enabled

## Project URL

[https://lovable.dev/projects/1f0c969b-0dc9-4bac-b8c0-591b45661e0e](https://lovable.dev/projects/1f0c969b-0dc9-4bac-b8c0-591b45661e0e)

## Development

This project is built with [Lovable](https://lovable.dev) - an AI-powered full-stack development platform.

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

Click the **Publish** button in Lovable to deploy your app instantly.