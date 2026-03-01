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

    // 绿色背景
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 网格线
    ctx.strokeStyle = '#1a6b1a';
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

    // 四个星位点
    const starPoints = [2, 6];
    ctx.fillStyle = '#1a6b1a';
    for (const x of starPoints) {
      for (const y of starPoints) {
        ctx.beginPath();
        ctx.arc(
          PADDING + x * CELL_SIZE,
          PADDING + y * CELL_SIZE,
          4, 0, Math.PI * 2
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

      ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, CELL_SIZE / 3, 0, Math.PI * 2);
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
    const radius = CELL_SIZE / 2 - 4;

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

    const gradient = this.ctx.createRadialGradient(
      centerX - 5, centerY - 5, 0,
      centerX, centerY, radius
    );

    if (player === Player.Black) {
      gradient.addColorStop(0, '#555');
      gradient.addColorStop(1, '#000');
    } else {
      gradient.addColorStop(0, '#fff');
      gradient.addColorStop(1, '#ccc');
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // 边框
    this.ctx.strokeStyle = player === Player.Black ? '#333' : '#999';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  private drawLastMoveMarker(pos: Position): void {
    const centerX = PADDING + pos.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = PADDING + pos.y * CELL_SIZE + CELL_SIZE / 2;

    this.ctx.strokeStyle = '#ff0000';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  drawHover(x: number, y: number, player: Player): void {
    const centerX = PADDING + x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = PADDING + y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 4;

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    
    if (player === Player.Black) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    } else {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
    this.ctx.fill();
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
