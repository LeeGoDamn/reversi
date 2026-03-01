import { Player, Position, GameStatus } from './types';
import { Board } from './Board';
import { GameLogic } from './GameLogic';
import { AI } from './AI';

export class Game {
  private grid: Player[][];
  private currentPlayer: Player;
  private gameOver: boolean;
  private lastMove: Position | null;
  private gameStarted: boolean;
  private playerColor: Player;
  private hoverPos: Position | null;

  private board: Board;
  private canvas: HTMLCanvasElement;
  private statusEl: HTMLElement;
  private scoreEl: HTMLElement;
  private undoBtn: HTMLButtonElement;
  private resetBtn: HTMLButtonElement;
  private menuBtn: HTMLButtonElement;
  private menuModal: HTMLElement;
  private closeMenuBtn: HTMLButtonElement;
  private switchColorBtn: HTMLButtonElement;
  private confirmModal: HTMLElement;
  private cancelNewGameBtn: HTMLButtonElement;
  private confirmNewGameBtn: HTMLButtonElement;

  private ai: AI;
  private moveHistory: Player[][][];

  constructor() {
    this.grid = GameLogic.createInitialBoard();
    this.currentPlayer = Player.Black;
    this.gameOver = false;
    this.lastMove = null;
    this.gameStarted = true;
    this.playerColor = Player.Black;
    this.moveHistory = [];
    this.hoverPos = null;

    this.board = new Board('gameCanvas');
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.statusEl = document.getElementById('status')!;
    this.scoreEl = document.getElementById('score')!;
    this.undoBtn = document.getElementById('undoBtn') as HTMLButtonElement;
    this.resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
    this.menuBtn = document.getElementById('menuBtn') as HTMLButtonElement;
    this.menuModal = document.getElementById('menuModal')!;
    this.closeMenuBtn = document.getElementById('closeMenuBtn') as HTMLButtonElement;
    this.switchColorBtn = document.getElementById('switchColorBtn') as HTMLButtonElement;
    this.confirmModal = document.getElementById('confirmModal')!;
    this.cancelNewGameBtn = document.getElementById('cancelNewGameBtn') as HTMLButtonElement;
    this.confirmNewGameBtn = document.getElementById('confirmNewGameBtn') as HTMLButtonElement;

    const aiColor = this.playerColor === Player.Black ? Player.White : Player.Black;
    this.ai = new AI(this.grid, aiColor);

    this.moveHistory.push(this.grid.map(row => [...row]));

    this.bindEvents();
    this.updateCursor();
    this.updateStatus();
    this.render();
  }

  private bindEvents(): void {
    this.menuBtn.addEventListener('click', () => this.showMenu());
    this.closeMenuBtn.addEventListener('click', () => this.hideMenu());
    this.menuModal.addEventListener('click', (e) => {
      if (e.target === this.menuModal) this.hideMenu();
    });

    this.switchColorBtn.addEventListener('click', () => {
      this.hideMenu();
      this.switchColor();
    });

    this.resetBtn.addEventListener('click', () => this.showConfirmModal());

    this.cancelNewGameBtn.addEventListener('click', () => this.hideConfirmModal());
    this.confirmModal.addEventListener('click', (e) => {
      if (e.target === this.confirmModal) this.hideConfirmModal();
    });
    this.confirmNewGameBtn.addEventListener('click', () => {
      this.hideConfirmModal();
      this.reset();
    });

    this.undoBtn.addEventListener('click', () => this.undo());

    // 鼠标移动 - 悬停预览
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.gameStarted || this.gameOver || this.currentPlayer !== this.playerColor) return;

