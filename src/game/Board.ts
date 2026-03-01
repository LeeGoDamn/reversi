import { BOARD_SIZE, CELL_SIZE, PADDING, Player, Position } from './types';

export class Board {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private boardOffset: number;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.boardOffset = (this.canvas.width - (BOARD_SIZE * CELL_SIZE + PADDING * 2)) / 2;
  }

  draw(grid: Player[][], validMoves: Position[] = [], lastMove?: Position): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard();
    this.drawPieces(grid);
    this.drawValidMoves(validMoves);
    if (lastMove) {
      this.drawLastMoveMarker(lastMove);
    }
  }

  private drawBoard(): void {
    const ctx = this.ctx;
    const boardSize = BOARD_SIZE * CELL_SIZE + PADDING * 2;

    // 圆角矩形背景
    ctx.fillStyle = '#145a3e';
    ctx.beginPath();
    ctx.roundRect(this.boardOffset, this.boardOffset, boardSize, boardSize, 24);
    ctx.fill();

    // 棋盘格子
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        const cellX = this.boardOffset + PADDING + x * CELL_SIZE;
        const cellY = this.boardOffset + PADDING + y * CELL_SIZE;

        ctx.fillStyle = (x + y) % 2 === 0 ? '#166644' : '#156b48';
        ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
      }
    }

    // 网格线
    ctx.strokeStyle = '#1d7a52';
    ctx.lineWidth = 1;

    for (let i = 0; i <= BOARD_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(this.boardOffset + PADDING, this.boardOffset + PADDING + i * CELL_SIZE);
      ctx.lineTo(this.boardOffset + PADDING + BOARD_SIZE * CELL_SIZE, this.boardOffset + PADDING + i * CELL_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.boardOffset + PADDING + i * CELL_SIZE, this.boardOffset + PADDING);
      ctx.lineTo(this.boardOffset + PADDING + i * CELL_SIZE, this.boardOffset + PADDING + BOARD_SIZE * CELL_SIZE);
      ctx.stroke();
    }

    // 星位点
    const starPoints = [2, 6];
    ctx.fillStyle = '#1d7a52';
    for (const sx of starPoints) {
      for (const sy of starPoints) {
        ctx.beginPath();
        ctx.arc(
          this.boardOffset + PADDING + sx * CELL_SIZE,
          this.boardOffset + PADDING + sy * CELL_SIZE,
          5, 0, Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  private drawValidMoves(moves: Position[]): void {
    const ctx = this.ctx;

    for (const move of moves) {
      const centerX = this.boardOffset + PADDING + move.x * CELL_SIZE + CELL_SIZE / 2;
      const centerY = this.boardOffset + PADDING + move.y * CELL_SIZE + CELL_SIZE / 2;

      // 外圈光晕
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, CELL_SIZE / 3);
      gradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, CELL_SIZE / 3, 0, Math.PI * 2);
      ctx.fill();

      // 内圈实心点
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(centerX, centerY, CELL_SIZE / 7, 0, Math.PI * 2);
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
    const centerX = this.boardOffset + PADDING + x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = this.boardOffset + PADDING + y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 8;

    const ctx = this.ctx;

    // 阴影
    ctx.beginPath();
    ctx.arc(centerX + 3, centerY + 3, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    // 棋子本体
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(
      centerX - radius * 0.35, centerY - radius * 0.35, 0,
      centerX, centerY, radius
    );

    if (player === Player.Black) {
      gradient.addColorStop(0, '#666');
      gradient.addColorStop(0.4, '#444');
      gradient.addColorStop(1, '#222');
    } else {
      gradient.addColorStop(0, '#fff');
      gradient.addColorStop(0.4, '#f5f5f5');
      gradient.addColorStop(1, '#ddd');
    }

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = player === Player.Black ? '#333' : '#aaa';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 高光
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = player === Player.Black ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.7)';
    ctx.fill();
  }

  private drawLastMoveMarker(pos: Position): void {
    const centerX = this.boardOffset + PADDING + pos.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = this.boardOffset + PADDING + pos.y * CELL_SIZE + CELL_SIZE / 2;

    this.ctx.strokeStyle = '#f43f5e';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, CELL_SIZE / 2 - 6, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  drawHover(x: number, y: number, player: Player): void {
    const centerX = this.boardOffset + PADDING + x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = this.boardOffset + PADDING + y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 8;

    const ctx = this.ctx;

    // 外圈高亮
    ctx.strokeStyle = player === Player.Black ? 'rgba(255, 255, 255, 0.8)' : 'rgba(100, 100, 100, 0.8)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
    ctx.stroke();

    // 预览棋子 - 高不透明度
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(
      centerX - radius * 0.35, centerY - radius * 0.35, 0,
      centerX, centerY, radius
    );

    if (player === Player.Black) {
      gradient.addColorStop(0, 'rgba(102, 102, 102, 0.85)');
      gradient.addColorStop(0.4, 'rgba(68, 68, 68, 0.85)');
      gradient.addColorStop(1, 'rgba(34, 34, 34, 0.85)');
    } else {
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.4, 'rgba(245, 245, 245, 0.9)');
      gradient.addColorStop(1, 'rgba(221, 221, 221, 0.9)');
    }

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = player === Player.Black ? 'rgba(51, 51, 51, 0.85)' : 'rgba(170, 170, 170, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 高光
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = player === Player.Black ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
  }

  getPositionFromEvent(e: MouseEvent): Position | null {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const x = Math.floor((clickX - PADDING - this.boardOffset) / CELL_SIZE);
    const y = Math.floor((clickY - PADDING - this.boardOffset) / CELL_SIZE);

    if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      return { x, y };
    }
    return null;
  }
}
