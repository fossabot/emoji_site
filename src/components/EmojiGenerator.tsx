import { useState, useEffect, type FC } from 'react';
import { fetchFonts, generateEmoji, ERROR_PLACEHOLDER_IMAGE, type FontCategory } from '@lib/api';
import { SettingsPanel } from './emoji-generator/SettingsPanel';
import { PreviewPanel } from './emoji-generator/PreviewPanel';

type TextAlign = 'left' | 'center' | 'right';

const EmojiGenerator: FC = () => {
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
  const [adContent, setAdContent] = useState<string | null>(null);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        const data = await fetchFonts();
        setFontCategories(data);
        if (data.length > 0 && data[0].fonts.length > 0) {
          setFont(data[0].fonts[0].value);
        }
      } catch (e) {
        setError('フォントの読み込みに失敗しました。APIの形式が不正か、サーバーがダウンしています。');
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
        
        if (generatedImage && generatedImage.startsWith('blob:')) {
          URL.revokeObjectURL(generatedImage);
        }

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
  }, [text, font, textColor, backgroundColor, useBackgroundColor, textAlign, isSizeFixed, isStretchDisabled]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto p-8">
      <SettingsPanel
        text={text}
        setText={setText}
        font={font}
        setFont={setFont}
        fontCategories={fontCategories}
        textAlign={textAlign}
        setTextAlign={setTextAlign}
        isSizeFixed={isSizeFixed}
        setIsSizeFixed={setIsSizeFixed}
        isStretchDisabled={isStretchDisabled}
        setIsStretchDisabled={setIsStretchDisabled}
        textColor={textColor}
        setTextColor={setTextColor}
        useBackgroundColor={useBackgroundColor}
        setUseBackgroundColor={setUseBackgroundColor}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
      />
      <PreviewPanel
        isLoading={isLoading}
        generatedImage={generatedImage}
        error={error}
        text={text}
        adContent={adContent}
      />
    </div>
  );
};

export default EmojiGenerator;
