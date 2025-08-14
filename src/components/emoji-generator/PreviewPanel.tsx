import { type FC } from 'react';
import { Loader, Download } from 'lucide-react';

interface PreviewPanelProps {
  isLoading: boolean;
  generatedImage: string | null;
  error: string | null;
  text: string;
  adContent: string | null;
  className?: string; // Add this line
}

export const PreviewPanel: FC<PreviewPanelProps> = ({ isLoading, generatedImage, error, text, adContent, className }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className || ''}`}> {/* Apply className */} 
      <h2 className="text-2xl font-bold mb-4">プレビュー</h2>
      
      {isLoading ? (
        <div className="w-full flex-grow flex items-center justify-center">
          <Loader className="animate-spin text-gray-400" size={48} />
        </div>
      ) : generatedImage ? (
        <div className="w-full">
          <div className="flex gap-4 w-full justify-center">
            <div>
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden ring-2 ring-gray-600">
                <img src={generatedImage} alt="Generated Emoji on light background" className="w-full h-full object-contain" />
              </div>
            </div>
            <div>
              <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden ring-2 ring-gray-600">
                <img src={generatedImage} alt="Generated Emoji on dark background" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-48 h-48 flex items-center justify-center mx-auto">
          <span className="text-gray-400">ここに表示</span>
        </div>
      )}

      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      
      {generatedImage && !isLoading && (
        <a
          href={generatedImage}
          download={text ? `${text}.png` : 'emoji.png'}
          className="mt-6 w-full max-w-xs flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 mx-auto"
        >
          <Download size={20} /> ダウンロード
        </a>
      )}

      {/* Ad Placement Area */}
      <div className="mt-8 w-full max-w-xs bg-gray-700 p-4 rounded-lg text-center text-gray-400 text-sm mx-auto">
        {adContent ? (
          <div dangerouslySetInnerHTML={{ __html: adContent }} />
        ) : (
          <p>広告スペース</p>
        )}
      </div>
    </div>
  );
};

