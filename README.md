# HOWEVER-YOUR-MOTHER: A Digital Memory Box

"HOWEVER-YOUR-MOTHER" is a digital, crowdsourced box of multimedia memories built for our friend, Joe Bobby, a man of multiple interests. It allows friends and contributors to create and share memories, including rich text, images (via external URLs for now), Spotify embeds, and YouTube videos. The project also features a "Joe Bobby Lore" section for humorous anecdotes.

This project is built with [Next.js](https://nextjs.org/) (App Router), TypeScript, and uses Supabase as its backend for storing memories and lore. Styling is done with CSS Modules.

## Getting Started

### Prerequisites

- Node.js (v18.x recommended, as specified in `package.json`)
- npm, yarn, or pnpm
- A Supabase project.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd however-your-mother
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of the project and add the following environment variables. Obtain these from your Supabase project settings:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_public_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key # Used for admin tasks if any, handle with care
    SUPABASE_JWT_SECRET=your_supabase_jwt_secret # Found in Supabase Auth settings

    # Key for encrypting memory passwords (generate a strong random string)
    PASSWORD_ENCRYPTION_KEY=your_strong_secret_password_encryption_key

    # The full URL of your application when running locally or deployed
    # For local development:
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    # For Vercel deployment (replace with your actual Vercel URL):
    # NEXT_PUBLIC_APP_URL=https://however-your-mother-XXXX.vercel.app 
    ```
    **Important:** You will also need to set these same environment variables in your Vercel project settings for deployment.

4.  **Set up Supabase Database:**
    Ensure your Supabase project has the following tables with the correct schemas:
    *   `memories`: (columns: `id`, `title`, `slug`, `author`, `short_description`, `content`, `thumbnail_url`, `spotify_playlist_id`, `password`, `created_at`, `updated_at`, `memory_date`)
    *   `lores`: (columns: `id`, `content`, `is_approved`, `created_at`)
    Refer to the DDL statements used during development if needed, or inspect types in `src/types/index.ts`.
    Ensure RLS policies are configured appropriately (or disabled for initial development/testing if preferred, though not recommended for production).

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `dev`: Runs the app in development mode.
- `build`: Creates a production build of the app.
- `start`: Starts a Next.js production server (after running `build`).
- `lint`: Runs ESLint for code analysis.

## Learn More About Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import your project into Vercel.
3.  **Configure Environment Variables** in the Vercel project settings as defined in the "Set up Environment Variables" section above.
4.  Ensure the **Node.js Version** in Vercel project settings (under "General") is set to 18.x (or as per `package.json` `engines` field) for compatibility with native modules like `argon2`.
5.  Deploy!

Check out the official [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
