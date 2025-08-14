import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useEmojiGenerator } from './useEmojiGenerator';
import * as api from '@lib/api';

vi.mock('@lib/api', () => ({
  fetchFonts: vi.fn(),
  generateEmoji: vi.fn(),
  ERROR_PLACEHOLDER_IMAGE: 'error_placeholder_for_test',
}));

describe('useEmojiGenerator', () => {
  it('should fetch fonts on mount and update state correctly', async () => {
    const mockFonts = [
      { name: 'Category 1', fonts: [{ name: 'Font 1', value: 'font1' }] },
    ];
    vi.mocked(api.fetchFonts).mockResolvedValue(mockFonts);
    vi.mocked(api.generateEmoji).mockResolvedValue(new Blob());

    const { result } = renderHook(() => useEmojiGenerator());

    await waitFor(() => {
      expect(result.current.font).toBe('font1');
    });

    expect(result.current.fontCategories).toEqual(mockFonts);
  });

  it('should call generateEmoji when text changes after a debounce', async () => {
    const mockFonts = [
      { name: 'Category 1', fonts: [{ name: 'Font 1', value: 'font1' }] },
    ];
    vi.mocked(api.fetchFonts).mockResolvedValue(mockFonts);
    vi.mocked(api.generateEmoji).mockResolvedValue(new Blob());

    const { result } = renderHook(() => useEmojiGenerator());
    await waitFor(() => expect(result.current.font).toBe('font1'));

    vi.mocked(api.generateEmoji).mockClear();

    act(() => {
      result.current.setText('new text');
    });

    // Wait for the debounce timer (750ms) to pass
    await waitFor(
      () => {
        expect(api.generateEmoji).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 },
    ); // Wait for up to 1 second
  });

  it('should set error state if fetchFonts fails', async () => {
    vi.mocked(api.fetchFonts).mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(() => useEmojiGenerator());

    await waitFor(() => {
      expect(result.current.error).toContain('フォントの読み込みに失敗');
    });
  });

  it('should set error state if generateEmoji fails', async () => {
    const mockFonts = [
      { name: 'Category 1', fonts: [{ name: 'Font 1', value: 'font1' }] },
    ];
    vi.mocked(api.fetchFonts).mockResolvedValue(mockFonts);
    vi.mocked(api.generateEmoji).mockRejectedValue(
      new Error('Generation failed'),
    );

    const { result } = renderHook(() => useEmojiGenerator());
    await waitFor(() => expect(result.current.font).toBe('font1'));

    act(() => {
      result.current.setText('trigger generation');
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Generation failed');
      expect(result.current.generatedImage).toBe('error_placeholder_for_test');
    });
  });
});
