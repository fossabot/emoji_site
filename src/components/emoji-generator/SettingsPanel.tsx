import { type FC } from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { ColorPicker } from './ColorPicker';
import type { FontCategory } from '@lib/api';

type TextAlign = 'left' | 'center' | 'right';

interface SettingsPanelProps {
  text: string;
  setText: (text: string) => void;
  font: string;
  setFont: (font: string) => void;
  fontCategories: FontCategory[];
  textAlign: TextAlign;
  setTextAlign: (align: TextAlign) => void;
  isSizeFixed: boolean;
  setIsSizeFixed: (fixed: boolean) => void;
  isStretchDisabled: boolean;
  setIsStretchDisabled: (disabled: boolean) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  useBackgroundColor: boolean;
  setUseBackgroundColor: (use: boolean) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

export const SettingsPanel: FC<SettingsPanelProps> = (props) => {
  const { 
    text, setText, font, setFont, fontCategories, textAlign, setTextAlign, 
    isSizeFixed, setIsSizeFixed, isStretchDisabled, setIsStretchDisabled,
    textColor, setTextColor, useBackgroundColor, setUseBackgroundColor, 
    backgroundColor, setBackgroundColor 
  } = props;

  return (
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

      <div>
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

      <div>
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

      <ColorPicker label="文字色" color={textColor} onColorChange={setTextColor} />

      <div>
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
          <ColorPicker label="背景色" color={backgroundColor} onColorChange={setBackgroundColor} />
        )}
      </div>

    </div>
  );
};
