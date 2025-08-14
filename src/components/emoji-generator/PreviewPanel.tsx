import { type FC } from 'react';
import { Loader, Download } from 'lucide-react';
import { useEmojiGeneratorContext } from '@contexts/EmojiGeneratorContext';

interface PreviewPanelProps {
  className?: string;
}

export const PreviewPanel: FC<PreviewPanelProps> = ({ className }) => {
  const { isLoading, generatedImage, error, text, adContent } =
    useEmojiGeneratorContext();

  return (
    <div
      className={`flex flex-col items-center justify-center ${className || ''}`}
    >
      <h2 className="mb-4 text-2xl font-bold">プレビュー</h2>

      {isLoading ? (
        <div className="flex w-full flex-grow items-center justify-center">
          <Loader className="animate-spin text-gray-400" size={48} />
        </div>
      ) : generatedImage ? (
        <div className="w-full">
          <div className="flex w-full justify-center gap-4">
            <div>
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg bg-gray-100 ring-2 ring-gray-600">
                <img
                  src={generatedImage}
                  alt="Generated Emoji on light background"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div>
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg bg-gray-900 ring-2 ring-gray-600">
                <img
                  src={generatedImage}
                  alt="Generated Emoji on dark background"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex h-48 w-48 items-center justify-center">
          <span className="text-gray-400">ここに表示</span>
        </div>
      )}

      {error && <p className="mt-4 text-center text-red-400">{error}</p>}

      {generatedImage && !isLoading && (
        <a
          href={generatedImage}
          download={text ? `${text}.png` : 'emoji.png'}
          className="mx-auto mt-6 flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-bold text-white transition-colors duration-300 hover:bg-green-700"
        >
          <Download size={20} /> ダウンロード
        </a>
      )}

      {/* Ad Placement Area */}
      <div className="mx-auto mt-8 w-full max-w-xs rounded-lg bg-gray-700 p-4 text-center text-sm text-gray-400">
        {adContent ? (
          <div dangerouslySetInnerHTML={{ __html: adContent }} />
        ) : (
          <p>広告スペース</p>
        )}
      </div>
    </div>
  );
};
