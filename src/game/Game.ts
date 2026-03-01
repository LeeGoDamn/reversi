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

  private board: Board;
  private canvas: HTMLCanvasElement;
  private statusEl: HTMLElement;
  private scoreEl: HTMLElement;
  private undoBtn: HTMLButtonElement;
  private resetBtn: HTMLButtonElement;
  private blackBtn: HTMLButtonElement;
  private whiteBtn: HTMLButtonElement;

  private ai: AI;
  private moveHistory: Player[][][];

  constructor() {
    this.grid = GameLogic.createInitialBoard();
    this.currentPlayer = Player.Black;
    this.gameOver = false;
    this.lastMove = null;
    this.gameStarted = false;
    this.playerColor = Player.Black;
    this.moveHistory = [];

    this.board = new Board('gameCanvas');
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.statusEl = document.getElementById('status')!;
    this.scoreEl = document.getElementById('score')!;
    this.undoBtn = document.getElementById('undoBtn') as HTMLButtonElement;
    this.resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
    this.blackBtn = document.getElementById('blackBtn') as HTMLButtonElement;
    this.whiteBtn = document.getElementById('whiteBtn') as HTMLButtonElement;

    const aiColor = this.playerColor === Player.Black ? Player.White : Player.Black;
    this.ai = new AI(this.grid, aiColor);

    this.bindEvents();
    this.render();
  }

  private bindEvents(): void {
    this.blackBtn.addEventListener('click', () => this.startGame(Player.Black));
    this.whiteBtn.addEventListener('click', () => this.startGame(Player.White));
    this.resetBtn.addEventListener('click', () => this.reset());
    this.undoBtn.addEventListener('click', () => this.undo());

    this.canvas.addEventListener('click', (e) => {
      if (!this.gameStarted || this.gameOver || this.currentPlayer !== this.playerColor) return;

      const pos = this.board.getPositionFromEvent(e);
      if (pos && GameLogic.isValidMove(this.grid, pos.x, pos.y, this.playerColor)) {
        this.makeMove(pos.x, pos.y, this.playerColor);
      }
    });
  }

  private startGame(playerColor: Player): void {
    this.playerColor = playerColor;
    this.gameStarted = true;
    this.grid = GameLogic.createInitialBoard();
    this.moveHistory = [this.grid.map(row => [...row])];
    this.gameOver = false;
    this.lastMove = null;
    this.currentPlayer = Player.Black;

    const aiColor = playerColor === Player.Black ? Player.White : Player.Black;
    this.ai = new AI(this.grid, aiColor);

    this.blackBtn.classList.add('hidden');
    this.whiteBtn.classList.add('hidden');
    this.resetBtn.classList.remove('hidden');
    this.undoBtn.classList.remove('hidden');

    this.updateCursor();
    this.updateStatus();
    this.render();

    // 如果玩家执白，AI 先手
    if (playerColor === Player.White) {
      setTimeout(() => this.aiMove(), 500);
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
    this.gameStarted = false;
    this.moveHistory = [];

    this.blackBtn.classList.remove('hidden');
    this.whiteBtn.classList.remove('hidden');
    this.resetBtn.classList.add('hidden');
    this.undoBtn.classList.add('hidden');

    this.canvas.classList.remove('cursor-black', 'cursor-white');

    this.statusEl.textContent = '选择先后手';
    this.statusEl.className = 'text-center text-gray-900 text-lg font-bold min-h-12 bg-gradient-to-r from-amber-100 to-amber-200 px-8 py-3 rounded-2xl shadow-lg border-2 border-amber-400';
    this.render();
  }

  private makeMove(x: number, y: number, player: Player): void {
    this.moveHistory.push(this.grid.map(row => [...row]));
    this.grid = GameLogic.makeMove(this.grid, x, y, player);
    this.lastMove = { x, y };

    this.render();

    // 检查游戏结束
    if (GameLogic.isGameOver(this.grid)) {
      this.endGame();
      return;
    }

    // 切换玩家
    const nextPlayer = player === Player.Black ? Player.White : Player.Black;
    
    // 检查下一个玩家是否有有效移动
    if (GameLogic.hasValidMove(this.grid, nextPlayer)) {
      this.currentPlayer = nextPlayer;
    } else {
      // 跳过，当前玩家继续
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

    // AI 回合
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
      // AI 无子可下
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

    // 撤销两步（玩家 + AI）
    this.moveHistory.pop();
    this.moveHistory.pop();
    this.grid = this.moveHistory[this.moveHistory.length - 1].map(row => [...row]);
    this.lastMove = null;
    this.currentPlayer = this.playerColor;
    this.gameOver = false;

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

    this.statusEl.className = 'text-center text-gray-900 text-lg font-bold min-h-12 bg-gradient-to-r from-amber-100 to-amber-200 px-8 py-3 rounded-2xl shadow-lg border-2 border-amber-400';

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

    // 更新比分
    const { black, white } = GameLogic.countPieces(this.grid);
    this.scoreEl.textContent = `⚫ ${black} : ${white} ⚪`;
  }
}
