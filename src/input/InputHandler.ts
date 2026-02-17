import { DIRECTIONS } from '../types';
import type { GameState } from '../game/GameState';

export class InputHandler {
  private touchStartX = 0;
  private touchStartY = 0;

  constructor(
    private gameState: GameState,
    private canvas: HTMLCanvasElement
  ) {}

  initialize(): void {
    this.setupKeyboardControls();
    this.setupTouchControls();
    this.setupPreventScroll();
  }

  private setupKeyboardControls(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (this.gameState.status === 'over') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          this.gameState.setDirection(DIRECTIONS.UP);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          this.gameState.setDirection(DIRECTIONS.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.gameState.setDirection(DIRECTIONS.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.gameState.setDirection(DIRECTIONS.RIGHT);
          break;
      }
    });
  }

  private setupTouchControls(): void {
    this.canvas.addEventListener('touchstart', (e: TouchEvent) => {
      e.preventDefault();
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e: TouchEvent) => {
      e.preventDefault();
      if (this.gameState.status === 'over') return;

      const deltaX = e.changedTouches[0].clientX - this.touchStartX;
      const deltaY = e.changedTouches[0].clientY - this.touchStartY;
      const minSwipeDistance = 30;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        // Horizontal swipe
        this.gameState.setDirection(deltaX > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT);
      } else if (Math.abs(deltaY) > minSwipeDistance) {
        // Vertical swipe
        this.gameState.setDirection(deltaY > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP);
      }
    }, { passive: false });
  }

  private setupPreventScroll(): void {
    document.body.addEventListener('touchmove', (e: TouchEvent) => {
      if ((e.target as HTMLElement).id !== 'playerNameInput') {
        e.preventDefault();
      }
    }, { passive: false });
  }

  destroy(): void {
    // Cleanup if needed
  }
}
