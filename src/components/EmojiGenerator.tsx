import { type FC } from 'react';
import { useEmojiGenerator } from '../hooks/useEmojiGenerator';
import { SettingsPanel } from './emoji-generator/SettingsPanel';
import { PreviewPanel } from './emoji-generator/PreviewPanel';

const EmojiGenerator: FC = () => {
  const {
    text, setText,
    font, setFont,
    textColor, setTextColor,
    backgroundColor, setBackgroundColor,
    useBackgroundColor, setUseBackgroundColor,
    textAlign, setTextAlign,
    isSizeFixed, setIsSizeFixed,
    isStretchDisabled, setIsStretchDisabled,
    fontCategories,
    generatedImage,
    isLoading,
    error,
    adContent
  } = useEmojiGenerator();

  return (
    <div className="card bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto p-8">
      <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 text-center">絵文字ジェネレーター</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
          className="md:col-span-2"
        />
        <PreviewPanel
          isLoading={isLoading}
          generatedImage={generatedImage}
          error={error}
          text={text}
          adContent={adContent}
          className="md:col-span-2 w-full"
        />
      </div>
    </div>
  );
};

export default EmojiGenerator;