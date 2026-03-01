import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.SHEET_ID!;
const SHEET_NAME = 'daily_logs';
const HABITS_SHEET = 'habits';

export type DayEntry = {
  date: string;
  habits: Record<string, number>;
  score: number;
};

export type Habit = {
  name: string;
  label: string;
  emoji: string;
};

const getAuth = () => {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

export async function getHabits(): Promise<Habit[]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${HABITS_SHEET}!A2:B`,
  });

  const rows = response.data.values || [];
  return rows.map((row) => ({
    name: row[0]?.toLowerCase().replace(/\s+/g, '_'),
    label: row[0],
    emoji: row[1] || '✅',
  }));
}

export async function getAllEntries(): Promise<DayEntry[]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const habits = await getHabits();
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A2:Y`,
  });

  const rows = response.data.values || [];
  return rows.map((row) => {
    const habitValues: Record<string, number> = {};
    habits.forEach((habit, i) => {
      habitValues[habit.name] = parseInt(row[i + 1] || '0');
    });
    
    const score = Object.values(habitValues).reduce((sum, val) => sum + val, 0);
    
    return {
      date: row[0],
      habits: habitValues,
      score,
    };
  });
}

export async function getTodayEntry(date: string): Promise<DayEntry | null> {
  const entries = await getAllEntries();
  return entries.find((e) => e.date === date) || null;
}

export async function updateHabit(date: string, habitName: string, value: number) {
  const entries = await getAllEntries();
  const habits = await getHabits();
  const index = entries.findIndex((e) => e.date === date);

  if (index === -1) {
    await createDay(date);
    return updateHabit(date, habitName, value);
  }

  const rowIndex = index + 2;
  const habitIndex = habits.findIndex((h) => h.name === habitName);
  const colLetter = String.fromCharCode(66 + habitIndex); // B, C, D, etc.

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!${colLetter}${rowIndex}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[value]] },
  });
}

export async function createDay(date: string) {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const habits = await getHabits();
  
  const values = [date, ...Array(habits.length).fill(0)];
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:Y`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values],
    },
  });
}
