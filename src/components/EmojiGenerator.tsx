import { type FC } from 'react';
import { useEmojiGenerator } from '@hooks/useEmojiGenerator';
import { SettingsPanel } from '@components/emoji-generator/SettingsPanel';
import { PreviewPanel } from '@components/emoji-generator/PreviewPanel';
import { EmojiGeneratorProvider } from '@contexts/EmojiGeneratorContext';

const EmojiGenerator: FC = () => {
  const emojiGeneratorState = useEmojiGenerator();

  return (
    <EmojiGeneratorProvider value={emojiGeneratorState}>
      <div className="card bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto p-8">
        <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 text-center">絵文字ジェネレーター</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <SettingsPanel className="md:col-span-2" />
          <PreviewPanel className="md:col-span-2 w-full" />
        </div>
      </div>
    </EmojiGeneratorProvider>
  );
};

export default EmojiGenerator;