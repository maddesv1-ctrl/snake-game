import type { LeaderboardEntry } from '../types';

const STORAGE_KEY = 'maddesSnakeLeaderboard';
const MAX_ENTRIES = 10;

export class Leaderboard {
  getEntries(): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? (JSON.parse(data) as LeaderboardEntry[]) : [];
    } catch {
      return [];
    }
  }

  saveEntry(name: string, score: number): void {
    const entries = this.getEntries();
    const newEntry: LeaderboardEntry = {
      id: Date.now(),
      name: name || 'Spieler',
      score,
      date: new Date().toLocaleDateString('de-DE'),
    };

    entries.push(newEntry);
    entries.sort((a, b) => b.score - a.score);
    
    const topEntries = entries.slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topEntries));
  }

  isHighScore(score: number): boolean {
    const entries = this.getEntries();
    if (entries.length < MAX_ENTRIES) return true;
    return score > entries[entries.length - 1].score;
  }

  formatLeaderboard(currentPlayerName: string): string {
    const entries = this.getEntries();

    if (entries.length === 0) {
      return `
        <div style="background: rgba(0,255,136,0.1); padding: 15px; border-radius: 15px; min-width: 250px; text-align: center;">
          <p style="color: #888;">Noch keine Einträge!</p>
          <p style="color: #00ff88;">Sei der Erste! 🏆</p>
        </div>
      `;
    }

    return `
      <div style="background: rgba(0,255,136,0.1); padding: 15px; border-radius: 15px; min-width: 250px;">
        <h3 style="color: #00ff88; margin-bottom: 10px; font-size: 1.2rem;">🏆 Top ${entries.length}</h3>
        ${entries
          .map(
            (entry, index) => {
              const isCurrentPlayer = entry.name === currentPlayerName;
              const style = isCurrentPlayer
                ? 'color: #00ff88; font-weight: bold; font-size: 1.1rem;'
                : 'color: #fff; font-size: 0.95rem;';
              return `
                <div style="padding: 4px 0; ${style}">
                  <span style="display: inline-block; width: 25px;">${index + 1}.</span>
                  <span style="display: inline-block; width: 100px;">${this.escapeHtml(entry.name)}</span>
                  <span style="color: #ff4444; font-weight: bold;">${entry.score}</span>
                  <span style="color: #666; font-size: 0.8rem; margin-left: 5px;">(${entry.date})</span>
                </div>
              `;
            }
          )
          .join('')}
      </div>
    `;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}