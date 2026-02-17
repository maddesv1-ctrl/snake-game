import type { GameState } from './GameState';
import type { Renderer } from '../render/Renderer';
import type { VideoHandler } from './VideoHandler';
import type { Leaderboard } from '../leaderboard/Leaderboard';

export class GameLoop {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private onGameOverCallback: (() => void) | null = null;
  private onVideoCallback: (() => void) | null = null;

  constructor(
    private gameState: GameState,
    private renderer: Renderer,
    private videoHandler: VideoHandler,
    private leaderboard: Leaderboard,
    private tickRate: number
  ) {}

  onGameOver(callback: () => void): void {
    this.onGameOverCallback = callback;
  }

  onVideoTrigger(callback: () => void): void {
    this.onVideoCallback = callback;
  }

  start(): void {
    this.stop();
    this.renderer.render(this.gameState);
    
    this.intervalId = setInterval(() => {
      this.tick();
    }, this.tickRate);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick(): void {
    if (this.gameState.status !== 'playing') return;

    const videoTriggered = this.gameState.update();
    this.renderer.render(this.gameState);

    if (videoTriggered) {
      this.stop();
      this.videoHandler.showNextVideo();
      if (this.onVideoCallback) {
        this.onVideoCallback();
      }
      return;
    }

    // Status can change from 'playing' to 'over' in update()
    // @ts-expect-error: TS doesn't detect status change in update()
    if (this.gameState.status === 'over') {
      this.stop();
      this.handleGameOver();
    }
  }

  private handleGameOver(): void {
    this.leaderboard.saveEntry(this.gameState.playerName, this.gameState.score);
    if (this.onGameOverCallback) {
      this.onGameOverCallback();
    }
  }

  resume(): void {
    if (this.gameState.status === 'paused') {
      this.gameState.resume();
      this.start();
    }
  }

  pause(): void {
    this.stop();
    this.gameState.pause();
  }
}
