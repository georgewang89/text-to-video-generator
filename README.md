# Text to Video Generator

A lightweight web app that converts text into short videos using the fal.ai Veo 3 model. Built with Next.js and deployed on Vercel.

## Features

- 📝 **Text Input**: Paste your script into a textarea
- ✂️ **Smart Chunking**: Automatically breaks text into smaller chunks (~500 characters)
- ✏️ **Inline Editing**: Edit each chunk before generating videos
- 🎥 **Video Generation**: Uses fal.ai's Veo 3 Fast model to create videos
- 📊 **Live Progress**: Real-time status updates (Queued → Generating → Done)
- 🎬 **Built-in Player**: View generated videos directly in the app

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your fal.ai API key:
   - Copy `.env.local` and add your API key:
   ```
   NEXT_PUBLIC_FAL_KEY=your_fal_ai_api_key_here
   ```

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
