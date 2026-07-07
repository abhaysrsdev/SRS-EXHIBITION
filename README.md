# Shree Radha Exhibition

This is a Next.js application designed to manage exhibition data, leads, and assets. It integrates with Supabase for data management and Google Spreadsheets for reporting or data syncing.

## Tech Stack & Features

*   **Framework:** [Next.js](https://nextjs.org/) (v16.2.9)
*   **UI Library:** React 19
*   **Styling:** Tailwind CSS (v4)
*   **Icons:** Lucide React
*   **Forms & Validation:** React Hook Form + Zod
*   **Database & Auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
*   **External Integrations:** Google Spreadsheet API (`google-spreadsheet`, `google-auth-library`)
*   **OCR / Image Processing:** Tesseract.js
*   **Notifications:** React Hot Toast

## Dependencies

Here is a comprehensive list of the core dependencies used in this project:

### Main Dependencies
*   `@hookform/resolvers`: ^5.4.0
*   `@supabase/ssr`: ^0.12.0
*   `@supabase/supabase-js`: ^2.108.2
*   `google-auth-library`: ^10.9.0
*   `google-spreadsheet`: ^5.3.0
*   `lucide-react`: ^1.21.0
*   `next`: 16.2.9
*   `react`: 19.2.4
*   `react-dom`: 19.2.4
*   `react-hook-form`: ^7.80.0
*   `react-hot-toast`: ^2.6.0
*   `tesseract.js`: ^7.0.0
*   `zod`: ^4.4.3

### Dev Dependencies
*   `@tailwindcss/postcss`: ^4
*   `@types/node`: ^20
*   `@types/react`: ^19
*   `@types/react-dom`: ^19
*   `eslint`: ^9
*   `eslint-config-next`: 16.2.9
*   `pg`: ^8.22.0
*   `tailwindcss`: ^4
*   `typescript`: ^5

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

Ensure you have your environment variables set up properly before starting the application, specifically for **Supabase** and **Google Auth**. Check the `.env.local` file for configurations.
