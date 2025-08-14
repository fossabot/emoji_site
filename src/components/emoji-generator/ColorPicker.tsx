import { type FC, useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';

// --- Helper Functions ---

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

const hexToRgba = (hex: string): Rgba => {
  hex = hex.startsWith('#') ? hex.slice(1) : hex;
  const isShort = hex.length === 3 || hex.length === 4;

  const r = parseInt(isShort ? hex[0] + hex[0] : hex.substring(0, 2), 16);
  const g = parseInt(isShort ? hex[1] + hex[1] : hex.substring(2, 4), 16);
  const b = parseInt(isShort ? hex[2] + hex[2] : hex.substring(4, 6), 16);
  let a = 255;
  if (hex.length === 4 || hex.length === 8) {
    a = parseInt(isShort ? hex[3] + hex[3] : hex.substring(6, 8), 16);
  }
  
  return { r, g, b, a: a / 255 };
};

const rgbaToHex = (rgba: Rgba): string => {
  const toHex = (c: number) => `0${Math.round(c).toString(16)}`.slice(-2);
  const r = toHex(rgba.r);
  const g = toHex(rgba.g);
  const b = toHex(rgba.b);
  const a = toHex(rgba.a * 255);
  return `#${r}${g}${b}${a}`;
};

// --- Sub-components ---

const RgbaInputFields: FC<{ color: string; onChange: (color: string) => void }> = ({ color, onChange }) => {
  const rgba = useMemo(() => hexToRgba(color), [color]);

  const handleRgbaChange = (part: keyof Rgba, value: number) => {
    if (isNaN(value)) return;
    const newRgba = { ...rgba, [part]: value };
    if (part !== 'a') {
        newRgba[part] = Math.max(0, Math.min(255, value));
    } else {
        newRgba.a = Math.max(0, Math.min(1, value));
    }
    onChange(rgbaToHex(newRgba));
  };

  return (
    <div className="grid grid-cols-4 gap-3 mt-4">
      {(['r', 'g', 'b', 'a'] as const).map((part) => (
        <div key={part}>
          <label htmlFor={`${part}-input`} className="block text-xs font-medium text-gray-400 uppercase">{part}</label>
          <input
            id={`${part}-input`}
            type="number"
            value={part === 'a' ? rgba.a.toFixed(2) : rgba[part]}
            onChange={(e) => handleRgbaChange(part, parseFloat(e.target.value))}
            min={0}
            max={part === 'a' ? 1 : 255}
            step={part === 'a' ? 0.01 : 1}
            className="w-full p-2 mt-1 rounded bg-gray-900 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      ))}
    </div>
  );
};

// --- Main ColorPicker Component ---

interface ColorPickerProps {
  label: string;
  color: string;
  onColorChange: (color: string) => void;
  presetColors?: string[];
}

export const ColorPicker: FC<ColorPickerProps> = ({ label, color, onColorChange, presetColors = [] }) => {

  const handlePresetClick = (preset: string) => {
    const currentAlpha = hexToRgba(color).a;
    const { r, g, b } = hexToRgba(preset);
    onColorChange(rgbaToHex({ r, g, b, a: currentAlpha }));
  };

  const handlePickerChange = (newColor: string) => {
    const { r, g, b } = hexToRgba(newColor);
    const currentA = hexToRgba(color).a;
    onColorChange(rgbaToHex({ r, g, b, a: currentA }));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      {presetColors.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {presetColors.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className={`w-8 h-8 rounded-full border-2 transition ${color.toLowerCase().startsWith(preset.toLowerCase()) ? 'border-blue-500 scale-110' : 'border-gray-600'}`}
              style={{ backgroundColor: preset }}
              aria-label={`Set color to ${preset}`}
            />
          ))}
        </div>
      )}
      <div className="w-full h-auto">
        <HexColorPicker
          color={color}
          onChange={handlePickerChange}
          style={{ width: '100%', height: '150px' }}
        />
        <RgbaInputFields color={color} onChange={onColorChange} />
      </div>
    </div>
  );
};