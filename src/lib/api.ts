// src/lib/api.ts
import { API_BASE_URL } from './constants'; // Import API_BASE_URL from constants.ts

export const ERROR_PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xOCAzSDZhMiAyIDAgMCAwLTIgMnYxNGMwIDEuMS45IDIgMiAyaDEyYzEuMSAwIDItLjkgMi0yVjVjMC0xLjEtLjktMi0yLTJ6TTEyIDlhMyAzIDAgMSAwIDAgNmMwLTEuNy0yLTItMi0zLjVBMi41IDIuNSAwIDAgMSAxMiA5eiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTYuNSIgcj0iLjUiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=';

export interface Font {
  name: string;
  value: string;
}

export interface FontCategory {
  name: string;
  fonts: Font[];
}

export const fetchFonts = async (): Promise<FontCategory[]> => {
  const response = await fetch(`${API_BASE_URL}/fonts`);
  if (!response.ok) throw new Error('Failed to fetch fonts');
  const data = await response.json();

  const availableFonts = data.available_fonts;
  if (!availableFonts) {
    throw new TypeError("API response did not contain 'available_fonts' field.");
  }

  const categories: { [key: string]: Font[] } = {};
  for (const fontName in availableFonts) {
    const fontInfo = availableFonts[fontName];
    const categoryName = fontInfo.typeface || 'Uncategorized';

    if (!categories[categoryName]) {
      categories[categoryName] = [];
    }
    categories[categoryName].push({ name: fontName, value: fontName });
  }

  const transformedData: FontCategory[] = Object.keys(categories).map(name => ({
    name,
    fonts: categories[name],
  }));

  return transformedData;
};

export interface GenerateEmojiPayload {
  text: string;
  width: number;
  height: number;
  align: 'left' | 'center' | 'right';
  color: string;
  background_color: string;
  typeface_name: string;
  size_fixed: boolean;
  disable_stretch: boolean;
}

export const generateEmoji = async (payload: GenerateEmojiPayload): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/emoji`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`APIエラー: ${response.status} ${response.statusText}`);
  }

  const imageBlob = await response.blob();
  return imageBlob;
};