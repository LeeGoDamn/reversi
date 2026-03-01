import { BOARD_SIZE, CELL_SIZE, PADDING, Player, Position } from './types';

export class Board {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
  }

  draw(grid: Player[][], validMoves: Position[] = [], lastMove?: Position): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard();
    this.drawValidMoves(validMoves);
    this.drawPieces(grid);
    if (lastMove) {
      this.drawLastMoveMarker(lastMove);
    }
  }

  private drawBoard(): void {
    const ctx = this.ctx;

    ctx.fillStyle = '#1a472a';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.strokeStyle = '#2d5a3d';
    ctx.lineWidth = 1;

    for (let i = 0; i <= BOARD_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(PADDING, PADDING + i * CELL_SIZE);
      ctx.lineTo(PADDING + BOARD_SIZE * CELL_SIZE, PADDING + i * CELL_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(PADDING + i * CELL_SIZE, PADDING);
      ctx.lineTo(PADDING + i * CELL_SIZE, PADDING + BOARD_SIZE * CELL_SIZE);
      ctx.stroke();
    }

    const starPoints = [2, 6];
    ctx.fillStyle = '#2d5a3d';
    for (const x of starPoints) {
      for (const y of starPoints) {
        ctx.beginPath();
        ctx.arc(
          PADDING + x * CELL_SIZE,
          PADDING + y * CELL_SIZE,
          5, 0, Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  private drawValidMoves(moves: Position[]): void {
    const ctx = this.ctx;
    
    for (const move of moves) {
      const centerX = PADDING + move.x * CELL_SIZE + CELL_SIZE / 2;
      const centerY = PADDING + move.y * CELL_SIZE + CELL_SIZE / 2;

      ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, CELL_SIZE / 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, CELL_SIZE / 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawPieces(grid: Player[][]): void {
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (grid[x][y] !== Player.Empty) {
          this.drawPiece(x, y, grid[x][y]);
        }
      }
    }
  }

  private drawPiece(x: number, y: number, player: Player): void {
    const centerX = PADDING + x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = PADDING + y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 8;

    const ctx = this.ctx;
    
    ctx.beginPath();
    ctx.arc(centerX + 2, centerY + 2, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(
      centerX - radius * 0.3, centerY - radius * 0.3, 0,
      centerX, centerY, radius
    );

    if (player === Player.Black) {
      gradient.addColorStop(0, '#4a4a4a');
      gradient.addColorStop(0.5, '#2a2a2a');
      gradient.addColorStop(1, '#0a0a0a');
    } else {
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.5, '#f0f0f0');
      gradient.addColorStop(1, '#d0d0d0');
    }

    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = player === Player.Black ? '#1a1a1a' : '#a0a0a0';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX - radius * 0.25, centerY - radius * 0.25, radius * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = player === Player.Black ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
  }

  private drawLastMoveMarker(pos: Position): void {
    const centerX = PADDING + pos.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = PADDING + pos.y * CELL_SIZE + CELL_SIZE / 2;

    this.ctx.strokeStyle = '#ef4444';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, CELL_SIZE / 2 - 6, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  drawHover(x: number, y: number, player: Player): void {
    const centerX = PADDING + x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = PADDING + y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 8;

    const ctx = this.ctx;
    
    // 绘制半透明的预览棋子
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(
      centerX - radius * 0.3, centerY - radius * 0.3, 0,
      centerX, centerY, radius
    );

    if (player === Player.Black) {
      gradient.addColorStop(0, 'rgba(74, 74, 74, 0.5)');
      gradient.addColorStop(0.5, 'rgba(42, 42, 42, 0.5)');
      gradient.addColorStop(1, 'rgba(10, 10, 10, 0.5)');
    } else {
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      gradient.addColorStop(0.5, 'rgba(240, 240, 240, 0.6)');
      gradient.addColorStop(1, 'rgba(208, 208, 208, 0.6)');
    }

    ctx.fillStyle = gradient;
    ctx.fill();
    
    // 边框
    ctx.strokeStyle = player === Player.Black ? 'rgba(26, 26, 26, 0.5)' : 'rgba(160, 160, 160, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 高光
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.25, centerY - radius * 0.25, radius * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = player === Player.Black ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
  }

  getPositionFromEvent(e: MouseEvent): Position | null {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;
    
    const x = Math.floor((clickX - PADDING) / CELL_SIZE);
    const y = Math.floor((clickY - PADDING) / CELL_SIZE);

    if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      return { x, y };
    }
    return null;
  }
}
