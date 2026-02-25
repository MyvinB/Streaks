# Consistency Tracker PWA

A personal habit tracking Progressive Web App with Google Sheets as the database.

## Features

- Track 4 daily habits: LeetCode, Gym, Guitar, Family
- Streak calculation (3+ habits = success)
- Statistics dashboard
- GitHub-style calendar heatmap
- PWA installable on mobile
- Dark mode design
- Optimistic UI updates

## Setup

### 1. Google Sheets Setup

1. Create a new Google Sheet
2. Create a sheet named `daily_logs` with headers:
   ```
   Date | LeetCode | Gym | Guitar | Family | Score
   ```
3. In column F (Score), add formula: `=SUM(B2:E2)` and drag down

### 2. Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Sheets API
4. Create Service Account:
   - Go to IAM & Admin > Service Accounts
   - Create Service Account
   - Download JSON key
5. Share your Google Sheet with the service account email (found in JSON)

### 3. Environment Variables

Create `.env.local`:

```bash
GOOGLE_SHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_BASE64=base64_encoded_json
```

To encode service account JSON:
```bash
cat service-account.json | base64
```

### 4. Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## PWA Installation

On mobile, tap "Add to Home Screen" when prompted.

## Architecture

- **Data Layer**: Google Sheets (daily_logs sheet)
- **Analytics**: Calculated in app (streak, consistency %)
- **State**: React with optimistic updates
- **API**: Next.js API routes

## Adding New Habits

1. Add column in Google Sheet
2. Update `HabitName` type in `types/index.ts`
3. Add habit to `habits` array in `components/Home.tsx`
4. Update column mapping in `lib/googleSheets.ts`
