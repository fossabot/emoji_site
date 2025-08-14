import { type FC } from 'react';
import { useEmojiGenerator } from '@hooks/useEmojiGenerator';
import { SettingsPanel } from '@components/emoji-generator/SettingsPanel';
import { PreviewPanel } from '@components/emoji-generator/PreviewPanel';
import { EmojiGeneratorProvider } from '@contexts/EmojiGeneratorContext';

const EmojiGenerator: FC = () => {
  const emojiGeneratorState = useEmojiGenerator();

  return (
    <EmojiGeneratorProvider value={emojiGeneratorState}>
      <div className="card mx-auto max-w-4xl rounded-lg bg-gray-800 p-6 p-8 shadow-lg">
        <h2 className="mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent">
          絵文字ジェネレーター
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <SettingsPanel className="md:col-span-2" />
          <PreviewPanel className="w-full md:col-span-2" />
        </div>
      </div>
    </EmojiGeneratorProvider>
  );
};

export default EmojiGenerator;
