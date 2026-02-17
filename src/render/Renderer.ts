import type { GameState } from '../game/GameState';
import type { GameConfig } from '../types';

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(
    canvas: HTMLCanvasElement,
    private config: GameConfig
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = ctx;
  }

  render(gameState: GameState): void {
    this.clear();
    this.drawBackground();
    this.drawFood(gameState.food);
    this.drawSnake(gameState.snake, gameState.direction);
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.config.canvasSize, this.config.canvasSize);
  }

  private drawBackground(): void {
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.config.canvasSize, this.config.canvasSize);
  }

  private drawFood(food: { x: number; y: number }): void {
    this.ctx.fillStyle = '#ff4444';
    const padding = 2;
    const size = this.config.tileSize - padding * 2;
    this.ctx.fillRect(
      food.x * this.config.tileSize + padding,
      food.y * this.config.tileSize + padding,
      size,
      size
    );
  }

  private drawSnake(
    snake: { x: number; y: number }[],
    direction: { x: number; y: number }
  ): void {
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      this.drawSnakeSegment(segment, index, isHead, direction);
    });
  }

  private drawSnakeSegment(
    segment: { x: number; y: number },
    index: number,
    isHead: boolean,
    direction: { x: number; y: number }
  ): void {
    const x = segment.x * this.config.tileSize;
    const y = segment.y * this.config.tileSize;

    if (isHead) {
      this.ctx.fillStyle = '#00ff88';
      this.drawHead(x, y, direction);
    } else {
      const greenValue = Math.max(100, 255 - index * 8);
      this.ctx.fillStyle = `rgb(0, ${greenValue}, 100)`;
      this.drawBodySegment(x, y);
    }
  }

  private drawHead(
    x: number,
    y: number,
    direction: { x: number; y: number }
  ): void {
    const padding = 1;
    const size = this.config.tileSize - padding * 2;
    this.ctx.fillRect(x + padding, y + padding, size, size);

    // Draw eyes
    this.ctx.fillStyle = '#1a1a2e';
    const eyeSize = 3;
    const [eye1, eye2] = this.getEyePositions(x, y, direction);
    this.ctx.fillRect(eye1.x, eye1.y, eyeSize, eyeSize);
    this.ctx.fillRect(eye2.x, eye2.y, eyeSize, eyeSize);
  }

  private drawBodySegment(x: number, y: number): void {
    const padding = 1;
    const size = this.config.tileSize - padding * 2;
    this.ctx.fillRect(x + padding, y + padding, size, size);
  }

  private getEyePositions(
    x: number,
    y: number,
    direction: { x: number; y: number }
  ): Array<{ x: number; y: number }> {
    const center = this.config.tileSize / 2;
    const offset = 5;

    if (direction.x === 1) {
      return [
        { x: x + 12, y: y + offset },
        { x: x + 12, y: y + center + 2 },
      ];
    } else if (direction.x === -1) {
      return [
        { x: x + offset, y: y + offset },
        { x: x + offset, y: y + center + 2 },
      ];
    } else if (direction.y === -1) {
      return [
        { x: x + offset, y: y + offset },
        { x: x + center + 2, y: y + offset },
      ];
    } else {
      return [
        { x: x + offset, y: y + center + 2 },
        { x: x + center + 2, y: y + center + 2 },
      ];
    }
  }
}