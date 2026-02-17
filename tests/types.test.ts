import { describe, it, expect } from 'vitest';
import { DIRECTIONS, DEFAULT_CONFIG } from '../src/types';

describe('Types', () => {
  describe('DIRECTIONS', () => {
    it('should have correct values', () => {
      expect(DIRECTIONS.UP).toEqual({ x: 0, y: -1 });
      expect(DIRECTIONS.DOWN).toEqual({ x: 0, y: 1 });
      expect(DIRECTIONS.LEFT).toEqual({ x: -1, y: 0 });
      expect(DIRECTIONS.RIGHT).toEqual({ x: 1, y: 0 });
    });
  });

  describe('DEFAULT_CONFIG', () => {
    it('should have correct grid size', () => {
      expect(DEFAULT_CONFIG.gridSize).toBe(20);
      expect(DEFAULT_CONFIG.canvasSize).toBe(400);
      expect(DEFAULT_CONFIG.tileSize).toBe(20);
    });

    it('should define video interval', () => {
      expect(DEFAULT_CONFIG.videoInterval).toBe(3);
    });
  });
});