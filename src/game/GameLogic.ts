import { BOARD_SIZE, Player, Position, DIRECTIONS } from './types';

export class GameLogic {
  // 创建初始棋盘
  static createInitialBoard(): Player[][] {
    const board = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(Player.Empty));
    
    // 初始4个棋子
    const mid = BOARD_SIZE / 2;
    board[mid - 1][mid - 1] = Player.White;
    board[mid][mid] = Player.White;
    board[mid - 1][mid] = Player.Black;
    board[mid][mid - 1] = Player.Black;
    
    return board;
  }

  // 检查某个位置是否可以下棋
  static isValidMove(board: Player[][], x: number, y: number, player: Player): boolean {
    if (board[x][y] !== Player.Empty) return false;
    
    const opponent = player === Player.Black ? Player.White : Player.Black;
    
    for (const { x: dx, y: dy } of DIRECTIONS) {
      let nx = x + dx;
      let ny = y + dy;
      let foundOpponent = false;
      
      while (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
        if (board[nx][ny] === opponent) {
          foundOpponent = true;
        } else if (board[nx][ny] === player && foundOpponent) {
          return true;
        } else {
          break;
        }
        nx += dx;
        ny += dy;
      }
    }
    
    return false;
  }

  // 获取所有有效移动
  static getValidMoves(board: Player[][], player: Player): Position[] {
    const moves: Position[] = [];
    
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (this.isValidMove(board, x, y, player)) {
          moves.push({ x, y });
        }
      }
    }
    
    return moves;
  }

  // 执行移动并翻转棋子
  static makeMove(board: Player[][], x: number, y: number, player: Player): Player[][] {
    const newBoard = board.map(row => [...row]);
    newBoard[x][y] = player;
    
    const opponent = player === Player.Black ? Player.White : Player.Black;
    
    for (const { x: dx, y: dy } of DIRECTIONS) {
      const toFlip: Position[] = [];
      let nx = x + dx;
      let ny = y + dy;
      
      while (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
        if (newBoard[nx][ny] === opponent) {
          toFlip.push({ x: nx, y: ny });
        } else if (newBoard[nx][ny] === player) {
          // 翻转所有对手棋子
          for (const pos of toFlip) {
            newBoard[pos.x][pos.y] = player;
          }
          break;
        } else {
          break;
        }
        nx += dx;
        ny += dy;
      }
    }
    
    return newBoard;
  }

  // 计算棋子数量
  static countPieces(board: Player[][]): { black: number; white: number } {
    let black = 0, white = 0;
    
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (board[x][y] === Player.Black) black++;
        else if (board[x][y] === Player.White) white++;
      }
    }
    
    return { black, white };
  }

  // 检查游戏是否结束
  static isGameOver(board: Player[][]): boolean {
    return this.getValidMoves(board, Player.Black).length === 0 &&
           this.getValidMoves(board, Player.White).length === 0;
  }

  // 判断当前玩家是否有有效移动
  static hasValidMove(board: Player[][], player: Player): boolean {
    return this.getValidMoves(board, player).length > 0;
  }
}
