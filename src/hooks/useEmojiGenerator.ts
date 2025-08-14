import { useState, useEffect } from 'react';
import { fetchFonts, generateEmoji, ERROR_PLACEHOLDER_IMAGE, type FontCategory } from '@lib/api';

type TextAlign = 'left' | 'center' | 'right';

export const useEmojiGenerator = () => {
  const [text, setText] = useState('絵文字');
  const [font, setFont] = useState('');
  const [textColor, setTextColor] = useState('#ffffffff');
  const [backgroundColor, setBackgroundColor] = useState('#000000ff');
  const [useBackgroundColor, setUseBackgroundColor] = useState(false);
  const [textAlign, setTextAlign] = useState<TextAlign>('center');
  const [isSizeFixed, setIsSizeFixed] = useState(false);
  const [isStretchDisabled, setIsStretchDisabled] = useState(false);
  const [fontCategories, setFontCategories] = useState<FontCategory[]>([]);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const adContent = null; // This is a placeholder for future use.

  useEffect(() => {
    const loadFonts = async () => {
      try {
        const data = await fetchFonts();
        setFontCategories(data);
        if (data.length > 0 && data[0].fonts.length > 0) {
          setFont(data[0].fonts[0].value);
        }
      } catch (e) {
        setError(
          'フォントの読み込みに失敗しました。APIの形式が不正か、サーバーがダウンしています。'
        );
        console.error(e);
      }
    };
    loadFonts();
  }, []);

  useEffect(() => {
    if (!font) return;

    const handler = setTimeout(() => {
      if (!text) {
        setGeneratedImage(null);
        setIsLoading(false);
        return;
      }

      const generateImageFromApi = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const payload = {
            text: text,
            width: 128,
            height: 128,
            align: textAlign,
            color: textColor,
            background_color: useBackgroundColor ? backgroundColor : '#00000000',
            typeface_name: font,
            size_fixed: isSizeFixed,
            disable_stretch: isStretchDisabled,
          };

          const imageBlob = await generateEmoji(payload);
          setGeneratedImage(URL.createObjectURL(imageBlob));
        } catch (err) {
          setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
          setGeneratedImage(ERROR_PLACEHOLDER_IMAGE);
        } finally {
          setIsLoading(false);
        }
      };

      generateImageFromApi();
    }, 750);

    return () => {
      clearTimeout(handler);
    };
  }, [
    text,
    font,
    textColor,
    backgroundColor,
    useBackgroundColor,
    textAlign,
    isSizeFixed,
    isStretchDisabled,
  ]);

  // Cleanup for the generated blob URL
  useEffect(() => {
    const currentImage = generatedImage;
    return () => {
      if (currentImage && currentImage.startsWith('blob:')) {
        URL.revokeObjectURL(currentImage);
      }
    };
  }, [generatedImage]);

  return {
    text,
    setText,
    font,
    setFont,
    textColor,
    setTextColor,
    backgroundColor,
    setBackgroundColor,
    useBackgroundColor,
    setUseBackgroundColor,
    textAlign,
    setTextAlign,
    isSizeFixed,
    setIsSizeFixed,
    isStretchDisabled,
    setIsStretchDisabled,
    fontCategories,
    generatedImage,
    isLoading,
    error,
    adContent,
  };
};