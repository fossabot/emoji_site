import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';
import type { FontCategory } from '@lib/api';

type TextAlign = 'left' | 'center' | 'right';

export interface EmojiGeneratorContextType {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
  textColor: string;
  setTextColor: Dispatch<SetStateAction<string>>;
  backgroundColor: string;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  useBackgroundColor: boolean;
  setUseBackgroundColor: Dispatch<SetStateAction<boolean>>;
  textAlign: TextAlign;
  setTextAlign: Dispatch<SetStateAction<TextAlign>>;
  isSizeFixed: boolean;
  setIsSizeFixed: Dispatch<SetStateAction<boolean>>;
  isStretchDisabled: boolean;
  setIsStretchDisabled: Dispatch<SetStateAction<boolean>>;
  fontCategories: FontCategory[];
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  adContent: string | null;
}

const EmojiGeneratorContext = createContext<EmojiGeneratorContextType | null>(null);

export const EmojiGeneratorProvider = EmojiGeneratorContext.Provider;

export const useEmojiGeneratorContext = () => {
  const context = useContext(EmojiGeneratorContext);
  if (!context) {
    throw new Error('useEmojiGeneratorContext must be used within a EmojiGeneratorProvider');
  }
  return context;
};
