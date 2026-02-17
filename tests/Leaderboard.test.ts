import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Leaderboard } from '../src/leaderboard/Leaderboard';

describe('Leaderboard', () => {
  let leaderboard: Leaderboard;
  
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
  };
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  beforeEach(() => {
    leaderboard = new Leaderboard();
    vi.clearAllMocks();
  });

  describe('getEntries', () => {
    it('should return empty array when no data', () => {
      localStorageMock.getItem.mockReturnValue(null);
      expect(leaderboard.getEntries()).toEqual([]);
    });

    it('should parse stored entries', () => {
      const entries = [
        { id: 1, name: 'Alice', score: 100, date: '2024-01-01' },
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(entries));
      expect(leaderboard.getEntries()).toEqual(entries);
    });

    it('should handle invalid JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid');
      expect(leaderboard.getEntries()).toEqual([]);
    });
  });

  describe('saveEntry', () => {
    it('should save new entry', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      leaderboard.saveEntry('Bob', 50);
      
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const saved = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(saved).toHaveLength(1);
      expect(saved[0].name).toBe('Bob');
      expect(saved[0].score).toBe(50);
    });

    it('should sort by score descending', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([
        { id: 1, name: 'Alice', score: 100, date: '2024-01-01' },
      ]));
      
      leaderboard.saveEntry('Bob', 150);
      
      const saved = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(saved[0].score).toBe(150);
      expect(saved[1].score).toBe(100);
    });

    it('should keep only top 10', () => {
      const existing = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        name: `Player${i}`,
        score: 100 - i,
        date: '2024-01-01',
      }));
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existing));
      
      leaderboard.saveEntry('NewPlayer', 1);
      
      const saved = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(saved).toHaveLength(10);
      expect(saved.some((e: { name: string }) => e.name === 'NewPlayer')).toBe(false);
    });
  });

  describe('isHighScore', () => {
    it('should return true for empty leaderboard', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      expect(leaderboard.isHighScore(1)).toBe(true);
    });

    it('should return true if score is higher than lowest', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([
        { id: 1, name: 'Alice', score: 100, date: '2024-01-01' },
      ]));
      expect(leaderboard.isHighScore(50)).toBe(true); // Less than 10 entries
    });
  });
});