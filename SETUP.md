# Setup Guide

## Step 1: Google Cloud Setup

1. Go to https://console.cloud.google.com
2. Create a new project (e.g., "Consistency Tracker")
3. Enable Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Name it (e.g., "sheets-access")
4. Click "Create and Continue"
5. Skip role assignment (click "Continue")
6. Click "Done"
7. Click on the created service account
8. Go to "Keys" tab
9. Click "Add Key" > "Create new key"
10. Choose "JSON" format
11. Download the JSON file

## Step 3: Create Google Sheet

1. Go to https://sheets.google.com
2. Create a new spreadsheet
3. Rename the first sheet to `daily_logs`
4. Add headers in row 1:
   - A1: Date
   - B1: LeetCode
   - C1: Gym
   - D1: Guitar
   - E1: Family
   - F1: Score
5. In cell F2, add formula: `=SUM(B2:E2)`
6. Copy the spreadsheet ID from the URL:
   - URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
7. Click "Share" button
8. Add the service account email (from the JSON file, field: `client_email`)
9. Give it "Editor" access

## Step 4: Configure Environment Variables

1. Open the downloaded JSON file
2. Encode it to base64:
   ```bash
   cat service-account.json | base64
   ```
3. Copy the output
4. Edit `.env.local` file:
   ```
   GOOGLE_SHEET_ID=your_spreadsheet_id
   GOOGLE_SERVICE_ACCOUNT_BASE64=paste_base64_here
   ```

## Step 5: Run the App

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Step 6: Deploy to Vercel

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_BASE64`
6. Click "Deploy"

## Step 7: Install as PWA

On mobile:
1. Open the deployed URL
2. Tap the browser menu
3. Select "Add to Home Screen"
4. The app will appear as a native app icon

## Troubleshooting

**Error: "Failed to fetch entries"**
- Check if Google Sheets API is enabled
- Verify service account has access to the sheet
- Check environment variables are set correctly

**Error: "Cannot find module googleapis"**
- Run `npm install googleapis`

**PWA not installing**
- Make sure you're using HTTPS (Vercel provides this automatically)
- Create actual icon files (icon-192.png and icon-512.png)
