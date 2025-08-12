import { useState, useEffect, type FC } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Loader, Download, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { fetchFonts, generateEmoji, ERROR_PLACEHOLDER_IMAGE, type FontCategory } from '@lib/api';
import { PRESET_COLORS } from '@lib/constants';

type TextAlign = 'left' | 'center' | 'right';

const EmojiGenerator: FC = () => {
  const [text, setText] = useState('絵文字');
  const [font, setFont] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [useBackgroundColor, setUseBackgroundColor] = useState(false);
  const [textAlign, setTextAlign] = useState<TextAlign>('center');
  const [isSizeFixed, setIsSizeFixed] = useState(false);
  const [isStretchDisabled, setIsStretchDisabled] = useState(false);
  const [fontCategories, setFontCategories] = useState<FontCategory[]>([]);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adContent, setAdContent] = useState<string | null>(null); // New state for ad content

  // 1. Fetch fonts on component mount
  useEffect(() => {
    const loadFonts = async () => { // Renamed to avoid conflict with imported fetchFonts
      try {
        const data = await fetchFonts(); // Use the imported fetchFonts
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

  // 2. Generate emoji when settings change
  useEffect(() => {
    if (!font) return;

    const handler = setTimeout(() => {
      if (!text) {
        setGeneratedImage(null);
        setIsLoading(false);
        return;
      }

      const generateImageFromApi = async () => { // Renamed to avoid conflict with imported generateEmoji
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
            color: `${textColor}FF`,
            background_color: useBackgroundColor ? `${backgroundColor}FF` : '#00000000',
            typeface_name: font,
            size_fixed: isSizeFixed,
            disable_stretch: isStretchDisabled,
          };

          const imageBlob = await generateEmoji(payload); // Use the imported generateEmoji
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
      <div className="card bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-bold">設定</h2>
        <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-2">テキスト</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={3}
              maxLength={20}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="font" className="block text-sm font-medium text-gray-300 mb-2">フォント</label>
            <select
              id="font"
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={fontCategories.length === 0}
            >
              {fontCategories.length === 0 ? (
                <option>フォントを読込中...</option>
              ) : (
                fontCategories.map((category) => (
                  <optgroup key={category.name} label={category.name}>
                    {category.fonts.map((f) => (
                      <option key={f.name} value={f.value} style={{ fontFamily: f.value }}>{f.name}</option>
                    ))}
                  </optgroup>
                ))
              )}
            </select>
          </div>
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">文字揃え</label>
            <div className="flex w-full bg-gray-700 rounded-lg p-1">
              {(['left', 'center', 'right'] as TextAlign[]).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => setTextAlign(align)}
                  className={`flex-1 flex justify-center items-center p-2 rounded-md transition-colors ${textAlign === align ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-600'}`}
                >
                  {align === 'left' && <AlignLeft size={20} />}
                  {align === 'center' && <AlignCenter size={20} />}
                  {align === 'right' && <AlignRight size={20} />}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">詳細オプション</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isSizeFixed}
                  onChange={(e) => setIsSizeFixed(e.target.checked)}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">文字サイズを固定する</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isStretchDisabled}
                  onChange={(e) => setIsStretchDisabled(e.target.checked)}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">自動で伸縮しない</span>
              </label>
            </div>
          </div>
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">文字色</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTextColor(preset)}
                  className={`w-8 h-8 rounded-full border-2 transition ${textColor.toLowerCase() === preset.toLowerCase() ? 'border-blue-500 scale-110' : 'border-gray-600'}`}
                  style={{ backgroundColor: preset }}
                  aria-label={`Set text color to ${preset}`}
                />
              ))}
            </div>
            <div className="w-full h-auto">
              <HexColorPicker color={textColor} onChange={setTextColor} style={{ width: '100%', height: '150px' }} />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input 
                type="checkbox" 
                checked={useBackgroundColor}
                onChange={(e) => setUseBackgroundColor(e.target.checked)}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-300">背景色を追加する</span>
            </label>
            {useBackgroundColor && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBackgroundColor(preset)}
                      className={`w-8 h-8 rounded-full border-2 transition ${backgroundColor.toLowerCase() === preset.toLowerCase() ? 'border-blue-500 scale-110' : 'border-gray-600'}`}
                      style={{ backgroundColor: preset }}
                      aria-label={`Set background color to ${preset}`}
                    />
                  ))}
                </div>
                <div className="w-full h-auto">
                  <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} style={{ width: '100%', height: '150px' }} />
                </div>
              </div>
            )}
          </div>
      </div>
      <div className="card bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
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
          <div className="w-48 h-48 flex items-center justify-center">
            <span className="text-gray-400">ここに表示</span>
          </div>
        )}

        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        
        {generatedImage && !isLoading && (
          <a
            href={generatedImage}
            download={text ? `${text}.png` : 'emoji.png'}
            className="mt-6 w-full max-w-xs flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
          >
            <Download size={20} /> ダウンロード
          </a>
        )}

        {/* Ad Placement Area */}
        <div className="mt-8 w-full max-w-xs bg-gray-700 p-4 rounded-lg text-center text-gray-400 text-sm">
          {adContent ? (
            // Render actual ad content here
            <div dangerouslySetInnerHTML={{ __html: adContent }} />
          ) : (
            // Placeholder for ad
            <p>広告スペース</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmojiGenerator;
