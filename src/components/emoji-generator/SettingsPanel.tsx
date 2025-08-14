import { type FC } from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { ColorPicker } from '@components/emoji-generator/ColorPicker';
import { useEmojiGeneratorContext } from '@contexts/EmojiGeneratorContext';
import { PRESET_COLORS } from '@lib/constants';

interface SettingsPanelProps {
  className?: string;
}

export const SettingsPanel: FC<SettingsPanelProps> = ({ className }) => {
  const {
    text,
    setText,
    font,
    setFont,
    fontCategories,
    textAlign,
    setTextAlign,
    isSizeFixed,
    setIsSizeFixed,
    isStretchDisabled,
    setIsStretchDisabled,
    textColor,
    setTextColor,
    useBackgroundColor,
    setUseBackgroundColor,
    backgroundColor,
    setBackgroundColor,
  } = useEmojiGeneratorContext();

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <h2 className="text-2xl font-bold">設定</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="text"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            テキスト
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded border border-gray-600 bg-gray-700 p-2 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            rows={3}
            maxLength={20}
          />
        </div>

        <div>
          <label
            htmlFor="font"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            フォント
          </label>
          <select
            id="font"
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full rounded border border-gray-600 bg-gray-700 p-2 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            disabled={fontCategories.length === 0}
          >
            {fontCategories.length === 0 ? (
              <option>フォントを読込中...</option>
            ) : (
              fontCategories.map((category) => (
                <optgroup key={category.name} label={category.name}>
                  {category.fonts.map((f) => (
                    <option
                      key={f.name}
                      value={f.value}
                      style={{ fontFamily: f.value }}
                    >
                      {f.name}
                    </option>
                  ))}
                </optgroup>
              ))
            )}
          </select>
        </div>
      </div>

      <div>
        <p className="mb-2 block text-sm font-medium text-gray-300">文字揃え</p>
        <div className="flex w-full rounded-lg bg-gray-700 p-1">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => setTextAlign(align)}
              className={`flex flex-1 items-center justify-center rounded-md p-2 transition-colors ${textAlign === align ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-600'}`}
            >
              {align === 'left' && <AlignLeft size={20} />}
              {align === 'center' && <AlignCenter size={20} />}
              {align === 'right' && <AlignRight size={20} />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 block text-sm font-medium text-gray-300">
          詳細オプション
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              id="isSizeFixed"
              type="checkbox"
              checked={isSizeFixed}
              onChange={(e) => setIsSizeFixed(e.target.checked)}
              className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isSizeFixed"
              className="cursor-pointer text-gray-300"
            >
              文字サイズを固定する
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="isStretchDisabled"
              type="checkbox"
              checked={isStretchDisabled}
              onChange={(e) => setIsStretchDisabled(e.target.checked)}
              className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isStretchDisabled"
              className="cursor-pointer text-gray-300"
            >
              自動で伸縮しない
            </label>
          </div>
        </div>
      </div>

      <ColorPicker
        label="文字色"
        color={textColor}
        onColorChange={setTextColor}
        presetColors={PRESET_COLORS}
      />

      <div>
        <div className="mb-4 flex items-center gap-3">
          <input
            id="useBackgroundColor"
            type="checkbox"
            checked={useBackgroundColor}
            onChange={(e) => setUseBackgroundColor(e.target.checked)}
            className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="useBackgroundColor"
            className="cursor-pointer text-gray-300"
          >
            背景色を追加する
          </label>
        </div>
        {useBackgroundColor && (
          <ColorPicker
            label="背景色"
            color={backgroundColor}
            onColorChange={setBackgroundColor}
            presetColors={PRESET_COLORS}
          />
        )}
      </div>
    </div>
  );
};
