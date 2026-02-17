import { VIDEOS } from '../types';

export class VideoHandler {
  private videoTimeout: ReturnType<typeof setTimeout> | null = null;
  private currentVideoIndex = 0;

  constructor(
    private videoOverlay: HTMLElement,
    private videoElement: HTMLVideoElement,
    private onVideoEnd: () => void
  ) {}

  initialize(): void {
    this.videoElement.addEventListener('ended', () => {
      this.hideVideo();
      this.onVideoEnd();
    });
  }

  showNextVideo(): boolean {
    if (this.currentVideoIndex >= VIDEOS.length) {
      return false;
    }

    const videoPath = VIDEOS[this.currentVideoIndex];
    this.videoElement.src = videoPath;
    this.videoElement.muted = true;
    this.videoOverlay.style.display = 'flex';
    
    void this.videoElement.play();

    // Mobile Safari fallback - 15s timeout
    if (this.videoTimeout) {
      clearTimeout(this.videoTimeout);
    }
    
    this.videoTimeout = setTimeout(() => {
      if (this.videoElement.paused && !this.videoElement.ended) {
        this.hideVideo();
        this.onVideoEnd();
      }
    }, 15000);

    this.currentVideoIndex++;
    return true;
  }

  reset(): void {
    this.currentVideoIndex = 0;
  }

  private hideVideo(): void {
    if (this.videoTimeout) {
      clearTimeout(this.videoTimeout);
      this.videoTimeout = null;
    }
    this.videoOverlay.style.display = 'none';
  }

  getVideosWatched(): number {
    return this.currentVideoIndex;
  }
}