      const pos = this.board.getPositionFromEvent(e);
      if (pos && GameLogic.isValidMove(this.grid, pos.x, pos.y, this.playerColor)) {
        if (!this.hoverPos || this.hoverPos.x !== pos.x || this.hoverPos.y !== pos.y) {
          this.hoverPos = pos;
          this.render();
        }
      } else if (this.hoverPos) {
        this.hoverPos = null;
        this.render();
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      if (this.hoverPos) {
        this.hoverPos = null;
        this.render();
      }
    });

    this.canvas.addEventListener('click', (e) => {
      if (!this.gameStarted || this.gameOver || this.currentPlayer !== this.playerColor) return;

      const pos = this.board.getPositionFromEvent(e);
      if (pos && GameLogic.isValidMove(this.grid, pos.x, pos.y, this.playerColor)) {
        this.makeMove(pos.x, pos.y, this.playerColor);
      }
    });
  }

  private showMenu(): void {
    this.menuModal.classList.remove('hidden');
    if (this.gameStarted && !this.gameOver && this.moveHistory.length > 1) {
      this.switchColorBtn.disabled = true;
      this.switchColorBtn.classList.add('opacity-40', 'cursor-not-allowed');
      this.switchColorBtn.textContent = '🔄 游戏中无法切换';
    } else {
      this.switchColorBtn.disabled = false;
      this.switchColorBtn.classList.remove('opacity-40', 'cursor-not-allowed');
      this.switchColorBtn.textContent = '🔄 切换执子';
    }
  }

  private hideMenu(): void {
    this.menuModal.classList.add('hidden');
  }

  private showConfirmModal(): void {
    this.confirmModal.classList.remove('hidden');
  }

  private hideConfirmModal(): void {
    this.confirmModal.classList.add('hidden');
  }

  private switchColor(): void {
    if (this.gameStarted && !this.gameOver && this.moveHistory.length > 1) return;

    this.playerColor = this.playerColor === Player.Black ? Player.White : Player.Black;
    const aiColor = this.playerColor === Player.Black ? Player.White : Player.Black;
    this.ai = new AI(this.grid, aiColor);

    this.updateCursor();
    this.updateStatus();
    this.render();

    if (this.currentPlayer !== this.playerColor) {
      setTimeout(() => this.aiMove(), 300);
    }
  }

  private updateCursor(): void {
    this.canvas.classList.remove('cursor-black', 'cursor-white');
    this.canvas.classList.add(this.playerColor === Player.Black ? 'cursor-black' : 'cursor-white');
  }

  reset(): void {
    this.grid = GameLogic.createInitialBoard();
    this.currentPlayer = Player.Black;
    this.gameOver = false;
    this.lastMove = null;
    this.gameStarted = true;
    this.moveHistory = [this.grid.map(row => [...row])];
    this.hoverPos = null;

    const aiColor = this.playerColor === Player.Black ? Player.White : Player.Black;
    this.ai = new AI(this.grid, aiColor);

    this.updateCursor();
    this.updateStatus();
    this.render();

    if (this.playerColor === Player.White) {
      setTimeout(() => this.aiMove(), 500);
    }
  }

  private makeMove(x: number, y: number, player: Player): void {
    this.moveHistory.push(this.grid.map(row => [...row]));
    this.grid = GameLogic.makeMove(this.grid, x, y, player);
    this.lastMove = { x, y };
    this.hoverPos = null;

    this.render();

    if (GameLogic.isGameOver(this.grid)) {
      this.endGame();
      return;
    }

    const nextPlayer = player === Player.Black ? Player.White : Player.Black;

    if (GameLogic.hasValidMove(this.grid, nextPlayer)) {
      this.currentPlayer = nextPlayer;
    } else {
      this.statusEl.textContent = nextPlayer === Player.Black
        ? '⚫ 黑棋无子可下，跳过'
        : '⚪ 白棋无子可下，跳过';
      setTimeout(() => {
        this.currentPlayer = player;
        this.updateStatus();
        this.render();

        if (this.currentPlayer !== this.playerColor) {
          setTimeout(() => this.aiMove(), 300);
        }
      }, 1000);
      return;
    }

    this.updateStatus();
    this.render();

    if (this.currentPlayer !== this.playerColor) {
      setTimeout(() => this.aiMove(), 300);
    }
  }

  private aiMove(): void {
    if (this.gameOver) return;

    this.ai.updateBoard(this.grid);
    const move = this.ai.getBestMove();

    if (move) {
      this.makeMove(move.x, move.y, this.currentPlayer);
    } else {
      const nextPlayer = this.currentPlayer === Player.Black ? Player.White : Player.Black;
      if (GameLogic.hasValidMove(this.grid, nextPlayer)) {
        this.currentPlayer = nextPlayer;
        this.updateStatus();
        this.render();
      }
    }
  }

  private undo(): void {
    if (this.moveHistory.length < 3 || this.gameOver) return;

    this.moveHistory.pop();
    this.moveHistory.pop();
    this.grid = this.moveHistory[this.moveHistory.length - 1].map(row => [...row]);
    this.lastMove = null;
    this.currentPlayer = this.playerColor;
    this.gameOver = false;
    this.hoverPos = null;

    this.ai.updateBoard(this.grid);
    this.updateStatus();
    this.render();
  }

  private endGame(): void {
    this.gameOver = true;
    const { black, white } = GameLogic.countPieces(this.grid);

    let result: GameStatus;
    if (black > white) result = GameStatus.BlackWin;
    else if (white > black) result = GameStatus.WhiteWin;
    else result = GameStatus.Draw;

    const playerWins = (result === GameStatus.BlackWin && this.playerColor === Player.Black) ||
      (result === GameStatus.WhiteWin && this.playerColor === Player.White);

    if (result === GameStatus.Draw) {
      this.statusEl.textContent = `🤝 平局！${black} : ${white}`;
      this.statusEl.className = 'text-center text-xl font-bold min-h-12 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 px-8 py-3 rounded-2xl shadow-lg border-2 border-gray-400';
    } else if (playerWins) {
      this.statusEl.textContent = `🎉 你赢了！${black} : ${white}`;
      this.statusEl.className = 'text-center text-xl font-bold min-h-12 bg-gradient-to-r from-emerald-400 to-green-500 text-white px-8 py-3 rounded-2xl shadow-lg border-2 border-emerald-500 animate-pulse';
    } else {
      this.statusEl.textContent = `💀 AI 赢了！${black} : ${white}`;
      this.statusEl.className = 'text-center text-xl font-bold min-h-12 bg-gradient-to-r from-red-400 to-rose-500 text-white px-8 py-3 rounded-2xl shadow-lg border-2 border-red-500';
    }
  }

  private updateStatus(): void {
    const { black, white } = GameLogic.countPieces(this.grid);
    this.scoreEl.textContent = `⚫ ${black} : ${white} ⚪`;

    this.statusEl.className = 'text-center text-white text-base font-medium min-h-10 bg-emerald-600/90 px-6 py-2 rounded-full shadow-lg';

    const validMoves = GameLogic.getValidMoves(this.grid, this.currentPlayer);

    if (this.currentPlayer === this.playerColor) {
      this.statusEl.textContent = this.playerColor === Player.Black
        ? `⚫ 轮到你了（可下 ${validMoves.length} 处）`
        : `⚪ 轮到你了（可下 ${validMoves.length} 处）`;
    } else {
      this.statusEl.textContent = this.playerColor === Player.Black
        ? '⚪ AI 思考中...'
        : '⚫ AI 思考中...';
    }

    this.undoBtn.disabled = this.moveHistory.length < 3;
  }

  private render(): void {
    const validMoves = this.gameStarted && !this.gameOver && this.currentPlayer === this.playerColor
      ? GameLogic.getValidMoves(this.grid, this.playerColor)
      : [];

    this.board.draw(this.grid, validMoves, this.lastMove || undefined);

    // 绘制悬停预览
    if (this.hoverPos && this.gameStarted && !this.gameOver && this.currentPlayer === this.playerColor) {
      this.board.drawHover(this.hoverPos.x, this.hoverPos.y, this.playerColor);
    }

    const { black, white } = GameLogic.countPieces(this.grid);
    this.scoreEl.textContent = `⚫ ${black} : ${white} ⚪`;
  }
}
