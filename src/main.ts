import { GameState } from './game/GameState';
import { GameLoop } from './game/GameLoop';
import { VideoHandler } from './game/VideoHandler';
import { Renderer } from './render/Renderer';
import { InputHandler } from './input/InputHandler';
import { Leaderboard } from './leaderboard/Leaderboard';
import { DEFAULT_CONFIG } from './types';

// DOM Elements
const nameScreen = document.getElementById('nameScreen') as HTMLDivElement;
const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const playerNameInput = document.getElementById('playerNameInput') as HTMLInputElement;
const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const scoreValue = document.getElementById('scoreValue') as HTMLSpanElement;
const gameOverScreen = document.getElementById('gameOver') as HTMLDivElement;
const finalScore = document.getElementById('finalScore') as HTMLSpanElement;
const leaderboardContainer = document.getElementById('gameOverLeaderboard') as HTMLDivElement;
const videoOverlay = document.getElementById('videoOverlay') as HTMLDivElement;
const videoElement = document.getElementById('gameVideo') as HTMLVideoElement;
const bgMusic = document.getElementById('bgMusic') as HTMLAudioElement;
const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;

// Game Instances
let gameState: GameState;
let renderer: Renderer;
let inputHandler: InputHandler;
let gameLoop: GameLoop;
let leaderboard: Leaderboard;
let videoHandler: VideoHandler;

function init(): void {
  gameState = new GameState(DEFAULT_CONFIG);
  renderer = new Renderer(gameCanvas, DEFAULT_CONFIG);
  leaderboard = new Leaderboard();
  videoHandler = new VideoHandler(videoOverlay, videoElement, onVideoEnd);
  inputHandler = new InputHandler(gameState, gameCanvas);
  gameLoop = new GameLoop(
    gameState,
    renderer,
    videoHandler,
    leaderboard,
    DEFAULT_CONFIG.baseSpeed
  );

  // Setup callbacks
  gameLoop.onGameOver(onGameOver);
  gameLoop.onVideoTrigger(onVideoStart);

  // Initialize
  inputHandler.initialize();
  videoHandler.initialize();
  setupEventListeners();
}

function setupEventListeners(): void {
  startBtn.addEventListener('click', startGame);
  resetBtn.addEventListener('click', resetGame);
  
  playerNameInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      startGame();
    }
  });
}

function startGame(): void {
  const playerName = playerNameInput.value.trim();
  
  if (!playerName) {
    playerNameInput.focus();
    return;
  }

  // Play music
  bgMusic.currentTime = 15;
  bgMusic.volume = 0.5;
  void bgMusic.play().catch(() => {
    // Autoplay blocked, ignore
  });

  // Hide name screen, show game
  nameScreen.style.display = 'none';
  gameState.start(playerName);
  videoHandler.reset();
  updateScoreDisplay();
  gameLoop.start();
}

function resetGame(): void {
  gameOverScreen.style.display = 'none';
  gameState.reset();
  updateScoreDisplay();
  
  // Restart music if paused
  if (bgMusic.paused) {
    bgMusic.currentTime = 15;
    bgMusic.volume = 0.5;
    void bgMusic.play().catch(() => {});
  }
  
  gameLoop.start();
}

function onGameOver(): void {
  bgMusic.pause();
  finalScore.textContent = gameState.score.toString();
  leaderboardContainer.innerHTML = leaderboard.formatLeaderboard(gameState.playerName);
  gameOverScreen.style.display = 'flex';
}

function onVideoStart(): void {
  // Video handler manages the pause
}

function onVideoEnd(): void {
  gameState.resumeAfterVideo();
  updateScoreDisplay();
  gameLoop.start();
}

function updateScoreDisplay(): void {
  scoreValue.textContent = gameState.score.toString();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);