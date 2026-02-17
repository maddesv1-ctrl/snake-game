import { type Position, type Direction, type GameStatus, DEFAULT_CONFIG, DIRECTIONS } from '../types';

export class GameState {
  snake: Position[] = [];
  food: Position = { x: 0, y: 0 };
  direction: Direction = DIRECTIONS.RIGHT;
  nextDirection: Direction = DIRECTIONS.RIGHT;
  score = 0;
  status: GameStatus = 'idle';
  videosWatched = 0;
  playerName = '';

  constructor(private config = DEFAULT_CONFIG) {}

  start(playerName: string): void {
    this.playerName = playerName || 'Spieler';
    this.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    this.direction = DIRECTIONS.RIGHT;
    this.nextDirection = DIRECTIONS.RIGHT;
    this.score = 0;
    this.status = 'playing';
    this.videosWatched = 0;
    this.spawnFood();
  }

  reset(): void {
    this.start(this.playerName);
  }

  spawnFood(): void {
    let position: Position;
    do {
      position = {
        x: Math.floor(Math.random() * this.config.gridSize),
        y: Math.floor(Math.random() * this.config.gridSize),
      };
    } while (this.isSnakeAt(position));
    this.food = position;
  }

  isSnakeAt(position: Position): boolean {
    return this.snake.some((s) => s.x === position.x && s.y === position.y);
  }

  update(): boolean {
    if (this.status !== 'playing') return false;

    this.direction = { ...this.nextDirection };
    const head: Position = {
      x: this.snake[0].x + this.direction.x,
      y: this.snake[0].y + this.direction.y,
    };

    // Collision detection
    if (
      head.x < 0 ||
      head.x >= this.config.gridSize ||
      head.y < 0 ||
      head.y >= this.config.gridSize ||
      this.isSnakeAt(head)
    ) {
      this.status = 'over';
      return false;
    }

    this.snake.unshift(head);

    // Check food
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      return this.checkVideoTrigger();
    } else {
      this.snake.pop();
      return false;
    }
  }

  checkVideoTrigger(): boolean {
    if (this.score % this.config.videoInterval === 0 && this.videosWatched < 4) {
      this.status = 'paused';
      this.videosWatched++;
      return true;
    }
    this.spawnFood();
    return false;
  }

  resumeAfterVideo(): void {
    this.status = 'playing';
    this.spawnFood();
  }

  setDirection(direction: Direction): void {
    // Prevent 180-degree turns
    if (
      (direction.x !== 0 && this.direction.x === -direction.x) ||
      (direction.y !== 0 && this.direction.y === -direction.y)
    ) {
      return;
    }
    this.nextDirection = direction;
  }

  pause(): void {
    if (this.status === 'playing') {
      this.status = 'paused';
    }
  }

  resume(): void {
    if (this.status === 'paused') {
      this.status = 'playing';
    }
  }
}